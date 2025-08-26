const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // Assuming your user model is defined in User.js
const router = express.Router();

// Use environment variable or default for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";

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
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim(),
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
