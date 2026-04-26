require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { connectDB } = require("./db");
const aqiRoutes = require("./routes/aqiRoutes");
const alertRoutes = require("./routes/alertRoutes");
const { refreshAllCitiesAQI, getSupportedCities } = require("./services/aqiService");

const app = express();
const PORT = process.env.PORT || 4000;
const REFRESH_CRON = process.env.REFRESH_CRON || "*/2 * * * *";

app.use(cors());
app.use(express.json());

app.use("/api/aqi", aqiRoutes);
app.use("/api/alerts", alertRoutes);
app.get("/api/cities", async (_req, res) => {
  try {
    const cities = await getSupportedCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "airsense-backend" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

const start = async () => {
  await connectDB();
  await refreshAllCitiesAQI();

  cron.schedule(REFRESH_CRON, async () => {
    await refreshAllCitiesAQI();
  });

  app.listen(PORT, () => {
    console.log(`AirSense backend running on http://localhost:${PORT}`);
  });
};

start().catch((error) => {
  console.error("Server failed to start:", error.message);
  process.exit(1);
});

