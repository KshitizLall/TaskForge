"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { projectsAPI } from "@/lib/api";

export type ProjectStatus = "active" | "on-hold" | "completed" | "archived";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  userId: string;
  status: ProjectStatus;
  priority: Priority;
  dueDate?: string;
  progress: number; // 0-100 percentage
  tags: string[];
  lastUpdated: string;
  notes: string;
}

interface ProjectsContextType {
  projects: Project[];
  createProject: (
    name: string,
    description: string,
    color: string
  ) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  isLoading: boolean;
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      return;
    }

    setIsLoading(true);
    try {
      const backendProjects = await projectsAPI.getAll();

      // Transform backend data to frontend format
      const transformedProjects: Project[] = backendProjects.map(
        (project: any) => ({
          id: project._id || project.id,
          name: project.name || project.title,
          description: project.description || "",
          color: project.color || "#3b82f6",
          createdAt: project.createdAt || new Date().toISOString(),
          userId: project.user_id || project.userId || user.id,
          status: project.status || "active",
          priority: project.priority || "medium",
          dueDate: project.dueDate,
          progress: project.progress || 0,
          tags: project.tags || [],
          lastUpdated:
            project.updatedAt ||
            project.lastUpdated ||
            new Date().toISOString(),
          notes: project.notes || "",
        })
      );

      setProjects(transformedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Fallback to localStorage if API fails
      const localProjects = JSON.parse(
        localStorage.getItem("taskforge-projects") || "[]"
      );
      const userProjects = localProjects.filter(
        (project: Project) => project.userId === user.id
      );
      setProjects(userProjects);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async (
    name: string,
    description: string,
    color: string
  ) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newProject = await projectsAPI.create({
        name,
        description,
        color,
        status: "active",
        priority: "medium",
        tags: [],
        notes: "",
      });

      // Add to local state
      const projectData: Project = {
        id: newProject._id || newProject.id,
        name,
        description,
        color,
        createdAt: new Date().toISOString(),
        userId: user.id,
        status: "active",
        priority: "medium",
        progress: 0,
        tags: [],
        lastUpdated: new Date().toISOString(),
        notes: "",
      };

      setProjects((prev) => [...prev, projectData]);
    } catch (error) {
      console.error("Error creating project:", error);
      // Fallback to localStorage
      const newProject: Project = {
        id: Date.now().toString(),
        name,
        description,
        color,
        createdAt: new Date().toISOString(),
        userId: user.id,
        status: "active",
        priority: "medium",
        progress: 0,
        tags: [],
        lastUpdated: new Date().toISOString(),
        notes: "",
      };

      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);

      // Save to localStorage as backup
      const allProjects = JSON.parse(
        localStorage.getItem("taskforge-projects") || "[]"
      );
      const otherUsersProjects = allProjects.filter(
        (project: Project) => project.userId !== user.id
      );
      localStorage.setItem(
        "taskforge-projects",
        JSON.stringify([...otherUsersProjects, ...updatedProjects])
      );
    }
    setIsLoading(false);
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setIsLoading(true);
    try {
      await projectsAPI.update(id, updates);

      const updatedProjects = projects.map((project) =>
        project.id === id
          ? {
              ...project,
              ...updates,
              lastUpdated: new Date().toISOString(),
            }
          : project
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error updating project:", error);
      // Fallback to localStorage
      const updatedProjects = projects.map((project) =>
        project.id === id
          ? {
              ...project,
              ...updates,
              lastUpdated: new Date().toISOString(),
            }
          : project
      );
      setProjects(updatedProjects);
    }
    setIsLoading(false);
  };

  const deleteProject = async (id: string) => {
    setIsLoading(true);
    try {
      await projectsAPI.delete(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      // Fallback to localStorage
      setProjects((prev) => prev.filter((project) => project.id !== id));
    }
    setIsLoading(false);
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        createProject,
        updateProject,
        deleteProject,
        getProject,
        isLoading,
        refreshProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
