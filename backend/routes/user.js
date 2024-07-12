const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateUser,
  handleLogin,
  handleSignUp,
} = require("../controllers/user");

// Login Route
router.post("/login", handleLogin);

// Register Route
router.post("/signup", handleSignUp);

// Route to get all users and create a new user (protected)
router
  .route("/")
  .get(handleGetAllUsers)
  .post(handleCreateUser);

// Route to get, update, and delete a user by ID (protected)
router
  .route("/:userId")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
