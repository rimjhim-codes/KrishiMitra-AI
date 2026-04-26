import { NavLink } from "react-router-dom";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
  { path: "/map", label: "Global Map", icon: "ri-earth-line" },
  { path: "/trends", label: "Trend Analysis", icon: "ri-line-chart-line" },
  { path: "/alerts", label: "Alert Logs", icon: "ri-alarm-warning-line" }
];

function Sidebar() {
  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-72 border-r border-white/10 bg-white/70 px-5 py-7 backdrop-blur-xl dark:bg-slate-900/70 md:fixed md:block">
      <h1 className="mb-2 bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300 bg-clip-text text-3xl font-bold text-transparent">
        AirSense
      </h1>
      <p className="mb-8 text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Hyperlocal Monitoring</p>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/20 text-cyan-100 shadow-glow"
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`
              }
            >
              <i className={`${item.icon} text-lg`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

