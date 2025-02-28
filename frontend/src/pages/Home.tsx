import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import ErrorPage from "./exceptions/ErrorPage";
import Loading from "./exceptions/Loading";
import { formatDate } from "../utils/dateUtils";
import { fetchDashboardOverview, createProject } from "../utils/home-api";

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
  tasksPerProject: Record<string, number>;
  pendingPointsPerProject: Record<string, number>;
  recentActivities: {
    taskId: string;
    title: string;
    status: string;
    updatedAt: string;
  }[];
}

// Project form interface
interface ProjectFormValues {
  title: string;
  description: string;
}

// Constants for status-related UI elements
const STATUS_CONFIG = {
  completed: { color: "text-green-500", bgColor: "bg-green-500", icon: CheckCircle },
  "on progress": { color: "text-amber-500", bgColor: "bg-amber-500", icon: Hourglass },
  "not started": { color: "text-stone-500", bgColor: "bg-stone-500", icon: Clock },
  default: { color: "text-gray-500", bgColor: "bg-gray-500", icon: AlertCircle },
};

// Card style configs for more attractive appearance
const CARD_STYLES = [
  { gradient: "from-blue-50 to-indigo-50", border: "border-blue-100", accent: "bg-blue-100" },
  { gradient: "from-green-50 to-teal-50", border: "border-green-100", accent: "bg-green-100" },
  { gradient: "from-amber-50 to-yellow-50", border: "border-amber-100", accent: "bg-amber-100" },
  { gradient: "from-purple-50 to-pink-50", border: "border-purple-100", accent: "bg-purple-100" },
];

// Project form validation schema
const projectSchema = Yup.object().shape({
  title: Yup.string()
    .required("Project title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be less than 50 characters"),
  description: Yup.string().max(500, "Description must be less than 500 characters"),
});

