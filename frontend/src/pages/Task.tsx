import {
  AlertCircle,
  ArrowUpDown,
  Award,
  CheckCircle,
  ChevronDown,
  Clock,
  Edit,
  Filter,
  Layers,
  Loader2,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { authFetch } from "../utils/auth-utils";

// Define interfaces
interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  status: string;
  totalPoints: number;
  dailyPoints: number;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  title: string;
}

interface TaskForm {
  title: string;
  description: string;
  projectId: string;
  totalPoints: number;
  dailyPoints?: number;
  status?: string;
}

const Tasks: React.FC = () => {
  // State variables
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: "",
    description: "",
    projectId: "",
    totalPoints: 0,
    dailyPoints: 0,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [taskDetailModal, setTaskDetailModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  // Fetch tasks and projects on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tasks
        const tasksResponse = await authFetch(
          "http://localhost:3001/api/tasks"
        );

        if (!tasksResponse.ok) {
          const errorData = await tasksResponse.json();
          throw new Error(errorData.message || "Failed to fetch tasks");
        }

        const tasksData = await tasksResponse.json();
        setTasks(tasksData);

        // Fetch projects for the dropdown
        const projectsResponse = await authFetch(
          "http://localhost:3001/api/projects"
        );

        if (!projectsResponse.ok) {
          const errorData = await projectsResponse.json();
          throw new Error(errorData.message || "Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset form state
  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      projectId: "",
      totalPoints: 0,
      dailyPoints: 0,
    });
    setIsEditing(false);
    setCurrentTaskId(null);
  };

  // Open the modal for creating a new task
  const openCreateTaskModal = () => {
    resetForm();
    setShowTaskModal(true);
  };

  // Open the modal for editing a task
  const openEditTaskModal = async (taskId: string) => {
    try {
      setLoading(true);

      const response = await authFetch(
        `http://localhost:3001/api/tasks/${taskId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch task");
      }

      const taskData = await response.json();

      setTaskForm({
        title: taskData.title,
        description: taskData.description,
        projectId: taskData.project,
        totalPoints: taskData.totalPoints,
        dailyPoints: taskData.dailyPoints,
        status: taskData.status,
      });

      setIsEditing(true);
      setCurrentTaskId(taskId);
      setShowTaskModal(true);
    } catch (err) {
      console.error("Error fetching task for edit:", err);
      toast.error(err instanceof Error ? err.message : "Failed to fetch task");
    } finally {
      setLoading(false);
    }
  };

  // View task details
  const viewTaskDetails = async (taskId: string) => {
    try {
      setLoading(true);

      const response = await authFetch(
        `http://localhost:3001/api/tasks/${taskId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch task");
      }

      const taskData = await response.json();
      setSelectedTask(taskData);
      setTaskDetailModal(true);
    } catch (err) {
      console.error("Error fetching task details:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch task details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Confirm task deletion
  const confirmDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId);
    setDeleteConfirmModal(true);
  };

  // Delete a task
  const deleteTask = async () => {
    if (!deleteTaskId) return;

    try {
      setLoading(true);

      const response = await authFetch(
        `http://localhost:3001/api/tasks/${deleteTaskId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }

      // Remove the task from the state
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== deleteTaskId)
      );

      // Close the task detail modal if it's open
      if (
        taskDetailModal &&
        selectedTask &&
        selectedTask._id === deleteTaskId
      ) {
        setTaskDetailModal(false);
        setSelectedTask(null);
      }

      // Close the delete confirmation modal
      setDeleteConfirmModal(false);
      setDeleteTaskId(null);

      toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: name === "totalPoints" ? Number(value) : value,
    }));
  };

  // Handle form submission for create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskForm.title.trim() || !taskForm.projectId) {
      toast.error("Title and Project are required");
      return;
    }

    try {
      setFormSubmitting(true);

      if (isEditing && currentTaskId) {
        // Update existing task
        const response = await authFetch(
          `http://localhost:3001/api/tasks/${currentTaskId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: taskForm.title,
              description: taskForm.description,
              totalPoints: taskForm.totalPoints,
              dailyPoints: taskForm.dailyPoints || 0,
              status: taskForm.status,
            }),
          }
        );

        console.log("Update task response status:", response.status);
        const responseData = await response.json();
        console.log("Update task response data:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || "Failed to update task");
        }

        // Update the task in state - expecting either the task directly or in a 'task' property
        const updatedTask = responseData.task || responseData;

        // Update the task in state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === currentTaskId
              ? {
                  ...task,
                  title: updatedTask.title || task.title,
                  description: updatedTask.description || task.description,
                  totalPoints: updatedTask.totalPoints || task.totalPoints,
                  dailyPoints:
                    updatedTask.dailyPoints !== undefined
                      ? updatedTask.dailyPoints
                      : task.dailyPoints,
                  status: updatedTask.status || task.status,
                  updatedAt: updatedTask.updatedAt || new Date().toISOString(),
                }
              : task
          )
        );
      } else {
        // Create new task
        const response = await authFetch("http://localhost:3001/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: taskForm.title,
            description: taskForm.description,
            projectId: taskForm.projectId,
            totalPoints: taskForm.totalPoints,
            dailyPoints: taskForm.dailyPoints || 0,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create task");
        }

        const data = await response.json();

        // Add the new task to state
        setTasks((prevTasks) => [...prevTasks, data.task]);
      }

      // Reset form and close modal
      resetForm();
      setShowTaskModal(false);

      toast.success(
        isEditing ? "Task updated successfully" : "Task created successfully"
      );
    } catch (err) {
      console.error("Task form submission error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to process task"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get project title by ID
  const getProjectTitle = (projectId: string) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.title : "Unknown Project";
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "on progress":
        return "bg-amber-100 text-amber-800";
      case "not started":
        return "bg-stone-100 text-stone-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "on progress":
        return <Clock className="w-4 h-4 animate-pulse" />;
      case "not started":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Apply status filter
      if (
        statusFilter !== "all" &&
        task.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // Apply project filter
      if (projectFilter !== "all" && task.project !== projectFilter) {
        return false;
      }

      // Apply search term
      if (
        searchTerm &&
        !task.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      let valueA, valueB;

      // Sort by different fields
      switch (sortBy) {
        case "title":
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case "status":
          valueA = a.status.toLowerCase();
          valueB = b.status.toLowerCase();
          break;
        case "points":
          valueA = a.totalPoints;
          valueB = b.totalPoints;
          break;
        case "updatedAt":
        default:
          valueA = new Date(a.updatedAt).getTime();
          valueB = new Date(b.updatedAt).getTime();
      }

      // Apply sort order
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        <Loader2 className="w-12 h-12 text-stone-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
        <button
          onClick={openCreateTaskModal}
          className="flex items-center space-x-2 bg-stone-600 hover:bg-stone-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="not started">Not Started</option>
              <option value="on progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Project Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm appearance-none"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Sort By */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm appearance-none"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setSortOrder("asc");
              }}
            >
              <option value="updatedAt">Last Updated</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
              <option value="points">Points</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {error ? (
          <div className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Error Loading Tasks
            </h3>
            <p className="mt-1 text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
            >
              Try Again
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Layers className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {tasks.length === 0
                ? "You haven't created any tasks yet."
                : "No tasks match your current filters."}
            </p>
            {tasks.length === 0 ? (
              <button
                onClick={openCreateTaskModal}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                Create your first task
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setProjectFilter("all");
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      <span>Task</span>
                      {sortBy === "title" && (
                        <ChevronDown
                          className={`ml-1 h-4 w-4 ${
                            sortOrder === "desc" ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Project
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      {sortBy === "status" && (
                        <ChevronDown
                          className={`ml-1 h-4 w-4 ${
                            sortOrder === "desc" ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("points")}
                  >
                    <div className="flex items-center">
                      <span>Points</span>
                      {sortBy === "points" && (
                        <ChevronDown
                          className={`ml-1 h-4 w-4 ${
                            sortOrder === "desc" ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("updatedAt")}
                  >
                    <div className="flex items-center">
                      <span>Last Updated</span>
                      {sortBy === "updatedAt" && (
                        <ChevronDown
                          className={`ml-1 h-4 w-4 ${
                            sortOrder === "desc" ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => viewTaskDetails(task._id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900 hover:text-stone-600">
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {task.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getProjectTitle(task.project)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                        
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-amber-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {task.totalPoints}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(task.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskForm.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={taskForm.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="projectId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project <span className="text-red-500">*</span>
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  value={taskForm.projectId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                  disabled={isEditing}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Project cannot be changed after creation
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="totalPoints"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Total Points
                </label>
                <input
                  type="number"
                  id="totalPoints"
                  name="totalPoints"
                  value={taskForm.totalPoints}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="dailyPoints"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Daily Points
                </label>
                <input
                  type="number"
                  id="dailyPoints"
                  name="dailyPoints"
                  value={taskForm.dailyPoints || 0}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              {isEditing && (
                <div className="mb-6">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={taskForm.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="On Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className={`px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors ${
                    formSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {formSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update Task"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {taskDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedTask.title}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditTaskModal(selectedTask._id)}
                  className="p-1 text-gray-400 hover:text-stone-500 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setTaskDetailModal(false);
                    setSelectedTask(null);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    selectedTask.status
                  )}`}
                >
                  {getStatusIcon(selectedTask.status)}
                  <span className="ml-1">{selectedTask.status}</span>
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Project</h3>
                <p className="mt-1 text-sm text-gray-800">
                  {getProjectTitle(selectedTask.project)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Description
                </h3>
                <p className="mt-1 text-sm text-gray-800 whitespace-pre-line">
                  {selectedTask.description || "No description provided."}
                </p>
              </div>

              <div className="flex justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Points
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      
                      <div className="flex items-center">
                        <span className="text-sm text-gray-800">
                          {selectedTask.totalPoints}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="mt-1 text-sm text-gray-800">
                    {formatDate(selectedTask.createdAt)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h3>
                  <p className="mt-1 text-sm text-gray-800">
                    {formatDate(selectedTask.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => confirmDeleteTask(selectedTask._id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
              <button
                onClick={() => {
                  setTaskDetailModal(false);
                  setSelectedTask(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Task</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
              >
                Cancel
              </button>
              <button
                onClick={deleteTask}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
