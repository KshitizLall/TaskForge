"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, User, ArrowRight, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { useTasks } from "@/contexts/tasks-context"
import { formatDistanceToNow } from "date-fns"

interface TaskHistoryProps {
  taskId: string
  onClose: () => void
}

export function TaskHistory({ taskId, onClose }: TaskHistoryProps) {
  const { getTaskHistory, tasks } = useTasks()
  const history = getTaskHistory(taskId)
  const task = tasks.find((t) => t.id === taskId)

  const getActionIcon = (action: string) => {
    if (action.includes("Created")) return <Plus className="h-4 w-4 text-green-500" />
    if (action.includes("Deleted")) return <Trash2 className="h-4 w-4 text-red-500" />
    if (action.includes("Completed") || action.includes("completed"))
      return <CheckCircle className="h-4 w-4 text-green-500" />
    if (action.includes("Status changed")) return <ArrowRight className="h-4 w-4 text-blue-500" />
    if (action.includes("Priority")) return <AlertCircle className="h-4 w-4 text-orange-500" />
    return <Clock className="h-4 w-4 text-gray-500" />
  }

  const getActionColor = (action: string) => {
    if (action.includes("Created")) return "bg-green-50 border-green-200"
    if (action.includes("Deleted")) return "bg-red-50 border-red-200"
    if (action.includes("Completed") || action.includes("completed")) return "bg-green-50 border-green-200"
    if (action.includes("Status changed")) return "bg-blue-50 border-blue-200"
    if (action.includes("Priority")) return "bg-orange-50 border-orange-200"
    return "bg-gray-50 border-gray-200"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Task History</span>
          </CardTitle>
          <CardDescription>Complete audit trail for "{task?.title}"</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No history available for this task</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${getActionColor(entry.action)}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">{getActionIcon(entry.action)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                        <Badge variant="outline" className="text-xs">
                          {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{entry.userName}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      {entry.field && entry.oldValue !== undefined && entry.newValue !== undefined && (
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">{entry.field}:</span>
                          <span className="mx-2 px-2 py-1 bg-red-100 text-red-700 rounded">
                            {String(entry.oldValue)}
                          </span>
                          <ArrowRight className="h-3 w-3 inline mx-1" />
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            {String(entry.newValue)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
