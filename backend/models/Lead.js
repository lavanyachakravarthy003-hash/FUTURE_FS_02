const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  source: String,
  status: {
    type: String,
    default: "new"
  },
  notes: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Lead", LeadSchema);
