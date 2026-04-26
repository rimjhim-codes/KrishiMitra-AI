const mongoose = require("mongoose");

const aqiHistorySchema = new mongoose.Schema(
  {
    city: { type: String, required: true, index: true },
    aqi: { type: Number, required: true },
    pm25: { type: Number, required: true },
    pm10: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    timestamp: { type: Date, required: true, default: Date.now, index: true }
  },
  { versionKey: false }
);

module.exports = mongoose.model("AQIHistory", aqiHistorySchema);
