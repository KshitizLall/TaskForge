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
  .get(authenticateToken, handleGetAllUsers)
  .post(authenticateToken, handleCreateUser);

// Route to get, update, and delete a user by ID (protected)
router
  .route("/:userId")
  .get(authenticateToken, handleGetUserById)
  .patch(authenticateToken, handleUpdateUserById)
  .delete(authenticateToken, handleDeleteUserById);

module.exports = router;
