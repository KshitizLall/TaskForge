"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Project } from "@/contexts/projects-context"
import { useProjects } from "@/contexts/projects-context"

const projectColors = [
  { name: "Blue", value: "bg-blue-500", ring: "ring-blue-500" },
  { name: "Green", value: "bg-green-500", ring: "ring-green-500" },
  { name: "Purple", value: "bg-purple-500", ring: "ring-purple-500" },
  { name: "Orange", value: "bg-orange-500", ring: "ring-orange-500" },
  { name: "Red", value: "bg-red-500", ring: "ring-red-500" },
  { name: "Teal", value: "bg-teal-500", ring: "ring-teal-500" },
]

interface EditProjectDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(projectColors[0].value)
  const { updateProject } = useProjects()

  useEffect(() => {
    if (project) {
      setName(project.name)
      setDescription(project.description)
      setSelectedColor(project.color)
    }
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !name.trim()) return

    updateProject(project.id, {
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
    })
    onOpenChange(false)
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project details and settings.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter project description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Project Color</Label>
              <div className="flex gap-2">
                {projectColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color.value} ${
                      selectedColor === color.value ? `ring-2 ${color.ring} ring-offset-2` : ""
                    }`}
                    onClick={() => setSelectedColor(color.value)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
