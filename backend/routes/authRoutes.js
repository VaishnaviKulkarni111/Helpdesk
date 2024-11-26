const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const router = express.Router();

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// Register route
router.post("/register", async (req, res) => {
  const { fname, email, password, userType } = req.body;

  try {
    // Check if the user already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({ error: "User already exists" });
    }

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      fname,
      email,
      password: encryptedPassword,
      userType,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Send response
    res.status(200).json({
      status: "ok",
      data: {
        token: token,
        userType: user.userType,
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ status: "error", error: "Registration failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "error", error: "Invalid credentials" });
    }

    // Compare the entered password with the stored password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: "error", error: "Invalid credentials" });
    }

    // Check if user is an admin or user
    if (user.userType !== 'admin' && user.userType !== 'user') {
      return res.status(400).json({ status: "error", error: "Invalid user type" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response
    res.status(200).json({
      status: "ok",
      data: {
        token: token,
        userType: user.userType,
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: "error", error: "Login failed" });
  }
});

// Route to get all users (admin only)
router.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: "Failed to fetch users" });
  }
});

// Retrieve user data by ID
// router.get("/:id", async (req, res) => {
//   if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) { // Confirm valid MongoDB ObjectId
//     try {
//       const user = await User.findById(req.params.id);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       res.status(200).json({ email: user.email });
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       res.status(500).json({ message: "Error fetching user" });
//     }
//   } else {
//     res.status(400).json({ message: "Invalid user ID" });
//   }
// });

module.exports = router;
