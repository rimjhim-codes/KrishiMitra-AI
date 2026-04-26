import AlertsPanel from "../components/AlertsPanel";

function AlertsPage({ alerts, selectedLocation }) {
  const locationAlerts = alerts.filter((alert) => !selectedLocation || alert.city === selectedLocation.city);

  return (
    <div className="space-y-4">
      <section className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Health Advisory</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {selectedLocation
            ? `${selectedLocation.name} currently reports AQI ${selectedLocation.aqi}. Limit prolonged outdoor activity if sensitive to particulate matter.`
            : "Select a location to view specific advisory details."}
        </p>
      </section>
      <AlertsPanel alerts={locationAlerts} />
    </div>
  );
}

export default AlertsPage;
