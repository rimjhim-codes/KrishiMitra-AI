const locationSeed = [
  { name: "Downtown", lat: 28.6139, lng: 77.209, aqi: 92, temperature: 30, humidity: 58 },
  { name: "Green Park", lat: 28.559, lng: 77.207, aqi: 48, temperature: 28, humidity: 62 },
  { name: "Industrial Zone", lat: 28.7041, lng: 77.1025, aqi: 138, temperature: 33, humidity: 49 },
  { name: "University Area", lat: 28.545, lng: 77.1926, aqi: 76, temperature: 29, humidity: 55 },
  { name: "Airport Belt", lat: 28.5562, lng: 77.1, aqi: 110, temperature: 31, humidity: 52 },
  { name: "Riverfront", lat: 28.6206, lng: 77.2285, aqi: 64, temperature: 27, humidity: 67 }
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const mutateLocation = (location) => {
  const aqiDrift = randomBetween(-8, 10);
  const tempDrift = randomBetween(-0.8, 0.8);
  const humidityDrift = randomBetween(-2, 2);

  return {
    ...location,
    aqi: Math.round(clamp(location.aqi + aqiDrift, 20, 220)),
    temperature: Number(clamp(location.temperature + tempDrift, 18, 42).toFixed(1)),
    humidity: Math.round(clamp(location.humidity + humidityDrift, 20, 90))
  };
};

let locations = locationSeed.map((loc) => ({ ...loc }));

const historyLength = 24;
let trendHistory = Array.from({ length: historyLength }, (_, idx) => {
  const date = new Date();
  date.setHours(date.getHours() - (historyLength - idx - 1));
  const baseline = 75 + Math.sin(idx / 2) * 18 + randomBetween(-6, 6);
  return { time: date.toISOString(), aqi: Math.round(clamp(baseline, 30, 180)) };
});

const refreshSensorData = () => {
  locations = locations.map(mutateLocation);
  const avg = locations.reduce((sum, loc) => sum + loc.aqi, 0) / locations.length;
  trendHistory = [
    ...trendHistory.slice(1),
    { time: new Date().toISOString(), aqi: Math.round(avg) }
  ];
};

const getLocations = () => locations;

const generateAlerts = () => {
  const alerts = [];

  locations.forEach((loc) => {
    if (loc.aqi > 120) {
      alerts.push({
        id: `aqi-${loc.name.toLowerCase().replace(/\s+/g, "-")}`,
        type: "High AQI",
        priority: "high",
        message: `${loc.name} AQI is unhealthy at ${loc.aqi}.`,
        timestamp: new Date().toISOString()
      });
    } else if (loc.aqi > 90) {
      alerts.push({
        id: `moderate-${loc.name.toLowerCase().replace(/\s+/g, "-")}`,
        type: "Moderate AQI",
        priority: "medium",
        message: `${loc.name} AQI is rising (${loc.aqi}).`,
        timestamp: new Date().toISOString()
      });
    }

    if (Math.random() > 0.93) {
      alerts.push({
        id: `sensor-${Date.now()}-${loc.name.toLowerCase().replace(/\s+/g, "-")}`,
        type: "Sensor Issue",
        priority: "low",
        message: `Intermittent signal from ${loc.name} sensor.`,
        timestamp: new Date().toISOString()
      });
    }
  });

  return alerts;
};

const predictNextHours = (hours = 6) => {
  const points = trendHistory.map((point, idx) => ({ x: idx, y: point.aqi }));
  const n = points.length;
  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);
  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const predictions = Array.from({ length: hours }, (_, idx) => {
    const x = n + idx;
    const predicted = clamp(intercept + slope * x, 20, 250);
    const date = new Date();
    date.setHours(date.getHours() + idx + 1);
    return {
      time: date.toISOString(),
      aqi: Math.round(predicted)
    };
  });

  return predictions;
};

const getTrendPayload = () => ({
  history: trendHistory.map((point) => ({ ...point, type: "historical" })),
  prediction: predictNextHours(6).map((point) => ({ ...point, type: "predicted" }))
});

module.exports = {
  refreshSensorData,
  getLocations,
  generateAlerts,
  getTrendPayload
};

