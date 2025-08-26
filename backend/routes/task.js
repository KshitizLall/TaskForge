const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const { taskValidation } = require("../middlewares/validation");

const {
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
} = require("../controllers/task");

// Route to create a task (protected)
router.post("/", authenticateToken, taskValidation.create, createTask);

// Route to get all tasks (protected)
router.get("/", authenticateToken, getAllTasks);

// Route to get deleted tasks (trash)
router.get("/trash", authenticateToken, getDeletedTasks);

// Route to get, update, and delete a task by ID (protected)
router
  .route("/:id")
  .get(authenticateToken, getTaskById)
  .patch(authenticateToken, taskValidation.update, updateTaskById)
  .delete(authenticateToken, deleteTaskById);

// Route to restore a deleted task
router.patch("/:id/restore", authenticateToken, restoreTask);

// Route to permanently delete a task
router.delete("/:id/permanent", authenticateToken, permanentlyDeleteTask);

// Route to get task history/audit trail
router.get("/:id/history", authenticateToken, getTaskHistory);

// Routes for subtasks
router.post(
  "/:id/subtasks",
  authenticateToken,
  taskValidation.subtask,
  addSubtask
);
router.patch("/:id/subtasks/:subtaskId", authenticateToken, updateSubtask);
router.delete("/:id/subtasks/:subtaskId", authenticateToken, deleteSubtask);

module.exports = router;
