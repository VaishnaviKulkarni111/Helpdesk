const express = require("express");
const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const Ticket = require("../models/ticketSchema");
const User = require("../models/userSchema");

dotenv.config(); // Load environment variables from .env file
const router = express.Router();

// Set the SendGrid API key from .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// POST route to add a comment and send email
router.post("/tickets/:ticketId/comments", async (req, res) => {
  const { ticketId } = req.params;
  const { text } = req.body; // Comment text sent from the client

  try {
    // Find the ticket by ID 
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Add the new comment to the ticket
    const newComment = { text, date: new Date() };
    ticket.comments.push(newComment);
    await ticket.save();

    // Find the user associated with the ticket
    const user = await User.findById(ticket.createdBy);
    console.log("user", user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Construct the email message
    const msg = {
      to: user.email, // User's email
      from: "vaishnavirk2203@gmail.com", // Verified sender email
      subject: `Update on Your Ticket: ${ticket.name}`,
      html: `
        <p>Dear ${user.fname},</p>
        <p>A new comment has been added to your ticket: <strong>${ticket.name}</strong></p>
        <p><strong>Comment:</strong></p>
        <blockquote>${text}</blockquote>
        <p>To view more details, please log in to your account.</p>
        <p>Best regards,<br>Helpdesk Team</p>
      `,
    };

    // Send the email
    await sgMail.send(msg);

    res.status(200).json({ message: "Comment added and email sent successfully!", ticket });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to add comment or send email",
      details: error.response?.body || error.message,
    });
  }
});

module.exports = router;
