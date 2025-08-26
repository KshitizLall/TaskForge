"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, RotateCcw, Trash2, AlertTriangle } from "lucide-react"
import { useTasks } from "@/contexts/tasks-context"
import { useProjects } from "@/contexts/projects-context"
import { EmptyState } from "@/components/ui/empty-state"

interface TrashPageProps {
  onBack: () => void
}

export function TrashPage({ onBack }: TrashPageProps) {
  const { getDeletedTasks, restoreTask, permanentlyDeleteTask } = useTasks()
  const { getProject } = useProjects()

  const deletedTasks = getDeletedTasks()

  const handleRestore = (taskId: string) => {
    restoreTask(taskId)
  }

  const handlePermanentDelete = (taskId: string) => {
    permanentlyDeleteTask(taskId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Page Title */}
      <div className="flex items-center space-x-3">
        <Trash2 className="h-8 w-8 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trash</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Recover deleted tasks or remove them permanently</p>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Deleted Tasks</CardTitle>
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deletedTasks.length}</div>
          <p className="text-xs text-muted-foreground">
            {deletedTasks.length === 0 ? "No deleted tasks" : "Tasks in trash"}
          </p>
        </CardContent>
      </Card>

      {/* Deleted Tasks */}
      {deletedTasks.length === 0 ? (
        <EmptyState
          icon={<Trash2 className="h-12 w-12" />}
          title="Trash is empty"
          description="Deleted tasks will appear here. You can restore them or delete them permanently."
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Deleted Tasks</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Tasks are automatically deleted after 30 days</span>
            </div>
          </div>

          <div className="grid gap-4">
            {deletedTasks.map((task) => {
              const project = getProject(task.projectId)
              return (
                <Card key={task.id} className="border-destructive/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {project && (
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${project.color}`} />
                              <span className="text-sm text-muted-foreground">{project.name}</span>
                            </div>
                          )}
                          <Badge variant="destructive" className="text-xs">
                            Deleted
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        {task.description && <CardDescription className="mt-1">{task.description}</CardDescription>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Deleted {task.deletedAt ? new Date(task.deletedAt).toLocaleDateString() : "Unknown"}
                        {task.subtasks.length > 0 && <span className="ml-2">• {task.subtasks.length} subtasks</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(task.id)}
                          className="flex items-center space-x-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Restore</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center space-x-2">
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Forever</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete task permanently?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The task "{task.title}" and all its subtasks will be
                                permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handlePermanentDelete(task.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Forever
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
