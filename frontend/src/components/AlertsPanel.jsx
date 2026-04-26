const priorityStyle = {
  critical: "border-purple-400/70 bg-purple-500/20 text-purple-100",
  high: "border-red-400/60 bg-red-500/10 text-red-200",
  medium: "border-yellow-400/60 bg-yellow-500/10 text-yellow-200",
  low: "border-cyan-400/60 bg-cyan-500/10 text-cyan-200"
};

function AlertsPanel({ alerts }) {
  return (
    <section className="glass-card rounded-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Alert Logs</h3>
        <span className="rounded-full bg-slate-200/70 px-2 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">
          {alerts.length}
        </span>
      </div>
      <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
            No active alerts. Air quality is stable.
          </p>
        ) : (
          alerts.map((alert) => (
            <article
              key={alert.id}
              className={`rounded-xl border p-3 text-sm transition hover:-translate-y-0.5 ${
                priorityStyle[alert.priority] || priorityStyle.medium
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium">{alert.type}</p>
                <span className="text-[11px] uppercase">{alert.priority}</span>
              </div>
              <p className="mb-1 text-xs opacity-80">{alert.city}</p>
              <p>{alert.message}</p>
              <p className="mt-2 text-[11px] opacity-70">{new Date(alert.issuedAt).toLocaleString()}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default AlertsPanel;

