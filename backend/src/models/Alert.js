const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    city: { type: String, required: true, index: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true },
    timestamp: { type: Date, required: true, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Alert", alertSchema);
