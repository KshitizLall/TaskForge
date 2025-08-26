"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, FolderOpen } from "lucide-react"
import type { Project } from "@/contexts/projects-context"
import { useProjects } from "@/contexts/projects-context"

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onOpen?: (project: Project) => void
}

export function ProjectCard({ project, onEdit, onOpen }: ProjectCardProps) {
  const { deleteProject } = useProjects()

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject(project.id)
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${project.color}`} />
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="mt-1">{project.description || "No description"}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-transparent"
            onClick={() => onOpen?.(project)}
          >
            <FolderOpen className="h-4 w-4" />
            <span>Open</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
