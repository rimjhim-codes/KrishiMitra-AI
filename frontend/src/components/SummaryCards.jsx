const getAqiBadge = (aqi) => {
  if (aqi <= 60) return "bg-emerald-500/20 text-emerald-300";
  if (aqi <= 110) return "bg-yellow-500/20 text-yellow-300";
  return "bg-red-500/20 text-red-300";
};

function SummaryCards({ locations, selectedLocation, onLocationSelect }) {
  const avgAqi = locations.length
    ? Math.round(locations.reduce((acc, loc) => acc + loc.aqi, 0) / locations.length)
    : 0;

  const best = [...locations].sort((a, b) => a.aqi - b.aqi)[0];
  const worst = [...locations].sort((a, b) => b.aqi - a.aqi)[0];
  const avgTemp = locations.length
    ? (locations.reduce((acc, loc) => acc + loc.temperature, 0) / locations.length).toFixed(1)
    : "0.0";
  const avgHumidity = locations.length
    ? Math.round(locations.reduce((acc, loc) => acc + loc.humidity, 0) / locations.length)
    : 0;

  const cards = [
    {
      id: "current",
      title: "Current AQI",
      value: selectedLocation ? selectedLocation.aqi : avgAqi,
      subtitle: selectedLocation ? selectedLocation.name : "Network average",
      icon: "ri-windy-line",
      colorClass: getAqiBadge(selectedLocation ? selectedLocation.aqi : avgAqi)
    },
    {
      id: "average",
      title: "Average AQI India",
      value: avgAqi,
      subtitle: "Across monitored cities",
      icon: "ri-bar-chart-box-line",
      colorClass: getAqiBadge(avgAqi)
    },
    { id: "best", title: "Best Area", value: best ? best.name : "-", subtitle: best ? `AQI ${best.aqi}` : "-", icon: "ri-heart-pulse-line" },
    { id: "worst", title: "Worst Area", value: worst ? worst.name : "-", subtitle: worst ? `AQI ${worst.aqi}` : "-", icon: "ri-alert-line" },
    {
      id: "weather",
      title: "Temperature + Humidity",
      value: selectedLocation ? `${selectedLocation.temperature}°C` : `${avgTemp}°C`,
      subtitle: selectedLocation ? `${selectedLocation.humidity}% humidity` : `${avgHumidity}% humidity`,
      icon: "ri-temp-hot-line"
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => {
            if (card.id === "best" && best) onLocationSelect(best.id);
            if (card.id === "worst" && worst) onLocationSelect(worst.id);
          }}
          className="glass-card rounded-2xl p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-cyan-400/60"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-400 dark:text-slate-300">{card.title}</p>
            <i className={`${card.icon} text-xl text-cyan-300`} />
          </div>
          <p className="truncate text-xl font-semibold text-slate-900 dark:text-slate-100">{card.value}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.subtitle}</p>
          {card.colorClass && <span className={`mt-3 inline-block rounded-full px-2 py-1 text-xs ${card.colorClass}`}>Live</span>}
        </button>
      ))}
    </section>
  );
}

export default SummaryCards;

