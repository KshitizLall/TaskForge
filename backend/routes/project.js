const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const { projectValidation } = require("../middlewares/validation");

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getDeletedProjects,
  restoreProject,
  permanentlyDeleteProject,
} = require("../controllers/project");

// Route to create a project (protected)
router.post("/", authenticateToken, projectValidation.create, createProject);

// Route to get all projects (protected)
router.get("/", authenticateToken, getAllProjects);

// Route to get deleted projects (trash)
router.get("/trash", authenticateToken, getDeletedProjects);

// Route to get, update, and delete a project by ID (protected)
router
  .route("/:id")
  .get(authenticateToken, getProjectById)
  .patch(authenticateToken, projectValidation.update, updateProjectById)
  .delete(authenticateToken, deleteProjectById);

// Route to restore a deleted project
router.patch("/:id/restore", authenticateToken, restoreProject);

// Route to permanently delete a project
router.delete("/:id/permanent", authenticateToken, permanentlyDeleteProject);

module.exports = router;
