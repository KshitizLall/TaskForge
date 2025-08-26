const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");

// Helper function to transform task for frontend
function transformTask(task) {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    projectId: task.project,
    userId: task.user,
    subtasks: task.subtasks || [],
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    isDeleted: task.isDeleted || false,
    deletedAt: task.deletedAt,
    priority: task.priority,
    dueDate: task.dueDate,
    estimatedMinutes: task.estimatedMinutes,
    actualMinutes: task.actualMinutes,
    progress: task.progress,
    tags: task.tags || [],
    assignee: task.assignee || "",
    lastUpdated: task.updatedAt,
    auditTrail: task.auditTrail || [],
  };
}

// Create a new task
async function createTask(req, res) {
  try {
    const {
      title,
      description,
      project_id,
      status,
      priority,
      dueDate,
      estimatedMinutes,
      tags,
      assignee,
    } = req.body;
    const userId = req.user.id; // Updated to match JWT payload

    // Check if project exists and belongs to user
    const project = await Project.findOne({ _id: project_id, user: userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get user info for audit trail
    const user = await User.findById(userId);

    // Create a new task
    const newTask = new Task({
      title,
      description,
      project: project_id,
      user: userId,
      status: status || "new",
      priority: priority || "medium",
      dueDate,
      estimatedMinutes,
      tags: tags || [],
      assignee: assignee || "",
      progress: 0,
      auditTrail: [
        {
          action: "Task created",
          userId: userId,
          userName: `${user.first_name} ${user.last_name}`.trim(),
          timestamp: new Date(),
        },
      ],
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

    res.status(201).json(transformTask(savedTask));
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all tasks for the authenticated user
async function getAllTasks(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload
    const projectId = req.query.projectId;

    // Build the query object
    const query = { user: userId, isDeleted: { $ne: true } };
    if (projectId) {
      query.project = projectId;
    }

    // Fetch all tasks for the authenticated user from the database
    const tasks = await Task.find(query).populate("project", "name");

    // Transform tasks to match frontend expectations
    const transformedTasks = tasks.map(transformTask);

    res.json(transformedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get task by ID for the authenticated user
async function getTaskById(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload
    const taskId = req.params.id;

    // Find the task by ID and user ID in the database
    const task = await Task.findOne({ _id: taskId, user: userId }).populate(
      "project",
      "name"
    );

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(transformTask(task));
  } catch (error) {
    console.error("Error fetching task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update task by ID for the authenticated user
async function updateTaskById(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload
    const taskId = req.params.id;
    const updateData = req.body;

    // Find the task by ID and user ID in the database
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Get user info for audit trail
    const user = await User.findById(userId);

    // Track changes for audit trail
    const changes = [];
    Object.keys(updateData).forEach((key) => {
      if (task[key] !== updateData[key]) {
        changes.push({
          field: key,
          oldValue: task[key],
          newValue: updateData[key],
        });
      }
    });

    // Update task fields
    Object.assign(task, updateData);

    // Add audit entry if there were changes
    if (changes.length > 0) {
      task.auditTrail.push({
        action: "Task updated",
        userId: userId,
        userName: `${user.first_name} ${user.last_name}`.trim(),
        timestamp: new Date(),
        changes,
      });
    }

    // Update completion status and date
    if (updateData.status === "completed" && !task.completedAt) {
      task.completedAt = new Date();
      task.progress = 100;
    } else if (updateData.status !== "completed" && task.completedAt) {
      task.completedAt = null;
    }

    const updatedTask = await task.save();

    res.json(transformTask(updatedTask));
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete task by ID for the authenticated user
async function deleteTaskById(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload
    const taskId = req.params.id;

    // Find the task by ID and user ID in the database
    const task = await Task.findOne({ _id: taskId, user: userId });

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Soft delete - mark as deleted instead of removing from database
    task.isDeleted = true;
    task.deletedAt = new Date();

    // Add audit entry
    const user = await User.findById(userId);
    task.auditTrail.push({
      action: "Task deleted",
      userId: userId,
      userName: `${user.first_name} ${user.last_name}`.trim(),
      timestamp: new Date(),
    });

    await task.save();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all deleted tasks (trash) for the authenticated user
async function getDeletedTasks(req, res) {
  try {
    const userId = req.user.id;
    const projectId = req.query.projectId;

    // Build the query object for deleted tasks
    const query = { user: userId, isDeleted: true };
    if (projectId) {
      query.project = projectId;
    }

    // Fetch all deleted tasks for the authenticated user
    const deletedTasks = await Task.find(query).populate("project", "name");

    // Transform tasks to match frontend expectations
    const transformedTasks = deletedTasks.map(transformTask);

    res.json(transformedTasks);
  } catch (error) {
    console.error("Error fetching deleted tasks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Restore a deleted task
async function restoreTask(req, res) {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    // Find the deleted task by ID and user ID
    const task = await Task.findOne({
      _id: taskId,
      user: userId,
      isDeleted: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Deleted task not found" });
    }

    // Restore the task
    task.isDeleted = false;
    task.deletedAt = null;

    // Add audit entry
    const user = await User.findById(userId);
    task.auditTrail.push({
      action: "Task restored",
      userId: userId,
      userName: `${user.first_name} ${user.last_name}`.trim(),
      timestamp: new Date(),
    });

    const restoredTask = await task.save();

    res.json(transformTask(restoredTask));
  } catch (error) {
    console.error("Error restoring task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Permanently delete a task
async function permanentlyDeleteTask(req, res) {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    // Find and permanently delete the task
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
      isDeleted: true,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Deleted task not found" });
    }

    res.json({ message: "Task permanently deleted successfully" });
  } catch (error) {
    console.error("Error permanently deleting task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add subtask to a task
async function addSubtask(req, res) {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description } = req.body;

    // Find the task
    const task = await Task.findOne({
      _id: taskId,
      user: userId,
      isDeleted: { $ne: true },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Create new subtask
    const newSubtask = {
      title,
      description: description || "",
      status: "new",
      createdAt: new Date(),
    };

    task.subtasks.push(newSubtask);

    // Add audit entry
    const user = await User.findById(userId);
    task.auditTrail.push({
      action: "Subtask added",
      userId: userId,
      userName: `${user.first_name} ${user.last_name}`.trim(),
      timestamp: new Date(),
      details: `Added subtask: ${title}`,
    });

    const updatedTask = await task.save();

    res.status(201).json(transformTask(updatedTask));
  } catch (error) {
    console.error("Error adding subtask:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update subtask
async function updateSubtask(req, res) {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const subtaskId = req.params.subtaskId;
    const updateData = req.body;

    // Find the task
    const task = await Task.findOne({
      _id: taskId,
      user: userId,
      isDeleted: { $ne: true },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    // Track changes for audit trail
    const changes = [];
    Object.keys(updateData).forEach((key) => {
      if (subtask[key] !== updateData[key]) {
        changes.push({
          field: key,
          oldValue: subtask[key],
          newValue: updateData[key],
        });
      }
    });

    // Update subtask
    Object.assign(subtask, updateData);

    // Update completion date if status changed to completed
    if (updateData.status === "completed" && !subtask.completedAt) {
      subtask.completedAt = new Date();
    } else if (updateData.status !== "completed" && subtask.completedAt) {
      subtask.completedAt = null;
    }

    // Add audit entry if there were changes
    if (changes.length > 0) {
      const user = await User.findById(userId);
      task.auditTrail.push({
        action: "Subtask updated",
        userId: userId,
        userName: `${user.first_name} ${user.last_name}`.trim(),
        timestamp: new Date(),
        details: `Updated subtask: ${subtask.title}`,
        changes,
      });
    }

    const updatedTask = await task.save();

    res.json(transformTask(updatedTask));
  } catch (error) {
    console.error("Error updating subtask:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete subtask
async function deleteSubtask(req, res) {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const subtaskId = req.params.subtaskId;

    // Find the task
    const task = await Task.findOne({
      _id: taskId,
      user: userId,
      isDeleted: { $ne: true },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find and remove the subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    const subtaskTitle = subtask.title;
    task.subtasks.pull(subtaskId);

    // Add audit entry
    const user = await User.findById(userId);
    task.auditTrail.push({
      action: "Subtask deleted",
      userId: userId,
      userName: `${user.first_name} ${user.last_name}`.trim(),
      timestamp: new Date(),
      details: `Deleted subtask: ${subtaskTitle}`,
    });

    const updatedTask = await task.save();

    res.json(transformTask(updatedTask));
  } catch (error) {
    console.error("Error deleting subtask:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get task history/audit trail
async function getTaskHistory(req, res) {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    // Find the task
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      taskId: task._id,
      title: task.title,
      auditTrail: task.auditTrail || [],
    });
  } catch (error) {
    console.error("Error fetching task history:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getDeletedTasks,
  restoreTask,
  permanentlyDeleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  getTaskHistory,
};
