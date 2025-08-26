"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Subtask } from "@/contexts/tasks-context"
import { useTasks } from "@/contexts/tasks-context"

interface SubtaskListProps {
  taskId: string
  subtasks: Subtask[]
}

export function SubtaskList({ taskId, subtasks }: SubtaskListProps) {
  const { updateSubtask, deleteSubtask } = useTasks()

  const handleToggleSubtask = (subtaskId: string, completed: boolean) => {
    updateSubtask(taskId, subtaskId, { completed })
  }

  const handleDeleteSubtask = (subtaskId: string) => {
    if (confirm("Are you sure you want to delete this subtask?")) {
      deleteSubtask(taskId, subtaskId)
    }
  }

  return (
    <div className="space-y-2 border-t pt-4">
      <h4 className="text-sm font-medium text-muted-foreground">Subtasks</h4>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center space-x-2 group">
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={(checked) => handleToggleSubtask(subtask.id, !!checked)}
            />
            <span className={`flex-1 text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSubtask(subtask.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
