import TrendChart from "../components/TrendChart";
import PollutionBarChart from "../components/PollutionBarChart";

function TrendPage({ selectedLocation, trends, locations }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TrendChart
        trendData={trends || []}
        title={`${selectedLocation?.name || "Selected"} AQI Line Analysis`}
      />
      <PollutionBarChart locations={locations} />
    </div>
  );
}

export default TrendPage;
