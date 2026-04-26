import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  timeout: 15000
});

export const healthMessageForAQI = (aqi) => {
  if (aqi <= 50) return "Safe outdoor activity";
  if (aqi <= 100) return "Sensitive caution";
  if (aqi <= 150) return "Reduce outdoor exertion";
  if (aqi <= 200) return "Avoid prolonged outdoor exposure";
  return "Emergency: stay indoors";
};

export const qualityLevelForAQI = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Poor";
  if (aqi <= 200) return "Very Poor";
  return "Hazardous";
};

const transformLocation = (location) => ({
  id: location.city.toLowerCase().replace(/\s+/g, "-"),
  name: location.city,
  city: location.city,
  region: "India",
  lat: location.lat,
  lng: location.lng,
  aqi: location.aqi,
  pm25: location.pm25,
  pm10: location.pm10,
  temperature: location.temperature,
  humidity: location.humidity,
  updatedAt: location.updatedAt,
  quality: location.quality || qualityLevelForAQI(location.aqi),
  advisory: healthMessageForAQI(location.aqi)
});

export const fetchCities = async () => {
  const response = await api.get("/cities");
  return response.data.map((city) => ({
    id: city.city.toLowerCase().replace(/\s+/g, "-"),
    city: city.city,
    name: city.city,
    lat: city.lat,
    lng: city.lng,
    updatedAt: city.updatedAt || null
  }));
};

export const fetchLocations = async () => {
  const response = await api.get("/aqi/all");
  return response.data.map(transformLocation);
};

export const fetchCityAQI = async (city) => {
  const response = await api.get(`/aqi/${encodeURIComponent(city)}`);
  return transformLocation(response.data);
};

export const fetchAlerts = async () => {
  const response = await api.get("/alerts");
  return response.data.map((alert) => ({
    id: alert._id,
    type: alert.type,
    message: alert.message,
    city: alert.city,
    priority: alert.severity,
    issuedAt: alert.timestamp
  }));
};

export const fetchTrends = async (city) => {
  const response = await api.get(`/aqi/trends/${city}`);
  return response.data.map((point) => ({
    day: new Date(point.timestamp).toLocaleDateString([], { weekday: "short" }),
    aqi: point.aqi
  }));
};

export default api;

