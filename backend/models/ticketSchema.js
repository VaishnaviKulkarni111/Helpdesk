const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true , default: "No comments yet."},
  date: { type: Date, default: Date.now },
});
const ticketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: { type: String, enum: ["Active", "Pending", "Resolved"], default: "Active" },
    comments: [CommentSchema], // Array of comments
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
); 

module.exports = mongoose.model("Ticket", ticketSchema);
