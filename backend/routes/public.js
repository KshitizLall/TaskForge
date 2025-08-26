const express = require("express");
const router = express.Router();

// Health check endpoint - no authentication required
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "TaskForge API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API info endpoint - no authentication required
router.get("/info", (req, res) => {
  res.status(200).json({
    name: "TaskForge API",
    version: "1.0.0",
    description: "A powerful project and task management API",
    endpoints: {
      auth: "/api/auth",
      projects: "/api/projects",
      tasks: "/api/tasks",
      dashboard: "/api/dashboard",
      users: "/api/users",
    },
  });
});

module.exports = router;
