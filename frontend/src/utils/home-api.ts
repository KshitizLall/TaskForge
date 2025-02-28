import { authFetch } from "./auth-utils";

export const fetchDashboardOverview = async (): Promise<any> => {
    const response = await authFetch("http://localhost:3001/api/dashboard/overview", {
      // You can add your auth headers or any additional config here
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch data");
    }
    return response.json();
  };
  
  export const createProject = async (values: any): Promise<any> => {
    const response = await authFetch("http://localhost:3001/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to create project");
    }
    return response.json();
  };
  