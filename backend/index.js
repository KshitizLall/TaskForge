const express = require("express");
const cors = require("cors");
const { connectMongoDb } = require("./config/connection");
require("dotenv").config();

const app = express();
app.use(cors());

// Connect MongoDB
connectMongoDb();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/dashboard", require("./routes/dashboard"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
