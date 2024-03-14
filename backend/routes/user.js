const express = require("express");
const router = express.Router();

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

router.route("/").get(handleGetAllUsers).post(handleCreateUser);

// Route to get a user by ID
router
  .route("/:userId")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
