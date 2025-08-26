"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { ProjectCard } from "@/components/projects/project-card"
import { ProjectDetail } from "@/components/projects/project-detail"
import { TrashPage } from "@/components/trash/trash-page"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { DashboardLayout } from "./dashboard-layout"
import { useProjects } from "@/contexts/projects-context"
import { useTasks } from "@/contexts/tasks-context"
import type { Project } from "@/contexts/projects-context"

export function DashboardHome() {
  const { projects } = useProjects()
  const { getTaskStats, getDeletedTasks } = useTasks()
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showTrash, setShowTrash] = useState(false)
  const [currentView, setCurrentView] = useState("home")

  const overallStats = getTaskStats()
  const deletedTasks = getDeletedTasks()

  const handleNavigate = (view: string) => {
    setCurrentView(view)
    setSelectedProject(null)
    setShowTrash(false)
  }

  if (currentView === "analytics") {
    return (
      <DashboardLayout currentView={currentView} onNavigate={handleNavigate}>
        <AnalyticsDashboard onBack={() => setCurrentView("home")} />
      </DashboardLayout>
    )
  }

  if (showTrash) {
    return (
      <DashboardLayout currentView={currentView} onNavigate={handleNavigate}>
        <TrashPage onBack={() => setShowTrash(false)} />
      </DashboardLayout>
    )
  }

  if (selectedProject) {
    return (
      <DashboardLayout currentView={currentView} onNavigate={handleNavigate}>
        <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentView={currentView} onNavigate={handleNavigate}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to TaskForge</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Organize your projects and tasks with precision and clarity
          </p>
          <div className="flex items-center justify-center space-x-4">
            <CreateProjectDialog />
            {deletedTasks.length > 0 && (
              <Button variant="outline" onClick={() => setShowTrash(true)} className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Trash ({deletedTasks.length})</span>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {projects.length === 0 ? "No projects yet" : `${projects.length} active projects`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.completed}</div>
              <p className="text-xs text-muted-foreground">Tasks completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Active tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.new}</div>
              <p className="text-xs text-muted-foreground">Tasks to start</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {deletedTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5" />
                <span>Trash</span>
              </CardTitle>
              <CardDescription>
                You have {deletedTasks.length} deleted task{deletedTasks.length !== 1 ? "s" : ""} that can be restored
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => setShowTrash(true)} className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>View Trash ({deletedTasks.length})</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your Projects</h3>
              <CreateProjectDialog />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={setEditingProject}
                  onOpen={setSelectedProject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Getting Started - only show when no projects */}
        {projects.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Follow these steps to set up your first project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <span>Create your first project to organize related tasks</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <span>Add tasks and break them down into subtasks</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                  3
                </div>
                <span>Track progress and mark tasks as complete</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
