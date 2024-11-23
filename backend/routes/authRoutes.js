const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const router = express.Router();

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// Register route
router.post("/register", async (req, res) => {
  const { fname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }

    const user = await User.create({
      fname,
      email,
      password: encryptedPassword,
      userType,
    });

    const token = jwt.sign(
      {  id: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
            status: "ok",
      data: {
        token: token,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "error", error: "Invalid credentials" });
    }

    // Compare the hashed password with the entered one
    const encryptedPassword = await bcrypt.hash(password, 10);

    const isPasswordValid = await bcrypt.compare(password, encryptedPassword);
      
        if (!isPasswordValid) {
      return res.status(400).json({ status: "error", error: "Invalid credentials" });
    }

    // Generate token and send response
    const token = jwt.sign(
      {  id: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "ok",
      data: { token, userType: user.userType },
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Login failed" });
  }
});

router.get("/getAllUser", async (req, res) => {
    try {
      const allUser = await User.find({});
      res.send({ status: "ok", data: allUser });
    } catch (error) {
      console.log(error);
    }
  });


// Retrieve user data




router.get('/:id', async (req, res) => {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) { // Confirm valid MongoDB ObjectId
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ email: user.email });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  } else {
    res.status(400).json({ message: 'Invalid user ID' });
  }
});

module.exports = router;