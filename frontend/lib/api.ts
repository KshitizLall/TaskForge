// API base configuration and service functions
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("taskforge-token");
};

// Helper function to make authenticated requests
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem("taskforge-token");
      localStorage.removeItem("taskforge-user");
      window.location.href = "/";
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  signup: async (userData: {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
    gender?: string;
  }) => {
    return makeRequest<{ message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        ...userData,
        role: userData.role || "user",
        gender: userData.gender || "not_specified",
      }),
    });
  },

  signin: async (credentials: { username: string; password: string }) => {
    return makeRequest<{
      token: string;
      user: {
        id: string;
        username: string;
        email: string;
        name: string;
      };
    }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return makeRequest<any[]>("/projects");
  },

  getById: async (id: string) => {
    return makeRequest<any>(`/projects/${id}`);
  },

  create: async (projectData: {
    name: string;
    description: string;
    color?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    tags?: string[];
    notes?: string;
  }) => {
    return makeRequest<any>("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  update: async (id: string, updates: any) => {
    return makeRequest<any>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return makeRequest<any>(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  // Trash operations
  getDeleted: async () => {
    return makeRequest<any[]>("/projects/trash");
  },

  restore: async (id: string) => {
    return makeRequest<any>(`/projects/${id}/restore`, {
      method: "PATCH",
    });
  },

  permanentDelete: async (id: string) => {
    return makeRequest<any>(`/projects/${id}/permanent`, {
      method: "DELETE",
    });
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    return makeRequest<any[]>("/tasks");
  },

  getById: async (id: string) => {
    return makeRequest<any>(`/tasks/${id}`);
  },

  create: async (taskData: {
    title: string;
    description: string;
    project_id: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    tags?: string[];
  }) => {
    return makeRequest<any>("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  },

  update: async (id: string, updates: any) => {
    return makeRequest<any>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return makeRequest<any>(`/tasks/${id}`, {
      method: "DELETE",
    });
  },

  // Trash operations
  getDeleted: async () => {
    return makeRequest<any[]>("/tasks/trash");
  },

  restore: async (id: string) => {
    return makeRequest<any>(`/tasks/${id}/restore`, {
      method: "PATCH",
    });
  },

  permanentDelete: async (id: string) => {
    return makeRequest<any>(`/tasks/${id}/permanent`, {
      method: "DELETE",
    });
  },

  // History/Audit trail
  getHistory: async (id: string) => {
    return makeRequest<any>(`/tasks/${id}/history`);
  },

  // Subtask operations
  addSubtask: async (
    taskId: string,
    subtaskData: { title: string; description?: string }
  ) => {
    return makeRequest<any>(`/tasks/${taskId}/subtasks`, {
      method: "POST",
      body: JSON.stringify(subtaskData),
    });
  },

  updateSubtask: async (taskId: string, subtaskId: string, updates: any) => {
    return makeRequest<any>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  deleteSubtask: async (taskId: string, subtaskId: string) => {
    return makeRequest<any>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "DELETE",
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return makeRequest<any>("/dashboard");
  },
};

// Unified Trash API
export const trashAPI = {
  getAllItems: async () => {
    return makeRequest<{
      total: number;
      projects: number;
      tasks: number;
      items: any[];
    }>("/trash");
  },

  restoreItem: async (itemType: "project" | "task", itemId: string) => {
    return makeRequest<any>(`/trash/${itemType}/${itemId}/restore`, {
      method: "PATCH",
    });
  },

  permanentDeleteItem: async (itemType: "project" | "task", itemId: string) => {
    return makeRequest<any>(`/trash/${itemType}/${itemId}/permanent`, {
      method: "DELETE",
    });
  },

  emptyTrash: async () => {
    return makeRequest<any>("/trash/empty", {
      method: "DELETE",
    });
  },
};
