import { authFetch } from "./auth-utils";

export interface Task {
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

export interface Project {
  _id: string;
  title: string;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await authFetch("http://localhost:3001/api/tasks");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch tasks");
  }
  return response.json();
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await authFetch("http://localhost:3001/api/projects");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch projects");
  }
  return response.json();
};

export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await authFetch(`http://localhost:3001/api/tasks/${taskId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch task");
  }
  return response.json();
};

export const createTask = async (values: {
  title: string;
  description: string;
  projectId: string;
  totalPoints: number;
  dailyPoints: number;
}) => {
  const response = await authFetch("http://localhost:3001/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create task");
  }
  return response.json();
};

export const updateTask = async (
  taskId: string,
  values: { title: string; description: string; totalPoints: number; dailyPoints: number; status: string }
) => {
  const response = await authFetch(`http://localhost:3001/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update task");
  }
  return response.json();
};

export const deleteTask = async (taskId: string) => {
  const response = await authFetch(`http://localhost:3001/api/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete task");
  }
  return response.json();
};
