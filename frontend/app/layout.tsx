import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ProjectsProvider } from "@/contexts/projects-context"
import { TasksProvider } from "@/contexts/tasks-context"
import { AnalyticsProvider } from "@/components/analytics/analytics-context"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "TaskForge - Project Management Tool",
  description:
    "Organize your projects and tasks with precision and clarity. Create projects, track tasks, manage subtasks, and stay productive with TaskForge.",
  generator: "v0.app",
  keywords: ["project management", "task tracking", "productivity", "organization", "subtasks"],
  authors: [{ name: "TaskForge Team" }],
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <ProjectsProvider>
              <TasksProvider>
                <AnalyticsProvider>{children}</AnalyticsProvider>
              </TasksProvider>
            </ProjectsProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
