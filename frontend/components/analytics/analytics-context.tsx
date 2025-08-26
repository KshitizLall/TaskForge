"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useProjects } from "@/contexts/projects-context"
import { useTasks } from "@/contexts/tasks-context"

interface AnalyticsData {
  projectProgress: Array<{ name: string; completed: number; total: number; percentage: number }>
  taskCompletionTrend: Array<{ date: string; completed: number; created: number }>
  overdueTasks: Array<{ id: string; title: string; dueDate: string; projectName: string; daysOverdue: number }>
  priorityDistribution: Array<{ priority: string; count: number; percentage: number }>
  velocityData: Array<{ week: string; completed: number; estimated: number }>
  tagAnalysis: Array<{ tag: string; count: number; completed: number; completionRate: number }>
}

interface AnalyticsContextType {
  getAnalyticsData: () => AnalyticsData
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { projects } = useProjects()
  const { getAllTasks } = useTasks()

  const getAnalyticsData = (): AnalyticsData => {
    const allTasks = getAllTasks()
    const now = new Date()

    // Project Progress
    const projectProgress = projects.map((project) => {
      const projectTasks = allTasks.filter((task) => task.projectId === project.id && !task.deleted)
      const completed = projectTasks.filter((task) => task.status === "completed").length
      const total = projectTasks.length
      return {
        name: project.name,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })

    // Task Completion Trend (last 7 days)
    const taskCompletionTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const completed = allTasks.filter((task) => task.completedAt && task.completedAt.startsWith(dateStr)).length

      const created = allTasks.filter((task) => task.createdAt.startsWith(dateStr)).length

      taskCompletionTrend.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        completed,
        created,
      })
    }

    // Overdue Tasks
    const overdueTasks = allTasks
      .filter((task) => task.dueDate && new Date(task.dueDate) < now && task.status !== "completed" && !task.deleted)
      .map((task) => {
        const project = projects.find((p) => p.id === task.projectId)
        const daysOverdue = Math.ceil((now.getTime() - new Date(task.dueDate!).getTime()) / (1000 * 60 * 60 * 24))
        return {
          id: task.id,
          title: task.title,
          dueDate: task.dueDate!,
          projectName: project?.name || "Unknown Project",
          daysOverdue,
        }
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue)

    // Priority Distribution
    const priorityCounts = { urgent: 0, high: 0, medium: 0, low: 0 }
    allTasks
      .filter((task) => !task.deleted)
      .forEach((task) => {
        priorityCounts[task.priority as keyof typeof priorityCounts]++
      })

    const totalTasks = Object.values(priorityCounts).reduce((sum, count) => sum + count, 0)
    const priorityDistribution = Object.entries(priorityCounts).map(([priority, count]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      count,
      percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
    }))

    // Velocity Data (last 4 weeks)
    const velocityData = []
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - i * 7 - weekStart.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const weekTasks = allTasks.filter((task) => {
        const taskDate = new Date(task.createdAt)
        return taskDate >= weekStart && taskDate <= weekEnd
      })

      const completed = weekTasks.filter((task) => task.status === "completed").length
      const estimated = weekTasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0) / 60 // Convert to hours

      velocityData.push({
        week: `Week ${4 - i}`,
        completed,
        estimated: Math.round(estimated * 10) / 10, // Round to 1 decimal
      })
    }

    // Tag Analysis
    const tagCounts: Record<string, { total: number; completed: number }> = {}
    allTasks
      .filter((task) => !task.deleted)
      .forEach((task) => {
        task.tags.forEach((tag) => {
          if (!tagCounts[tag]) {
            tagCounts[tag] = { total: 0, completed: 0 }
          }
          tagCounts[tag].total++
          if (task.status === "completed") {
            tagCounts[tag].completed++
          }
        })
      })

    const tagAnalysis = Object.entries(tagCounts)
      .map(([tag, data]) => ({
        tag,
        count: data.total,
        completed: data.completed,
        completionRate: Math.round((data.completed / data.total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 tags

    return {
      projectProgress,
      taskCompletionTrend,
      overdueTasks,
      priorityDistribution,
      velocityData,
      tagAnalysis,
    }
  }

  return <AnalyticsContext.Provider value={{ getAnalyticsData }}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
