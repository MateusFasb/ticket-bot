const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  channelId: String,
  userId: String,
  categoria: String,
  status: { type: String, default: "open" },
  createdAt: { type: Date, default: Date.now },
  deleteAt: Date
});

module.exports = mongoose.model("Ticket", ticketSchema);