const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const { validationResult } = require("express-validator");

// Helper function to transform project for frontend
function transformProject(project) {
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    color: project.color,
    status: project.status,
    priority: project.priority,
    dueDate: project.dueDate,
    progress: project.progress,
    tags: project.tags,
    notes: project.notes,
    userId: project.user,
    createdAt: project.createdAt,
    lastUpdated: project.updatedAt,
    isDeleted: project.isDeleted || false,
    deletedAt: project.deletedAt,
  };
}

// Create a new project
async function createProject(req, res) {
  try {
    const { name, description, color, status, priority, dueDate, tags, notes } =
      req.body;
    const userId = req.user.id; // Updated to match JWT payload

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create a new project with the provided data
    const project = new Project({
      name,
      description,
      color: color || "#3b82f6",
      status: status || "active",
      priority: priority || "medium",
      dueDate,
      tags: tags || [],
      notes: notes || "",
      user: userId,
    });

    // Save the project to the database
    await project.save();

    // Transform response to match frontend expectations
    const projectResponse = transformProject(project);

    res.status(201).json(projectResponse);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all projects for the authenticated user
async function getAllProjects(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload
    const projects = await Project.find({
      user: userId,
      isDeleted: { $ne: true },
    });

    // Transform projects to match frontend expectations
    const transformedProjects = projects.map(transformProject);

    res.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get project by ID for the authenticated user
async function getProjectById(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload
    const projectId = req.params.id;
    const project = await Project.findOne({
      _id: projectId,
      user: userId,
      isDeleted: { $ne: true },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Transform project to match frontend expectations
    const projectResponse = transformProject(project);

    res.json(projectResponse);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update project by ID
async function updateProjectById(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload
    const projectId = req.params.id;
    const {
      name,
      description,
      color,
      status,
      priority,
      dueDate,
      progress,
      tags,
      notes,
    } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, user: userId, isDeleted: { $ne: true } },
      {
        name,
        description,
        color,
        status,
        priority,
        dueDate,
        progress,
        tags,
        notes,
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Transform project to match frontend expectations
    const projectResponse = transformProject(project);

    res.json(projectResponse);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete project by ID (soft delete)
async function deleteProjectById(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload
    const projectId = req.params.id;

    const project = await Project.findOne({
      _id: projectId,
      user: userId,
      isDeleted: { $ne: true },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Soft delete the project
    project.isDeleted = true;
    project.deletedAt = new Date();
    await project.save();

    // Soft delete associated tasks
    await Task.updateMany(
      { project: projectId },
      {
        isDeleted: true,
        deletedAt: new Date(),
      }
    );

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get deleted projects (trash)
async function getDeletedProjects(req, res) {
  try {
    const userId = req.user.id;
    const projects = await Project.find({
      user: userId,
      isDeleted: true,
    });

    // Transform projects to match frontend expectations
    const transformedProjects = projects.map(transformProject);

    res.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching deleted projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Restore a deleted project
async function restoreProject(req, res) {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const project = await Project.findOne({
      _id: projectId,
      user: userId,
      isDeleted: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Deleted project not found" });
    }

    // Restore the project
    project.isDeleted = false;
    project.deletedAt = null;
    await project.save();

    // Restore associated tasks
    await Task.updateMany(
      { project: projectId },
      {
        $unset: { isDeleted: 1, deletedAt: 1 },
      }
    );

    const projectResponse = transformProject(project);
    res.json(projectResponse);
  } catch (error) {
    console.error("Error restoring project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Permanently delete a project
async function permanentlyDeleteProject(req, res) {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const project = await Project.findOneAndDelete({
      _id: projectId,
      user: userId,
      isDeleted: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Deleted project not found" });
    }

    // Permanently delete associated tasks
    await Task.deleteMany({ project: projectId });

    res.json({ message: "Project permanently deleted successfully" });
  } catch (error) {
    console.error("Error permanently deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getDeletedProjects,
  restoreProject,
  permanentlyDeleteProject,
};
