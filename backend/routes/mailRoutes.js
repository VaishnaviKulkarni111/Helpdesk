require('dotenv').config(); 
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const Ticket = require('../models/ticketSchema');  // Assuming you have a Ticket model
const User = require('../models/userSchema');    // Assuming you have a User model

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can change to another email service if needed
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
}); 
console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);


// POST route to add a comment to a ticket
router.post('/tickets/:ticketId/comments', async (req, res) => {
  const { ticketId } = req.params;
  const { text } = req.body; // The comment text sent from the client

  try {
    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Add the new comment to the ticket
    const newComment = {
      text,
      date: new Date(),
    };
    ticket.comments.push(newComment);
    await ticket.save();

    // Find the user associated with the ticket (assuming ticket has a createdBy field)
    const user = await User.findById(ticket.createdBy);  // 'createdBy' field should hold the user ID

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send email notification to the user about the comment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Ticket Update - New Comment Added to Your Ticket: ${ticket.name}`,
      html: `
        <p>Dear ${user.name},</p>
        <p>There has been an update on your ticket: <strong>${ticket.name}</strong></p>
        <p><strong>New comment:</strong></p>
        <p>${text}</p>
        <p>Best regards,<br> Helpdesk Team</p>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Return a response with the updated ticket
    res.status(200).json({ message: 'Comment added and email sent', ticket });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
