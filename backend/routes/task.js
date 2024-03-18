const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/task");

// Create a new task
router.post("/", createTask);

// Get all tasks
router.get("/", getAllTasks);

// Get a task by ID
router.get("/:id", getTaskById);

// Update a task by ID
router.patch("/:id", updateTaskById);

// Delete a task by ID
router.delete("/:id", deleteTaskById);

module.exports = router;
