import React, { useEffect, useState, useMemo } from "react";
import { Loader2, AlertCircle, Layers, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import TaskFilters from "../components/TaskFilters";
import TaskTable, { Task } from "../components/TaskTable";
import TaskForm, { TaskFormValues } from "../components/TaskForm";
import TaskDetails from "../components/TaskDetails";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import {
  getTasks,
  getProjects,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  Project,
} from "../utils/task-api";

// Status configuration for consistent styling
import { CheckCircle, Clock } from "lucide-react";
import Loading from "./exceptions/Loading";
import ErrorPage from "./exceptions/ErrorPage";
const STATUS_CONFIG = {
  completed: {
    color: "text-green-600",
    bgColor: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  "on progress": {
    color: "text-amber-600",
    bgColor: "bg-amber-100 text-amber-800",
    icon: Clock,
    animation: "animate-pulse",
  },
  "not started": {
    color: "text-stone-600",
    bgColor: "bg-stone-100 text-stone-800",
    icon: Clock,
  },
  default: {
    color: "text-gray-600",
    bgColor: "bg-gray-100 text-gray-800",
    icon: Clock,
  },
};

const Tasks: React.FC = () => {
  // Main state variables
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form and selection state
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<any>([
    { id: "updatedAt", desc: true },
  ]);

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getProjectTitle = (projectId: string) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.title : "Unknown Project";
  };

  const getStatusInfo = (status: string) => {
    const statusKey = status.toLowerCase();
    return STATUS_CONFIG[statusKey] || STATUS_CONFIG.default;
  };

  // Fetch tasks and projects using API util functions
  const fetchData = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
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

  useEffect(() => {
    fetchData();
  }, []);

  // Filter tasks based on filter state
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (
        statusFilter !== "all" &&
        task.status.toLowerCase() !== statusFilter.toLowerCase()
      )
        return false;
      if (projectFilter !== "all" && task.project !== projectFilter)
        return false;
      if (
        searchTerm &&
        !task.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [tasks, statusFilter, projectFilter, searchTerm]);

  // Handlers for task operations
  const handleGetTaskById = async (taskId: string) => {
    try {
      setLoading(true);
      const taskData = await getTaskById(taskId);
      return taskData;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch task");
      console.error("Error fetching task:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async (taskId: string) => {
    const taskData = await handleGetTaskById(taskId);
    if (!taskData) return;
    setIsEditing(true);
    setCurrentTaskId(taskId);
    setSelectedTask(taskData);
    setShowCreateForm(true);
  };

  const handleViewTask = async (taskId: string) => {
    const taskData = await handleGetTaskById(taskId);
    if (!taskData) return;
    setSelectedTask(taskData);
    setShowCreateForm(false);
  };

  const handleNewTask = () => {
    setIsEditing(false);
    setCurrentTaskId(null);
    setSelectedTask(null);
    setShowCreateForm(true);
  };

  const confirmDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    try {
      setLoading(true);
      await deleteTask(deleteTaskId);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTaskId));
      if (selectedTask && selectedTask._id === deleteTaskId) {
        setSelectedTask(null);
      }
      setShowDeleteConfirm(false);
      setDeleteTaskId(null);
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (
    values: TaskFormValues,
    { resetForm, setSubmitting }: any
  ) => {
    try {
      if (isEditing && currentTaskId) {
        // Update task
        const updated = await updateTask(currentTaskId, {
          title: values.title,
          description: values.description,
          totalPoints: values.totalPoints,
          dailyPoints: values.dailyPoints || 0,
          status: values.status,
        });
        setTasks((prev) =>
          prev.map((task) =>
            task._id === currentTaskId
              ? { ...task, ...(updated.task || updated) }
              : task
          )
        );
        toast.success("Task updated successfully");
      } else {
        // Create new task
        const data = await createTask({
          title: values.title,
          description: values.description,
          projectId: values.projectId,
          totalPoints: values.totalPoints,
          dailyPoints: values.dailyPoints || 0,
        });
        setTasks((prev) => [...prev, data.task]);
        toast.success("Task created successfully");
      }
      resetForm();
      setShowCreateForm(false);
      setIsEditing(false);
      setCurrentTaskId(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process task"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && tasks.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorPage errorMessage={error} onRetry={fetchData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* Main Content */}
          <div
            className={`${
              showCreateForm ? "md:w-2/3" : "w-full"
            } transition-all duration-300`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-medium text-gray-800">Tasks</h1>
              <button
                onClick={handleNewTask}
                className="flex items-center bg-stone-600 hover:bg-stone-700 text-white py-2 px-4 rounded-full transition-colors text-base"
              >
                <Plus className="w-5 h-5 mr-1" />
                <span>New Task</span>
              </button>
            </div>

            {/* Filters */}
            <TaskFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              projectFilter={projectFilter}
              setProjectFilter={setProjectFilter}
              projects={projects}
            />

            {/* Tasks List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              {error ? (
                <div className="p-6 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Error Loading Tasks
                  </h3>
                  <p className="mt-1 text-gray-500">{error}</p>
                  <button
                    onClick={() => fetchData()}
                    className="mt-4 px-4 py-2 bg-stone-600 text-white text-base rounded-full hover:bg-stone-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto h-16 w-16 text-gray-400">
                    <Layers className="h-full w-full" />
                  </div>
                  <h3 className="mt-2 text-xl font-medium text-gray-900">
                    No tasks found
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {tasks.length === 0
                      ? "You haven't created any tasks yet."
                      : "No tasks match your current filters."}
                  </p>
                  {tasks.length === 0 ? (
                    <button
                      onClick={handleNewTask}
                      className="mt-4 px-5 py-2 bg-stone-600 text-white text-base rounded-full hover:bg-stone-700"
                    >
                      <Plus className="inline-block -ml-1 mr-2 h-4 w-4" />
                      Create your first task
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setProjectFilter("all");
                      }}
                      className="mt-4 px-5 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <TaskTable
                  tasks={filteredTasks}
                  sorting={sorting}
                  setSorting={setSorting}
                  getProjectTitle={getProjectTitle}
                  getStatusInfo={getStatusInfo}
                  handleEditTask={handleEditTask}
                  handleViewTask={handleViewTask}
                />
              )}
            </div>
          </div>

          {/* Right Side Form or Details */}
          {showCreateForm ? (
            <TaskForm
              initialValues={{
                title: selectedTask?.title || "",
                description: selectedTask?.description || "",
                projectId: selectedTask?.project || "",
                totalPoints: selectedTask?.totalPoints || 0,
                dailyPoints: selectedTask?.dailyPoints || 0,
                status: selectedTask?.status || "Not Started",
              }}
              isEditing={isEditing}
              onSubmit={handleTaskSubmit}
              onCancel={() => setShowCreateForm(false)}
              projects={projects}
            />
          ) : (
            selectedTask && (
              <TaskDetails
                task={selectedTask}
                getProjectTitle={getProjectTitle}
                getStatusInfo={getStatusInfo}
                onEdit={handleEditTask}
                onClose={() => setSelectedTask(null)}
                formatDate={formatDate}
                onDelete={confirmDeleteTask}
              />
            )
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <DeleteConfirmDialog
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default Tasks;
