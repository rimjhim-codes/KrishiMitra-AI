import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { fetchAlerts, fetchCities, fetchCityAQI, fetchLocations, fetchTrends } from "./api";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import MapPage from "./pages/MapPage";
import TrendPage from "./pages/TrendPage";
import AlertsPage from "./pages/AlertsPage";

const REFRESH_INTERVAL_MS = 60000;

function App() {
  const [locations, setLocations] = useState([]);
  const [cityDirectory, setCityDirectory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [cityTrend, setCityTrend] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("airsense-theme") !== "light");

  const loadData = async () => {
    try {
      const [locationData, alertData] = await Promise.all([fetchLocations(), fetchAlerts()]);
      const cities = await fetchCities();

      setLocations(locationData);
      setCityDirectory(cities);
      setAlerts(alertData);
      setSelectedLocationId((current) => current || locationData[0]?.id || "");
      setError("");
    } catch (err) {
      setError(err.message || "Unable to fetch air quality streams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    localStorage.setItem("airsense-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocationId) || locations[0] || null,
    [locations, selectedLocationId]
  );

 const searchResults = useMemo(() => {
  const query = searchQuery.trim().toLowerCase();

  if (!query) return locations;

  return locations.filter((location) =>
    location.name.toLowerCase().includes(query) ||
    location.city.toLowerCase().includes(query)
  );
}, [locations, searchQuery]);

 const handleCityFetch = async (cityName) => {
  try {
    const liveCity = await fetchCityAQI(cityName);

    // 🚨 VALIDATION FIX (IMPORTANT)
    if (!liveCity || !liveCity.aqi || liveCity.aqi <= 0) {
      throw new Error("No valid AQI data received");
    }

    setLocations((current) => {
      const without = current.filter((item) => item.id !== liveCity.id);
      return [liveCity, ...without];
    });

    setSelectedLocationId(liveCity.id);
    setSearchQuery("");
  } catch (err) {
    setError("Live AQI data unavailable for this city");
  }
};

  useEffect(() => {
    if (!selectedLocation?.city) return;
    fetchTrends(selectedLocation.city)
      .then(setCityTrend)
      .catch(() => setCityTrend([]));
  }, [selectedLocation?.city]);

  return (
    <div className="min-h-screen bg-app-bg text-slate-100 transition-colors duration-300 dark:bg-slate-950">
      <Sidebar />
      <main className="min-h-screen pl-0 md:pl-72">
        <div className="mx-auto max-w-[1600px] p-4 md:p-8">
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResults={searchResults}
            selectedLocationId={selectedLocation?.id || ""}
            onLocationSelect={(id) => {
              const match = searchResults.find((entry) => entry.id === id);
              if (match?.aqi === undefined) {
                handleCityFetch(match.city);
              } else {
                setSelectedLocationId(id);
                setSearchQuery("");
              }
            }}
            onFetchCity={handleCityFetch}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode((current) => !current)}
          />

          {loading && <p className="mt-6 text-sm text-slate-400">Syncing live sensor feed...</p>}
          {error && (
            <p className="mt-6 rounded-xl border border-red-400/50 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>
          )}

          {!loading && !error && (
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    locations={locations}
                    selectedLocation={selectedLocation}
                    trends={cityTrend}
                    alerts={alerts}
                    onLocationSelect={setSelectedLocationId}
                  />
                }
              />
              <Route
                path="/map"
                element={
                  <MapPage
                    locations={searchResults}
                    selectedLocation={selectedLocation}
                    onLocationSelect={setSelectedLocationId}
                  />
                }
              />
              <Route path="/trends" element={<TrendPage selectedLocation={selectedLocation} trends={cityTrend} locations={locations} />} />
              <Route path="/alerts" element={<AlertsPage alerts={alerts} selectedLocation={selectedLocation} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

