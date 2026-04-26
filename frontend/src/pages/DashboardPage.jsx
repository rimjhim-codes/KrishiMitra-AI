import SummaryCards from "../components/SummaryCards";
import AQIMap from "../components/AQIMap";
import TrendChart from "../components/TrendChart";
import AlertsPanel from "../components/AlertsPanel";

function DashboardPage({ locations, selectedLocation, trends, alerts, onLocationSelect }) {
  const polluted = [...locations].sort((a, b) => b.aqi - a.aqi).slice(0, 5);
  const cleanest = [...locations].sort((a, b) => a.aqi - b.aqi).slice(0, 5);

  return (
    <div className="space-y-4">
      <SummaryCards locations={locations} selectedLocation={selectedLocation} onLocationSelect={onLocationSelect} />
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="glass-card rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Top Polluted Cities</h3>
          <div className="space-y-2">
            {polluted.map((city) => (
              <button
                key={city.id}
                onClick={() => onLocationSelect(city.id)}
                className="flex w-full items-center justify-between rounded-lg bg-red-500/10 px-3 py-2 text-sm text-slate-700 transition hover:bg-red-500/20 dark:text-slate-100"
              >
                <span>{city.city}</span>
                <span className="font-semibold text-red-400">{city.aqi}</span>
              </button>
            ))}
          </div>
        </article>
        <article className="glass-card rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Cleanest Cities</h3>
          <div className="space-y-2">
            {cleanest.map((city) => (
              <button
                key={city.id}
                onClick={() => onLocationSelect(city.id)}
                className="flex w-full items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-slate-700 transition hover:bg-emerald-500/20 dark:text-slate-100"
              >
                <span>{city.city}</span>
                <span className="font-semibold text-emerald-400">{city.aqi}</span>
              </button>
            ))}
          </div>
        </article>
      </section>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AQIMap locations={locations} onLocationSelect={onLocationSelect} selectedLocation={selectedLocation} />
        </div>
        <AlertsPanel alerts={alerts} />
      </div>
      <TrendChart trendData={trends || []} title={`${selectedLocation?.name || "City"} AQI Trend`} />
    </div>
  );
}

export default DashboardPage;
