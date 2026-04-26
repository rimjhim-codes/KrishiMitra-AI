import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function TrendChart({ trendData = [], title = "AQI Trend (Past 7 Days)" }) {
  const merged = trendData.map((item) => ({ ...item }));

  return (
    <section className="glass-card rounded-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Last 7 days live history</p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
            <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: 10,
                color: "#e2e8f0"
              }}
            />
            <Line type="monotone" dataKey="aqi" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3, fill: "#67e8f9" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default TrendChart;

