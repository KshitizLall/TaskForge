const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
} = require("../controllers/project");

// Route to create a project (protected)
router.post("/", authenticateToken, createProject);

// Route to get all projects (protected)
router.get("/", authenticateToken, getAllProjects);

// Route to get, update, and delete a project by ID (protected)
router
  .route("/:id")
  .get(authenticateToken, getProjectById)
  .patch(authenticateToken, updateProjectById)
  .delete(authenticateToken, deleteProjectById);

module.exports = router;
