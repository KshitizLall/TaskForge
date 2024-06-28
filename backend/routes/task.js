const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  addDailyPoints,
  getPendingPoints,
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

// Route to add daily points to a task (protected)
router.patch("/:id/add-points", authenticateToken, addDailyPoints);

// Route to get pending points for a task (protected)
router.get("/:id/pending-points", authenticateToken, getPendingPoints);

module.exports = router;
