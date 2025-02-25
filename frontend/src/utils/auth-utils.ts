// Get the stored token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set an auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove the auth token (for logout)
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Get the current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Create an authenticated fetch wrapper
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
    },
  };
  
  return fetch(url, authOptions);
};

// Create logout function
export const logout = () => {
  removeAuthToken();
  // You can add any additional cleanup here
  window.location.href = '/login';
};