import {
  AlertCircle,
  BarChart,
  CheckCircle,
  CheckSquare,
  Clock,
  Folder,
  Hourglass,
  Loader2,
  Plus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { authFetch } from "../utils/auth-utils";

// Define the dashboard data interface
interface DashboardData {
  totalProjects: number;
  totalTasks: number;
  totalCompletedTasks: number;
  taskSummary: {
    notStarted: number;
    onProgress: number;
    completed: number;
  };
  tasksPerProject: {
    [key: string]: number;
  };
  pendingPointsPerProject: {
    [key: string]: number;
  };
  overallProgress: {
    notStarted: number;
    onProgress: number;
    completed: number;
  };
  upcomingDeadlines: any[];
  avgCompletionTime: number;
  recentActivities: {
    taskId: string;
    title: string;
    status: string;
    updatedAt: string;
  }[];
}

interface ProjectForm {
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [projectForm, setProjectForm] = useState<ProjectForm>({
    title: "",
    description: "",
  });
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await authFetch(
          "http://localhost:3001/api/dashboard/overview"
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch dashboard data"
          );
        }

        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle project form input changes
  const handleProjectInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle project form submission
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectForm.title.trim()) {
      return; // Prevent submission if title is empty
    }

    try {
      setCreateLoading(true);

      const response = await authFetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: projectForm.title,
          description: projectForm.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      // Refresh dashboard data
      fetchDashboardData();

      // Reset form and close modal
      setProjectForm({ title: "", description: "" });
      setShowProjectModal(false);
    } catch (err) {
      console.error("Project creation error:", err);
      alert(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setCreateLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authFetch(
        "http://localhost:3001/api/dashboard/overview"
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate progress percentage
  const calculateProgressPercentage = () => {
    if (!dashboardData) return 0;

    const total = dashboardData.totalTasks;
    if (total === 0) return 0;

    return Math.round((dashboardData.totalCompletedTasks / total) * 100);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-500";
      case "on progress":
        return "text-amber-500";
      case "not started":
        return "text-stone-500";
      default:
        return "text-gray-500";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "on progress":
        return <Hourglass className="w-4 h-4 text-amber-500" />;
      case "not started":
        return <Clock className="w-4 h-4 text-stone-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-stone-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-800">
          Failed to load dashboard
        </h2>
        <p className="mt-2 text-gray-600 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-stone-500 text-white rounded-lg hover:bg-stone-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-800">
          No Data Available
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          There is no dashboard data to display. Start by creating projects and
          tasks.
        </p>
      </div>
    );
  }

  const progressPercentage = calculateProgressPercentage();

  return (
    <>
      <div className="container mx-auto px-4 py-8 pt-20 h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <button
            onClick={() => setShowProjectModal(true)}
            className="flex items-center space-x-1 bg-stone-600 hover:bg-stone-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        {/* Project Creation Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Create New Project
              </h2>

              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={projectForm.description}
                    onChange={handleProjectInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className={`px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors ${
                      createLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {createLoading ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardData.totalProjects}
              </p>
            </div>
            <div className="bg-stone-100 p-3 rounded-full">
              <Folder className="w-6 h-6 text-stone-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardData.totalTasks}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Completed Tasks
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardData.totalCompletedTasks}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Overall Progress
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {progressPercentage}%
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <BarChart className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Task Summary
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Not Started
                  </span>
                  <span className="text-sm font-medium text-stone-600">
                    {dashboardData.taskSummary.notStarted}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-stone-500 h-2 rounded-full"
                    style={{
                      width: `${
                        dashboardData.totalTasks > 0
                          ? (dashboardData.taskSummary.notStarted /
                              dashboardData.totalTasks) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    In Progress
                  </span>
                  <span className="text-sm font-medium text-amber-600">
                    {dashboardData.taskSummary.onProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${
                        dashboardData.totalTasks > 0
                          ? (dashboardData.taskSummary.onProgress /
                              dashboardData.totalTasks) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Completed
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {dashboardData.taskSummary.completed}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        dashboardData.totalTasks > 0
                          ? (dashboardData.taskSummary.completed /
                              dashboardData.totalTasks) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Per Project */}
          <div className="bg-white rounded-xl shadow-md p-6 col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Tasks Per Project
            </h2>

            {Object.keys(dashboardData.tasksPerProject).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(dashboardData.tasksPerProject).map(
                  ([project, count]) => (
                    <div key={project}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {project}
                        </span>
                        <span className="text-sm font-medium text-indigo-600">
                          {count} tasks
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{
                            width: `${
                              dashboardData.totalTasks > 0
                                ? (count / dashboardData.totalTasks) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No projects with tasks
              </p>
            )}
          </div>

          {/* Points Per Project */}
          <div className="bg-white rounded-xl shadow-md p-6 col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Pending Points Per Project
            </h2>

            {Object.keys(dashboardData.pendingPointsPerProject).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(dashboardData.pendingPointsPerProject).map(
                  ([project, points]) => (
                    <div key={project}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {project}
                        </span>
                        <span className="text-sm font-medium text-purple-600">
                          {points} points
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${
                              points > 0
                                ? Math.min((points / 200) * 100, 100)
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No pending points
              </p>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Recent Activities
          </h2>

          {dashboardData.recentActivities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recentActivities.map((activity) => (
                    <tr key={activity.taskId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {activity.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(activity.status)}
                          <span
                            className={`ml-2 ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No recent activities
            </p>
          )}
        </div>
      </div>
      <Footer version="1.0.0" companyName="Kshit_" />
    </>
  );
};

export default Home;
