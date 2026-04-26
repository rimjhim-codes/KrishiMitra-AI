const express = require("express");
const { getAllAQI, getAQIByCity, getTrendByCity, getSupportedCities } = require("../services/aqiService");

const router = express.Router();

router.get("/all", async (_req, res) => {
  try {
    const data = await getAllAQI();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/cities", async (_req, res) => {
  try {
    const cities = await getSupportedCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/trends/:city", async (req, res) => {
  try {
    const data = await getTrendByCity(req.params.city);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:city", async (req, res) => {
  try {
    const cityData = await getAQIByCity(req.params.city);
    if (!cityData) {
      return res.status(404).json({ message: "City not found in AQI cache." });
    }
    return res.json(cityData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
