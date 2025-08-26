"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { Project } from "@/contexts/projects-context"
import { useTasks } from "@/contexts/tasks-context"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { TaskCard } from "@/components/tasks/task-card"
import { EmptyState } from "@/components/ui/empty-state"

interface ProjectDetailProps {
  project: Project
  onBack: () => void
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const { getTasksByProject, getTaskStats } = useTasks()
  const [activeTab, setActiveTab] = useState("all")

  const tasks = getTasksByProject(project.id)
  const stats = getTaskStats(project.id)

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    return task.status === activeTab
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      {/* Project Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-6 h-6 rounded-full ${project.color}`} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description || "No description"}</p>
          </div>
        </div>
        <CreateTaskDialog projectId={project.id} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Tasks ({stats.total})</TabsTrigger>
              <TabsTrigger value="new">New ({stats.new})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={<AlertCircle className="h-12 w-12" />}
                title={activeTab === "all" ? "No tasks yet" : `No ${activeTab.replace("-", " ")} tasks`}
                description={
                  activeTab === "all"
                    ? "Create your first task to get started with this project"
                    : `No tasks with ${activeTab.replace("-", " ")} status found`
                }
                action={activeTab === "all" ? <CreateTaskDialog projectId={project.id} /> : undefined}
              />
            ) : (
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
