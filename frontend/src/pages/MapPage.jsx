import AQIMap, { colorByAqi } from "../components/AQIMap";

function MapPage({ locations, selectedLocation, onLocationSelect }) {
  return (
    <div className="space-y-4">
      <AQIMap locations={locations} onLocationSelect={onLocationSelect} selectedLocation={selectedLocation} />
      <section className="glass-card grid gap-3 rounded-2xl p-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => onLocationSelect(location.id)}
            className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${
              selectedLocation?.id === location.id
                ? "border-cyan-400/70 bg-cyan-500/10"
                : "border-slate-300/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium text-slate-800 dark:text-slate-100">{location.name}</p>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorByAqi(location.aqi) }} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{location.city}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">AQI {location.aqi}</p>
          </button>
        ))}
      </section>
    </div>
  );
}

export default MapPage;
