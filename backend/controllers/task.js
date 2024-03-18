const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const { validationResult } = require("express-validator");

// Create a new task
async function createTask(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, projectId } = req.body;

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

// Get all tasks
async function getAllTasks(req, res) {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get task by ID
async function getTaskById(req, res) {
  try {
    const taskId = req.params.id;

    // Find the task by ID in the database
    const task = await Task.findById(taskId);

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

// Update task by ID
async function updateTaskById(req, res) {
  try {
    const taskId = req.params.id;
    const { title, description } = req.body;

    // Find the task by ID in the database and update it
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description },
      { new: true }
    );

    // Check if task exists
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete task by ID
async function deleteTaskById(req, res) {
  try {
    const taskId = req.params.id;

    // Find the task by ID in the database and delete it
    const deletedTask = await Task.findByIdAndDelete(taskId);

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
