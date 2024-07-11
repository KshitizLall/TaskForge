const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const { validationResult } = require("express-validator");

// Function to update task status based on points
function updateTaskStatus(task) {
  if (task.dailyPoints === 0) {
    task.status = "Not Started";
  } else if (task.dailyPoints > 0 && task.dailyPoints < task.totalPoints) {
    task.status = "On Progress";
  } else if (task.dailyPoints >= task.totalPoints) {
    task.status = "Completed";
  }
}

// Create a new task
async function createTask(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, projectId, totalPoints } = req.body;
    const userId = req.user.userId;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      project: projectId,
      user: userId, // Set user ID
      totalPoints,
      dailyPoints: 0, // Initialize dailyPoints to 0
      status: "Not Started", // Set initial status
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: savedTask });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all tasks for the authenticated user
async function getAllTasks(req, res) {
  try {
    const userId = req.user.userId;
    // Fetch all tasks for the authenticated user from the database
    const tasks = await Task.find({ user: userId });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get task by ID for the authenticated user
async function getTaskById(req, res) {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    // Find the task by ID and user ID in the database
    const task = await Task.findOne({ _id: taskId, user: userId });

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update task by ID for the authenticated user
async function updateTaskById(req, res) {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;
    const { title, description, totalPoints, dailyPoints } = req.body;

    // Find the task by ID and user ID in the database
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title;
    task.description = description;
    task.totalPoints = totalPoints;

    if (dailyPoints !== undefined) {
      task.dailyPoints = dailyPoints;
    }

    // Update task status
    updateTaskStatus(task);

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete task by ID for the authenticated user
async function deleteTaskById(req, res) {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    // Find the task by ID and user ID in the database and delete it
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    // Check if task exists
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
