"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, AlertTriangle, Target, Clock } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAnalytics } from "./analytics-context"

interface AnalyticsDashboardProps {
  onBack: () => void
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const { getAnalyticsData } = useAnalytics()
  const data = getAnalyticsData()

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your project performance</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.projectProgress.length > 0
                ? Math.round(
                    data.projectProgress.reduce((sum, p) => sum + p.percentage, 0) / data.projectProgress.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.velocityData.length > 0 ? data.velocityData[data.velocityData.length - 1].completed : 0}
            </div>
            <p className="text-xs text-muted-foreground">Tasks completed this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tags</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.tagAnalysis.length}</div>
            <p className="text-xs text-muted-foreground">Different categories in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Completion status across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: { label: "Completed", color: "hsl(var(--chart-1))" },
                total: { label: "Total", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.projectProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="completed" fill="var(--color-completed)" name="Completed" />
                  <Bar dataKey="total" fill="var(--color-total)" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Task Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trend</CardTitle>
            <CardDescription>Daily task creation vs completion (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: { label: "Completed", color: "hsl(var(--chart-1))" },
                created: { label: "Created", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.taskCompletionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" name="Completed" />
                  <Line type="monotone" dataKey="created" stroke="var(--color-created)" name="Created" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Task breakdown by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                urgent: { label: "Urgent", color: "#FF8042" },
                high: { label: "High", color: "#FFBB28" },
                medium: { label: "Medium", color: "#00C49F" },
                low: { label: "Low", color: "#0088FE" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.priorityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ priority, percentage }) => `${priority}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Velocity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Velocity Tracking</CardTitle>
            <CardDescription>Tasks completed vs estimated effort (last 4 weeks)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: { label: "Completed Tasks", color: "hsl(var(--chart-1))" },
                estimated: { label: "Estimated Hours", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.velocityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="completed" fill="var(--color-completed)" name="Completed Tasks" />
                  <Bar dataKey="estimated" fill="var(--color-estimated)" name="Estimated Hours" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Tasks & Tag Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Overdue Tasks</span>
            </CardTitle>
            <CardDescription>Tasks that have passed their due date</CardDescription>
          </CardHeader>
          <CardContent>
            {data.overdueTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No overdue tasks! 🎉</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {data.overdueTasks.slice(0, 10).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <p className="text-xs text-muted-foreground">{task.projectName}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-xs">
                        {task.daysOverdue} day{task.daysOverdue !== 1 ? "s" : ""} overdue
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tag Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Tag Performance</CardTitle>
            <CardDescription>Most used tags and their completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            {data.tagAnalysis.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tags in use yet</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {data.tagAnalysis.map((tag) => (
                  <div key={tag.tag} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{tag.tag}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {tag.completed}/{tag.count} tasks
                        </span>
                      </div>
                      <span className="text-sm font-medium">{tag.completionRate}%</span>
                    </div>
                    <Progress value={tag.completionRate} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
