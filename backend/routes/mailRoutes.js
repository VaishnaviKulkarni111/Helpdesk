const express = require("express");
const sgMail = require("@sendgrid/mail");
const router = express.Router();

// Set the API key
sgMail.setApiKey("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");

router.post("/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Email options
  const msg = {
    to, // Recipient email
    from: "vaishnavirk2203@gmail.com", // Replace with a verified sender email in SendGrid
    subject,
    text, // Plain text version of the message
    html, // Optional: HTML version of the message
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.body : error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

module.exports = router;
