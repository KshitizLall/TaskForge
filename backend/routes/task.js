const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/task");

// Route to create a task (protected)
router.post("/", authenticateToken, createTask);

// Route to get all tasks (protected)
router.get("/", authenticateToken, getAllTasks);

// Route to get, update, and delete a task by ID (protected)
router
  .route("/:id")
  .get(authenticateToken, getTaskById)
  .patch(authenticateToken, updateTaskById)
  .delete(authenticateToken, deleteTaskById);

module.exports = router;
