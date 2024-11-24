const express = require("express");
const jwt = require("jsonwebtoken");
const Ticket = require("../models/ticketSchema");
const User = require("../models/userSchema"); // Adjust path as necessary
const router = express.Router();

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// Helper function for JWT verification
const verifyToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded =  jwt.verify(token, JWT_SECRET);
    console.log("decoded in verifytoken", decoded)
    return decoded
  } catch (error) {
    return null;
  }
};

// Route to create a new ticket
router.post("/ticket", verifyToken, async (req, res) => {
  const { name, description, priority } = req.body;

  try {
    if (!name || !description || !priority) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newTicket = new Ticket({
      name,
      description,
      priority,
      status: "Active",
      comments: "No comments yet",
      user: req.user.id, // Associate ticket with the authenticated user
    });

    const savedTicket = await newTicket.save();

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: savedTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server error while creating ticket." });
  }
});

// Route to get all tickets for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }); // Fetch tickets for the logged-in user
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error while fetching tickets." });
  }
});

// Route to get a specific ticket by ID (user-specific)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id, user: req.user.id });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error while fetching ticket." });
  }
});

// Route to update a ticket (user-specific)
router.put("/:id", verifyToken, async (req, res) => {
  const { name, description, priority, status, comments } = req.body;

  try {
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, description, priority, status, comments },
      { new: true } // Return the updated document
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Server error while updating ticket." });
  }
});

// Route to delete a ticket (user-specific)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedTicket = await Ticket.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json({
      message: "Ticket deleted successfully",
      ticket: deletedTicket,
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Server error while deleting ticket." });
  }
});

module.exports = router;
