import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

export const colorByAqi = (aqi) => {
  const value = typeof aqi === "number" ? aqi : 0;

  if (value <= 50) return "#10b981";
  if (value <= 100) return "#facc15";
  if (value <= 150) return "#f97316";
  if (value <= 200) return "#ef4444";
  return "#a855f7";
};

const createMarkerIcon = (aqi) => {
  const safeAqi = typeof aqi === "number" ? aqi : 0;

  return L.divIcon({
    className: "custom-aqi-marker",
    html: `<span style="
      display:block;
      width:14px;
      height:14px;
      border-radius:9999px;
      background:${colorByAqi(safeAqi)};
      border:2px solid #0f172a;
      box-shadow:0 0 0 2px rgba(255,255,255,0.8)
    "></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

function FlyToLocation({ selectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (
      typeof selectedLocation?.lat === "number" &&
      typeof selectedLocation?.lng === "number"
    ) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 7, {
        duration: 0.8
      });
    }
  }, [map, selectedLocation]);

  return null;
}

function AQIMap({ locations = [], onLocationSelect, selectedLocation }) {
  const center = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [22.5937, 78.9629];

  // 🚨 FILTER INVALID DATA
  const validLocations = locations.filter(
    (loc) =>
      loc &&
      typeof loc.lat === "number" &&
      typeof loc.lng === "number"
  );

  if (!validLocations.length) {
    return (
      <section className="glass-card rounded-2xl p-4 text-sm text-slate-500 dark:text-slate-300">
        No city data available.
      </section>
    );
  }

  return (
    <section className="glass-card h-[520px] rounded-2xl p-4">
      <MapContainer
        center={center}
        zoom={5}
        className="h-full w-full rounded-xl"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToLocation selectedLocation={selectedLocation} />

        {validLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createMarkerIcon(loc.aqi)}
            eventHandlers={{
              click: () => onLocationSelect?.(loc.id)
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{loc.name}</p>
                <p>AQI: {loc.aqi ?? "No Data"}</p>
                <p>PM2.5: {loc.pm25 ?? "N/A"}</p>
                <p>PM10: {loc.pm10 ?? "N/A"}</p>
                <p>Health: {loc.advisory ?? "No advisory available"}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}

export default AQIMap;