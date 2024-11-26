const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticketSchema'); // Assuming Ticket is your Mongoose model

// Add a comment to a ticket
router.put('/addComment/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  const { comment } = req.body;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Comment cannot be empty.' });
  }

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Append the new comment
    ticket.comments.push({ text: comment, date: new Date() });

    // Save the updated ticket
    await ticket.save();

    res.status(200).json({ message: 'Comment added successfully.', ticket });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
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
