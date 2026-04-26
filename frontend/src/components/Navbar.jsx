function Navbar({
  searchQuery,
  onSearchChange,
  searchResults,
  selectedLocationId,
  onLocationSelect,
  onFetchCity,
  isDarkMode,
  onToggleTheme
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/65 px-4 py-4 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 md:sticky md:top-4 md:z-20 md:flex-row md:items-center md:justify-between md:px-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Operations Console</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Air Quality Intelligence</h2>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="relative w-full max-w-lg">
          <i className="ri-search-line pointer-events-none absolute left-3 top-3 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search location, city or zone..."
            className="w-full rounded-xl border border-slate-300/70 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          />
          {!!searchQuery.trim() && (
            <div className="absolute mt-2 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
              {searchResults.length === 0 && (
                <button
                  onClick={() => onFetchCity(searchQuery)}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-cyan-600 hover:bg-slate-100 dark:text-cyan-300 dark:hover:bg-white/10"
                >
                  Fetch live AQI for "{searchQuery}"
                </button>
              )}
              {searchResults.map((location) => (
                <button
                  key={location.id}
                  onClick={() => onLocationSelect(location.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    selectedLocationId === location.id
                      ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-200"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  <span>{location.name}</span>
                  <span className="text-xs opacity-70">{location.aqi !== undefined ? `AQI ${location.aqi}` : "Fetch live"}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="rounded-xl border border-slate-300/60 bg-white p-2 text-slate-600 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <i className="ri-notification-3-line text-lg" />
        </button>
        <button
          onClick={onToggleTheme}
          className="rounded-xl border border-slate-300/60 bg-white p-2 text-slate-600 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        >
          <i className={`${isDarkMode ? "ri-sun-line" : "ri-moon-clear-line"} text-lg`} />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-slate-300/60 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 font-semibold text-cyan-700 dark:text-cyan-200">
            A
          </div>
          <div className="hidden text-xs sm:block">
            <p className="font-medium text-slate-900 dark:text-slate-100">Gov Ops</p>
            <p className="text-slate-500 dark:text-slate-400">AirSense Control</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

