"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export type ProjectStatus = "active" | "on-hold" | "completed" | "archived"
export type Priority = "low" | "medium" | "high" | "urgent"

export interface Project {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
  userId: string
  status: ProjectStatus
  priority: Priority
  dueDate?: string
  progress: number // 0-100 percentage
  tags: string[]
  lastUpdated: string
  notes: string
}

interface ProjectsContextType {
  projects: Project[]
  createProject: (name: string, description: string, color: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProject: (id: string) => Project | undefined
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Load projects for the current user
      const allProjects = JSON.parse(localStorage.getItem("taskforge-projects") || "[]")
      const userProjects = allProjects.filter((project: Project) => project.userId === user.id)
      setProjects(userProjects)
    } else {
      setProjects([])
    }
  }, [user])

  const saveProjects = (updatedProjects: Project[]) => {
    // Save all projects (for all users) to localStorage
    const allProjects = JSON.parse(localStorage.getItem("taskforge-projects") || "[]")
    const otherUsersProjects = allProjects.filter((project: Project) => project.userId !== user?.id)
    const newAllProjects = [...otherUsersProjects, ...updatedProjects]
    localStorage.setItem("taskforge-projects", JSON.stringify(newAllProjects))
    setProjects(updatedProjects)
  }

  const createProject = (name: string, description: string, color: string) => {
    if (!user) return

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
    }

    const updatedProjects = [...projects, newProject]
    saveProjects(updatedProjects)
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map((project) =>
      project.id === id
        ? {
            ...project,
            ...updates,
            lastUpdated: new Date().toISOString(),
          }
        : project,
    )
    saveProjects(updatedProjects)
  }

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id)
    saveProjects(updatedProjects)
  }

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id)
  }

  return (
    <ProjectsContext.Provider value={{ projects, createProject, updateProject, deleteProject, getProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}
