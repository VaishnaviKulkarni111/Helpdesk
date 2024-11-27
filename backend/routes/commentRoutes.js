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
router.put('/addComment/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  const { comment } = req.body; // Comment text sent from the client

  // Validate the comment
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Comment cannot be empty.' });
  }

  try {
    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Add the new comment to the ticket
    const newComment = { text: comment, date: new Date() }; // Use 'comment' here instead of 'text'
    ticket.comments.push(newComment);
    await ticket.save();

    // Find the user associated with the ticket
    const user = await User.findById(ticket.createdBy);
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
        <blockquote>${comment}</blockquote> 
        <p>To view more details, please log in to your account.</p>
        <p>Best regards,<br>Helpdesk Team</p>
      `,
    };

    // Send the email
    await sgMail.send(msg);

    // Respond with success message
    res.status(200).json({ message: "Comment added and email sent successfully!", ticket });

  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// Update the status of a ticket
router.put('/updateStatus/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  // Allowed statuses
  const allowedStatuses = ['Active', 'Pending', 'Resolved'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Update the ticket's status
    ticket.status = status;

    // Save the updated ticket
    await ticket.save();

    res.status(200).json({ message: 'Status updated successfully.', ticket });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
