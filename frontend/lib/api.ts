// API base configuration and service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('taskforge-token')
}

// Helper function to make authenticated requests
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken()
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem('taskforge-token')
      localStorage.removeItem('taskforge-user')
      window.location.href = '/'
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Auth API
export const authAPI = {
  signup: async (userData: {
    username: string
    password: string
    first_name: string
    last_name: string
    email: string
    role?: string
    gender?: string
  }) => {
    return makeRequest<{ message: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        role: userData.role || 'user',
        gender: userData.gender || 'not_specified',
      }),
    })
  },

  signin: async (credentials: { username: string; password: string }) => {
    return makeRequest<{ token: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },
}

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return makeRequest<any[]>('/projects')
  },

  getById: async (id: string) => {
    return makeRequest<any>(`/projects/${id}`)
  },

  create: async (projectData: {
    name: string
    description: string
    color?: string
    status?: string
    priority?: string
    dueDate?: string
    tags?: string[]
    notes?: string
  }) => {
    return makeRequest<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  },

  update: async (id: string, updates: any) => {
    return makeRequest<any>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string) => {
    return makeRequest<any>(`/projects/${id}`, {
      method: 'DELETE',
    })
  },
}

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    return makeRequest<any[]>('/tasks')
  },

  getById: async (id: string) => {
    return makeRequest<any>(`/tasks/${id}`)
  },

  create: async (taskData: {
    title: string
    description: string
    project_id: string
    status?: string
    priority?: string
    dueDate?: string
    tags?: string[]
  }) => {
    return makeRequest<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  },

  update: async (id: string, updates: any) => {
    return makeRequest<any>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string) => {
    return makeRequest<any>(`/tasks/${id}`, {
      method: 'DELETE',
    })
  },
}

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return makeRequest<any>('/dashboard')
  },
}
