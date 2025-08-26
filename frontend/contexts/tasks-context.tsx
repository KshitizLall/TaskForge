"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { tasksAPI } from "@/lib/api";

export type TaskStatus = "new" | "in-progress" | "completed";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  priority: Priority;
  estimatedMinutes?: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  userId: string;
  userName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  userId: string;
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  priority: Priority;
  dueDate?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  progress: number;
  tags: string[];
  assignee: string;
  lastUpdated: string;
  notes: string;
  auditTrail: AuditEntry[]; // Added audit trail to task
}

interface TasksContextType {
  tasks: Task[];
  createTask: (
    projectId: string,
    title: string,
    description: string,
    details?: Partial<Task>
  ) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  permanentlyDeleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getDeletedTasks: () => Task[];
  addSubtask: (taskId: string, title: string) => void;
  updateSubtask: (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  getTaskStats: (projectId?: string) => {
    total: number;
    completed: number;
    inProgress: number;
    new: number;
  };
  getTaskHistory: (taskId: string) => AuditEntry[]; // Added method to get task history
  getAllTasks: () => Task[]; // Added method to get all tasks for analytics
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const allTasks = JSON.parse(
        localStorage.getItem("taskforge-tasks") || "[]"
      );
      const userTasks = allTasks.filter(
        (task: Task) => task.userId === user.id
      );
      setTasks(userTasks);
    } else {
      setTasks([]);
    }
  }, [user]);

  const saveTasks = (updatedTasks: Task[]) => {
    const allTasks = JSON.parse(
      localStorage.getItem("taskforge-tasks") || "[]"
    );
    const otherUsersTasks = allTasks.filter(
      (task: Task) => task.userId !== user?.id
    );
    const newAllTasks = [...otherUsersTasks, ...updatedTasks];
    localStorage.setItem("taskforge-tasks", JSON.stringify(newAllTasks));
    setTasks(updatedTasks);
  };

  const createAuditEntry = (
    action: string,
    field?: string,
    oldValue?: any,
    newValue?: any
  ): AuditEntry => {
    if (!user) throw new Error("User not authenticated");

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      field,
      oldValue,
      newValue,
      userId: user.id,
      userName: user.name,
    };
  };

  const createTask = (
    projectId: string,
    title: string,
    description: string,
    details?: Partial<Task>
  ) => {
    if (!user) return;

    console.log("[v0] Creating task with details:", {
      projectId,
      title,
      description,
      details,
    });

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: "new",
      projectId,
      userId: user.id,
      subtasks: [],
      createdAt: new Date().toISOString(),
      priority: details?.priority || "medium",
      progress: 0,
      tags: details?.tags || [],
      assignee: user.name,
      lastUpdated: new Date().toISOString(),
      notes: details?.notes || "",
      dueDate: details?.dueDate,
      estimatedMinutes: details?.estimatedMinutes,
      actualMinutes: details?.actualMinutes,
      auditTrail: [createAuditEntry("Task Created")], // Initialize audit trail
      ...details, // Allow any additional details to override defaults
    };

    console.log("[v0] Created new task:", newTask);

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const auditEntries: AuditEntry[] = [];

        Object.entries(updates).forEach(([field, newValue]) => {
          if (field === "auditTrail") return; // Skip audit trail updates

          const oldValue = (task as any)[field];
          if (oldValue !== newValue) {
            let action = `Updated ${field}`;

            // Special handling for status changes
            if (field === "status") {
              action = `Status changed from ${oldValue} to ${newValue}`;
            } else if (field === "priority") {
              action = `Priority changed from ${oldValue} to ${newValue}`;
            } else if (field === "dueDate") {
              action = newValue
                ? `Due date set to ${newValue}`
                : "Due date removed";
            }

            auditEntries.push(
              createAuditEntry(action, field, oldValue, newValue)
            );
          }
        });

        const updatedTask = {
          ...task,
          ...updates,
          lastUpdated: new Date().toISOString(),
          auditTrail: [...task.auditTrail, ...auditEntries], // Append new audit entries
        };

        if (updates.status === "completed" && task.status !== "completed") {
          updatedTask.completedAt = new Date().toISOString();
          updatedTask.progress = 100;
        }
        if (updates.status !== "completed" && task.status === "completed") {
          delete updatedTask.completedAt;
        }
        return updatedTask;
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          auditTrail: [...task.auditTrail, createAuditEntry("Task Deleted")], // Add audit entry for deletion
        };
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const restoreTask = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const { isDeleted, deletedAt, ...restoredTask } = task;
        return {
          ...restoredTask,
          auditTrail: [...task.auditTrail, createAuditEntry("Task Restored")], // Add audit entry for restoration
        };
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const permanentlyDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter(
      (task) => task.projectId === projectId && !task.isDeleted
    );
  };

  const getDeletedTasks = () => {
    return tasks.filter((task) => task.isDeleted);
  };

  const addSubtask = (taskId: string, title: string) => {
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: "medium",
    };

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: [...task.subtasks, newSubtask],
          lastUpdated: new Date().toISOString(),
          auditTrail: [
            ...task.auditTrail,
            createAuditEntry(`Added subtask: ${title}`),
          ], // Add audit entry for subtask creation
        };
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const updateSubtask = (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const subtask = task.subtasks.find((s) => s.id === subtaskId);
        const auditEntries: AuditEntry[] = [];

        if (
          subtask &&
          updates.completed !== undefined &&
          updates.completed !== subtask.completed
        ) {
          const action = updates.completed
            ? `Completed subtask: ${subtask.title}`
            : `Uncompleted subtask: ${subtask.title}`;
          auditEntries.push(createAuditEntry(action));
        }

        return {
          ...task,
          subtasks: task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              const updatedSubtask = { ...subtask, ...updates };
              if (updates.completed && !subtask.completed) {
                updatedSubtask.completedAt = new Date().toISOString();
              }
              return updatedSubtask;
            }
            return subtask;
          }),
          lastUpdated: new Date().toISOString(),
          auditTrail: [...task.auditTrail, ...auditEntries], // Add audit entries for subtask updates
        };
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const subtask = task.subtasks.find((s) => s.id === subtaskId);
        const auditEntry = subtask
          ? createAuditEntry(`Deleted subtask: ${subtask.title}`)
          : null;

        return {
          ...task,
          subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
          auditTrail: auditEntry
            ? [...task.auditTrail, auditEntry]
            : task.auditTrail, // Add audit entry for subtask deletion
        };
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const getTaskStats = (projectId?: string) => {
    const relevantTasks = projectId
      ? tasks.filter((task) => task.projectId === projectId && !task.isDeleted)
      : tasks.filter((task) => !task.isDeleted);

    return {
      total: relevantTasks.length,
      completed: relevantTasks.filter((task) => task.status === "completed")
        .length,
      inProgress: relevantTasks.filter((task) => task.status === "in-progress")
        .length,
      new: relevantTasks.filter((task) => task.status === "new").length,
    };
  };

  const getTaskHistory = (taskId: string): AuditEntry[] => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.auditTrail || [];
  };

  const getAllTasks = (): Task[] => {
    return tasks;
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        deleteTask,
        restoreTask,
        permanentlyDeleteTask,
        getTasksByProject,
        getDeletedTasks,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        getTaskStats,
        getTaskHistory,
        getAllTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
