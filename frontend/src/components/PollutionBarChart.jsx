import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TREND_CITIES = ["Delhi", "Mumbai", "Bangalore", "Kolkata"];

function PollutionBarChart({ locations }) {
  const data = TREND_CITIES.map((city) => {
    const found = locations.find((location) => location.city === city);
    return { city, aqi: found?.aqi ?? 0 };
  });

  return (
    <section className="glass-card rounded-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">City AQI Comparison</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Delhi vs Mumbai vs Bangalore vs Kolkata</p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
            <XAxis dataKey="city" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: 10,
                color: "#e2e8f0"
              }}
            />
            <Bar dataKey="aqi" fill="#60a5fa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default PollutionBarChart;
