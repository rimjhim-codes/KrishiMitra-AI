const mongoose = require("mongoose");

const cityAQISchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true, index: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    aqi: { type: Number, required: true },
    pm25: { type: Number, required: true },
    pm10: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    quality: { type: String, required: true },
    source: { type: String, enum: ["openweather", "waqi", "cache"], default: "openweather" },
    updatedAt: { type: Date, required: true }
  },
  { versionKey: false }
);

module.exports = mongoose.model("CityAQI", cityAQISchema);
