import React, { useEffect, useState } from "react";
import {
  fetchConnectionScores,
  fetchLonelinessTrend,
  fetchConnectionBands,
  fetchSocialConnectionInsights,
  fetchVolunteeringTrend,
} from "../client";

export default function TestConnection() {
  const [data, setData] = useState({
    scores: null,
    loneliness: null,
    bands: null,
    insights: null,
    volunteering: null,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        // Fetch all 5 endpoints in parallel
        const [scores, loneliness, bands, insights, volunteering] =
          await Promise.all([
            fetchConnectionScores(),
            fetchLonelinessTrend(),
            fetchConnectionBands(),
            fetchSocialConnectionInsights(),
            fetchVolunteeringTrend(),
          ]);

        setData({ scores, loneliness, bands, insights, volunteering });
      } catch (err) {
        console.error("Backend test failed:", err);
        setError(err.message);
      }
    }
    loadAll();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-600">
         Backend test failed: {error}
      </div>
    );
  }

  if (!data.scores) {
    return (
      <div className="p-6 text-blue-600 animate-pulse">
        Connecting to backend... please wait ⏳
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">✅ Backend Connection Successful!</h1>
      <p className="text-gray-700">Below are live samples from your AWS DB:</p>

      <div>
        <h2 className="text-lg font-semibold text-blue-700">Connection Scores</h2>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
          {JSON.stringify(data.scores.slice(0, 2), null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-blue-700">Loneliness Trend</h2>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
          {JSON.stringify(data.loneliness.slice(0, 5), null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-blue-700">Connection Bands</h2>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
          {JSON.stringify(data.bands, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-blue-700">Social Connection Insights</h2>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
          {JSON.stringify(data.insights.slice(0, 2), null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-blue-700">Volunteering Trend</h2>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
          {JSON.stringify(data.volunteering.slice(0, 5), null, 2)}
        </pre>
      </div>
    </div>
  );
}
