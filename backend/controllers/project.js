const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const { validationResult } = require("express-validator");

// Create a new project
async function createProject(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create a new project with the provided userId
    const project = new Project({ title, description, user: userId });

    // Save the project to the database
    await project.save();

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all projects
async function getAllProjects(req, res) {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get project by ID
async function getProjectById(req, res) {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update project by ID
async function updateProjectById(req, res) {
  try {
    const projectId = req.params.id;
    const { title, description } = req.body;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { title, description },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete project by ID
async function deleteProjectById(req, res) {
  try {
    const projectId = req.params.id;

    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete associated tasks
    await Task.deleteMany({ project: projectId });

    res.json({ message: "Project deleted successfully", project });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
};
