const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // Import the crypto module
const User = require("../models/userModel"); // Assuming your user model is defined in User.js
const router = express.Router();

// Generate a secure secret key
const secretKey = crypto.randomBytes(32).toString("hex");

// Route for user sign up
router.post("/signup", async (req, res) => {
  const { username, password, first_name, last_name, email, role, gender } =
    req.body;
  try {
    // Check if the username or email is already taken
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email is already taken." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      gender,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route for user sign in
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, secretKey); // Use the generated secret key
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
