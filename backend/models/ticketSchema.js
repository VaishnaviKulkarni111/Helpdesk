const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const ticketSchema = new mongoose.Schema(
  { 
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: { type: String, enum: ["Active", "Pending", "Resolved"], default: "Active" },
    comments: { type: [CommentSchema], default: [] }, // Default to an empty array
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
); 

module.exports = mongoose.model("Ticket", ticketSchema);