const Home: React.FC = () => {
  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  // Initial form values
  const initialFormValues: ProjectFormValues = {
    title: "",
    description: "",
  };

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardOverview();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle project creation
  const handleCreateProject = async (values: ProjectFormValues, { resetForm, setSubmitting }: any) => {
    try {
      await createProject(values);
      // Refresh dashboard data
      fetchData();
      // Reset form and close panel
      resetForm();
      setShowCreateForm(false);
    } catch (err) {
      console.error("Project creation error:", err);
      alert(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  // UI helper functions
  const calculateProgressPercentage = () => {
    if (!dashboardData || dashboardData.totalTasks === 0) return 0;
    return Math.round((dashboardData.totalCompletedTasks / dashboardData.totalTasks) * 100);
  };

  const getStatusInfo = (status: string) => {
    const statusKey = status.toLowerCase() as keyof typeof STATUS_CONFIG;
    return STATUS_CONFIG[statusKey] || STATUS_CONFIG.default;
  };

  // Handle new project
  const handleNewProject = () => {
    setShowCreateForm(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorPage screenName="Unable to load Dashboard" errorMessage={error} onRetry={fetchData} />;
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h2 className="mt-4 text-2xl font-medium text-gray-800">No Data Available</h2>
        <p className="mt-2 text-gray-600 text-sm text-center">
          Start by creating projects and tasks.
        </p>
        <button
          onClick={handleNewProject}
          className="mt-4 px-6 py-3 bg-stone-600 text-white text-sm rounded-full hover:bg-stone-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>
    );
  }

  const progressPercentage = calculateProgressPercentage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col md:flex-row">
          {/* Main Content */}
          <div className={`${showCreateForm ? "md:w-2/3" : "w-full"} transition-all duration-300`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-medium text-gray-800">Dashboard</h1>
              <button
                onClick={handleNewProject}
                className="flex items-center bg-stone-600 hover:bg-stone-700 text-white py-2 px-4 rounded-full transition-colors text-sm"
              >
                <Plus className="w-5 h-5 mr-1" />
                <span>New Project</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              {[
                { title: "Projects", value: dashboardData.totalProjects, icon: Folder, color: "text-stone-600" },
                { title: "Tasks", value: dashboardData.totalTasks, icon: CheckSquare, color: "text-purple-600" },
                { title: "Completed", value: dashboardData.totalCompletedTasks, icon: CheckCircle, color: "text-green-600" },
                { title: "Progress", value: `${progressPercentage}%`, icon: BarChart, color: "text-amber-600" },
              ].map((stat, index) => {
                const style = CARD_STYLES[index % CARD_STYLES.length];
                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${style.gradient} rounded-lg shadow-sm p-6 flex items-center justify-between border ${style.border} transition-transform duration-200 hover:scale-[1.02]`}
                  >
                    <div>
                      <p className="text-base font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-medium text-gray-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${style.accent}`}>
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Task Summary, Tasks Per Project, and Pending Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Task Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-sm p-6 border border-blue-100 transition-transform duration-200 hover:scale-[1.01]">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Task Summary</h2>
                <div className="space-y-5">
                  {Object.entries(dashboardData.taskSummary).map(([status, count]) => {
                    const statusDisplay =
                      status === "notStarted"
                        ? "Not Started"
                        : status === "onProgress"
                        ? "In Progress"
                        : "Completed";
                    const statusInfo = getStatusInfo(statusDisplay);
                    return (
                      <div key={status}>
                        <div className="flex justify-between mb-2 text-base">
                          <span className="font-medium text-gray-700">{statusDisplay}</span>
                          <span className={`font-medium ${statusInfo.color}`}>{count}</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-60 rounded-full h-2.5 shadow-inner">
                          <div
                            className={`${statusInfo.bgColor} h-2.5 rounded-full shadow-sm`}
                            style={{
                              width: `${
                                dashboardData.totalTasks > 0 ? (count / dashboardData.totalTasks) * 100 : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tasks Per Project */}
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-indigo-100 transition-transform duration-200 hover:scale-[1.01]">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Tasks Per Project</h2>
                {Object.keys(dashboardData.tasksPerProject).length > 0 ? (
                  <div className="space-y-5">
                    {Object.entries(dashboardData.tasksPerProject).map(([project, count], index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2 text-base">
                          <span className="font-medium text-gray-700">{project}</span>
                          <span className="font-medium text-indigo-600">{count}</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-60 rounded-full h-2.5 shadow-inner">
                          <div
                            className="bg-indigo-500 h-2.5 rounded-full shadow-sm"
                            style={{
                              width: `${
                                dashboardData.totalTasks > 0 ? (count / dashboardData.totalTasks) * 100 : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">No projects with tasks</p>
                )}
              </div>

              {/* Pending Points Per Project */}
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg shadow-sm p-6 border border-purple-100 transition-transform duration-200 hover:scale-[1.01]">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Pending Points</h2>
                {Object.keys(dashboardData.pendingPointsPerProject).length > 0 ? (
                  <div className="space-y-5">
                    {Object.entries(dashboardData.pendingPointsPerProject).map(([project, points], index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2 text-base">
                          <span className="font-medium text-gray-700">{project}</span>
                          <span className="font-medium text-purple-600">{points}</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-60 rounded-full h-2.5 shadow-inner">
                          <div
                            className="bg-purple-500 h-2.5 rounded-full shadow-sm"
                            style={{
                              width: `${Math.min((points / 100) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">No pending points</p>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 transition-transform duration-200 hover:scale-[1.005]">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Recent Activities</h2>
              {dashboardData.recentActivities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                          Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dashboardData.recentActivities.map((activity, index) => {
                        const statusInfo = getStatusInfo(activity.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <tr key={index} className="hover:bg-white transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                              {activity.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base">
                              <div className="flex items-center">
                                <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                                <span className={`ml-2 ${statusInfo.color}`}>
                                  {activity.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                              {formatDate(activity.updatedAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No recent activities</p>
              )}
            </div>
          </div>

          {/* Right Side Form using Framer Motion */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="md:w-1/3 md:pl-6 md:mt-0 mt-8"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium text-gray-800">New Project</h2>
                  <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <Formik
                  initialValues={initialFormValues}
                  validationSchema={projectSchema}
                  onSubmit={handleCreateProject}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-base font-medium text-gray-700 mb-1">
                          Project Title <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          id="title"
                          name="title"
                          className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white text-gray-800"
                          placeholder="Enter project title"
                        />
                        <ErrorMessage name="title" component="p" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white text-gray-800"
                          placeholder="Enter project description"
                          rows={3}
                        />
                        <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="pt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowCreateForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-stone-600 text-white rounded-full hover:bg-stone-700 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[100px]"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Project"
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer version="1.0.0" companyName="Kshit_" />
    </div>
  );
};

export default Home;
