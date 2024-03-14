const express = require("express");
const cors = require("cors");
const passport = require("passport"); // Import Passport.js
const { connectMongoDb } = require("./config/connection");

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

// Error handling middleware (if needed)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
