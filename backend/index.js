const express = require("express");
const cors = require("cors");
const { connectMongoDb } = require("./config/connection");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
require("dotenv").config();

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect MongoDB
connectMongoDb();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api", require("./routes/public")); // Public routes (health, info)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/trash", require("./routes/trash"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TaskForge API",
    version: "1.0.0",
    status: "Running",
    endpoints: {
      health: "/api/health",
      info: "/api/info",
      auth: "/api/auth",
      projects: "/api/projects",
      tasks: "/api/tasks",
      trash: "/api/trash",
      dashboard: "/api/dashboard",
      users: "/api/users",
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
