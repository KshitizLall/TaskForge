const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

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

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "user",
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get All Users
async function handleGetAllUsers(req, res) {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get User by ID
async function handleGetUserById(req, res) {
  try {
    const userId = req.params.userId;
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

// Create User
async function handleCreateUser(req, res) {
  try {
    const { username, first_name, last_name, email, password, role, gender } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      gender,
    });

    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update User by ID
async function handleUpdateUserById(req, res) {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    if (updatedUserData.password) {
      updatedUserData.password = await bcrypt.hash(
        updatedUserData.password,
        10
      );
    }

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

// Delete User by ID
async function handleDeleteUserById(req, res) {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  handleSignUp,
  handleLogin,
  handleGetAllUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUserById,
  handleDeleteUserById,
};
