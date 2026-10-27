import { fetchJson } from "./http.mjs";

export const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

export async function queryLandingPages({ token, propertyId, startDate, endDate }) {
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const response = await fetchJson(
    endpoint,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "landingPagePlusQueryString" }],
        metrics: [
          { name: "sessions" },
          { name: "engagedSessions" },
          { name: "engagementRate" },
          { name: "activeUsers" },
          { name: "averageSessionDuration" },
        ],
        limit: "10000",
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
    },
    "Google Analytics landing-page report",
  );

  const metricNames = (response.metricHeaders || []).map((item) => item.name);
  return (response.rows || []).map((row) => {
    const metrics = Object.fromEntries(
      metricNames.map((name, index) => [name, Number(row.metricValues?.[index]?.value || 0)]),
    );
    return {
      landingPage: row.dimensionValues?.[0]?.value || "(not set)",
      ...metrics,
    };
  });
}
