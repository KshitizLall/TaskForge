const User = require("../models/userModel");
const express = require("express");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// Handle Login
async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });
    return res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Register User
async function handleSignUp(req, res) {
  try {
    const { username, first_name, last_name, email, password, role, gender } =
      req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Create new user (storing plaintext password)
    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password, // Storing plaintext password
      role,
      gender,
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleGetAllUsers(req, res) {
  try {
    // Fetch all users from the database
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleGetUserById(req, res) {
  try {
    const userId = req.params.userId;
    // Find the user by ID in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleCreateUser(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create a new user instance using the data from the request body
    const newUser = new User({
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      gender: req.body.gender,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Respond with a success message
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleUpdateUserById(req, res) {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;
    // Find the user by ID in the database and update it
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleDeleteUserById(req, res) {
  try {
    const userId = req.params.userId;
    // Find the user by ID in the database and delete it
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUserById,
  handleDeleteUserById,
  handleLogin,
  handleSignUp,
};
