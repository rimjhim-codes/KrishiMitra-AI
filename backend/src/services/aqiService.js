const axios = require("axios");
const CityAQI = require("../models/CityAQI");
const AQIHistory = require("../models/AQIHistory");
const Alert = require("../models/Alert");
const { INDIAN_CITIES } = require("../config/cities");

const OPENWEATHER_TOKEN = process.env.OPENWEATHER_API_KEY;
const WAQI_TOKEN = process.env.WAQI_API_KEY;
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 120000);

const runtimeCache = new Map();

/* ---------------- SAFE HELPERS ---------------- */

const safeNumber = (value) => {
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) return null;
  return num;
};

const getHealthAdvisory = (aqi) => {
  if (aqi <= 50) return "Safe outdoor activity";
  if (aqi <= 100) return "Sensitive groups should be cautious";
  if (aqi <= 150) return "Reduce outdoor exertion";
  if (aqi <= 200) return "Avoid outdoor activity";
  return "Emergency: stay indoors";
};

const getAirQualityLevel = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Poor";
  if (aqi <= 200) return "Very Poor";
  return "Hazardous";
};

const normalizeCity = (city) => city.trim().toLowerCase();

/* ---------------- OPENWEATHER ---------------- */

const fetchOpenWeather = async (city) => {
  const [airRes, weatherRes] = await Promise.all([
    axios.get("https://api.openweathermap.org/data/2.5/air_pollution", {
      params: { lat: city.lat, lon: city.lng, appid: OPENWEATHER_TOKEN }
    }),
    axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: { lat: city.lat, lon: city.lng, appid: OPENWEATHER_TOKEN, units: "metric" }
    })
  ]);

  const air = airRes.data?.list?.[0];

  if (!air?.main) throw new Error("Invalid OpenWeather response");

  const aqi = safeNumber(air.main.aqi * 50); // FIX: scale correction

  return {
    city: city.city,
    lat: city.lat,
    lng: city.lng,
    aqi,
    pm25: safeNumber(air.components?.pm2_5),
    pm10: safeNumber(air.components?.pm10),
    temperature: weatherRes.data?.main?.temp ?? null,
    humidity: weatherRes.data?.main?.humidity ?? null,
    quality: getAirQualityLevel(aqi),
    advisory: getHealthAdvisory(aqi),
    source: "openweather",
    updatedAt: new Date()
  };
};

/* ---------------- WAQI ---------------- */

const fetchWAQI = async (city) => {
  if (!WAQI_TOKEN) throw new Error("WAQI API key missing");

  const res = await axios.get(
    `https://api.waqi.info/feed/geo:${city.lat};${city.lng}/`,
    { params: { token: WAQI_TOKEN } }
  );

  const data = res.data?.data;

  if (res.data?.status !== "ok" || !data) {
    throw new Error("Invalid WAQI response");
  }

  const aqi = safeNumber(data.aqi);

  return {
    city: city.city,
    lat: city.lat,
    lng: city.lng,
    aqi,
    pm25: safeNumber(data?.iaqi?.pm25?.v),
    pm10: safeNumber(data?.iaqi?.pm10?.v),
    temperature: safeNumber(data?.iaqi?.t?.v),
    humidity: safeNumber(data?.iaqi?.h?.v),
    quality: getAirQualityLevel(aqi),
    advisory: getHealthAdvisory(aqi),
    source: "waqi",
    updatedAt: new Date()
  };
};

/* ---------------- MAIN FETCH ---------------- */

const fetchCityAQI = async (city) => {
  try {
    if (OPENWEATHER_TOKEN) {
      return await fetchOpenWeather(city);
    }
    if (WAQI_TOKEN) {
      return await fetchWAQI(city);
    }
    throw new Error("No API keys configured");
  } catch (err) {
    // fallback safe retry
    if (WAQI_TOKEN) return fetchWAQI(city);
    throw err;
  }
};

/* ---------------- CACHE SAVE ---------------- */

const upsertCityData = async (data) => {
  const key = normalizeCity(data.city);
  runtimeCache.set(key, data);

  await CityAQI.findOneAndUpdate(
    { city: data.city },
    data,
    { upsert: true, new: true }
  );

  await AQIHistory.create({
    city: data.city,
    aqi: data.aqi,
    pm25: data.pm25,
    pm10: data.pm10,
    temperature: data.temperature,
    humidity: data.humidity,
    timestamp: data.updatedAt
  });

  if (data.aqi >= 150) {
    await Alert.create({
      type: "AQI Alert",
      message: `${data.city} AQI is ${data.aqi}`,
      city: data.city,
      severity: data.aqi > 200 ? "critical" : "high",
      timestamp: new Date()
    });
  }
};

/* ---------------- PUBLIC APIs ---------------- */

const getAllAQI = async () => CityAQI.find().lean();

const getAQIByCity = async (city) => {
  const cached = await CityAQI.findOne({ city }).lean();

  if (cached) {
    const diff = Date.now() - new Date(cached.updatedAt).getTime();
    if (diff < CACHE_TTL_MS) return cached;
  }

  const data = await fetchCityAQI({ city, lat: 0, lng: 0 });

  await upsertCityData(data);
  return data;
};

const getAlerts = async () => Alert.find().sort({ timestamp: -1 }).lean();

const getTrendByCity = async (city) => {
  const from = new Date(Date.now() - 7 * 86400000);

  return AQIHistory.find({
    city,
    timestamp: { $gte: from }
  }).sort({ timestamp: 1 }).lean();
};

const getSupportedCities = async () => INDIAN_CITIES;

const refreshAllCitiesAQI = async () => {
  for (const city of INDIAN_CITIES) {
    try {
      const data = await fetchCityAQI(city);
      await upsertCityData(data);
    } catch (e) {
      console.log("City failed:", city.city);
    }
  }
};

module.exports = {
  refreshAllCitiesAQI,
  getAllAQI,
  getAQIByCity,
  getAlerts,
  getTrendByCity,
  getSupportedCities
};