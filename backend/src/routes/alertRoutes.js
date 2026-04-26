const express = require("express");
const { createAlert, getAlerts } = require("../services/aqiService");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const alerts = await getAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await createAlert(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
