const express = require("express");
const jwt = require("jsonwebtoken");
const Ticket = require("../models/ticketSchema");
const router = express.Router();

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// Helper function for JWT verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
   // console.log("decoded in verify", decoded);
    req.user = decoded; // Attach the decoded user information to `req.user`
    next(); // Ensure the request proceeds to the route handler
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Route to create a new ticket
router.post("/ticket", verifyToken, async (req, res) => {
  const { name, description, priority } = req.body;

  if (!name || !description || !priority) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newTicket = new Ticket({
      name,
      description,
      priority,
      status: "Active",
      createdBy: req.user.id, // Use `req.user` set by `verifyToken`
    });

    const savedTicket = await newTicket.save();

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: savedTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server error while creating the ticket." });
  }
});

// Route to get all tickets for the logged-in user
router.get("/ticket/:id", verifyToken, async (req, res) => {
  if (req.user.userType !== 'user') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id; // Use 'id' from the token
  console.log("user ID from token:", userId);

  try {
    const tickets = await Ticket.find({ createdBy: userId }); // Fix field name to match schema
    console.log("Fetched tickets:", tickets);

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error while fetching tickets." });
  }
});



// Admin route to get all tickets
router.get("/tickets", verifyToken, async (req, res) => {
  try {
    console.log("Decoded user:", req.user);

    if (req.user.userType === "admin") {
      const tickets = await Ticket.find().limit(10); // Admin sees all tickets
     // console.log("tickets", tickets);

      return res.status(200).json(tickets);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error while fetching tickets." });
  }
});

module.exports = router;
