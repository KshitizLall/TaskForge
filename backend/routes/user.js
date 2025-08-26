const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");

const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateUser,
  handleLogin,
  handleSignUp,
} = require("../controllers/user");

// Public routes - no authentication required
router.post("/login", handleLogin);
router.post("/signup", handleSignUp);

// Protected routes - authentication required
router.get("/", authenticateToken, handleGetAllUsers);
router.post("/", authenticateToken, handleCreateUser);

// Route to get, update, and delete a user by ID (protected)
router
  .route("/:userId")
  .get(authenticateToken, handleGetUserById)
  .patch(authenticateToken, handleUpdateUserById)
  .delete(authenticateToken, handleDeleteUserById);

module.exports = router;
