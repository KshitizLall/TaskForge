"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { Task, TaskStatus } from "@/contexts/tasks-context"
import { useTasks } from "@/contexts/tasks-context"
import { SubtaskList } from "./subtask-list"
import { AddSubtaskDialog } from "./add-subtask-dialog"

interface TaskCardProps {
  task: Task
}

const statusConfig = {
  new: { label: "New", color: "bg-blue-500", icon: AlertCircle },
  "in-progress": { label: "In Progress", color: "bg-orange-500", icon: Clock },
  completed: { label: "Completed", color: "bg-green-500", icon: CheckCircle },
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTasks()
  const [showSubtasks, setShowSubtasks] = useState(false)

  const handleStatusChange = (status: TaskStatus) => {
    updateTask(task.id, { status })
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task? It will be moved to trash.")) {
      deleteTask(task.id)
    }
  }

  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = task.subtasks.length
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  const StatusIcon = statusConfig[task.status].icon

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <StatusIcon className="h-3 w-3" />
                <span>{statusConfig[task.status].label}</span>
              </Badge>
            </div>
            <CardTitle className="text-lg">{task.title}</CardTitle>
            {task.description && <CardDescription className="mt-1">{task.description}</CardDescription>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange("new")}>
                <AlertCircle className="mr-2 h-4 w-4" />
                Mark as New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                <Clock className="mr-2 h-4 w-4" />
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtasks Progress */}
        {totalSubtasks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtasks</span>
              <span className="text-muted-foreground">
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
            <Progress value={subtaskProgress} className="h-2" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AddSubtaskDialog taskId={task.id} />
            {totalSubtasks > 0 && (
              <Button variant="outline" size="sm" onClick={() => setShowSubtasks(!showSubtasks)}>
                {showSubtasks ? "Hide" : "Show"} Subtasks ({totalSubtasks})
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">Created {new Date(task.createdAt).toLocaleDateString()}</div>
        </div>

        {/* Subtasks List */}
        {showSubtasks && totalSubtasks > 0 && <SubtaskList taskId={task.id} subtasks={task.subtasks} />}
      </CardContent>
    </Card>
  )
}
