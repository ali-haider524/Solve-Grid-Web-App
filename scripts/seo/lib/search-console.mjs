import { fetchJson } from "./http.mjs";

const SEARCH_ANALYTICS_BASE = "https://www.googleapis.com/webmasters/v3/sites";
const URL_INSPECTION_ENDPOINT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";

export const SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function sitePath(siteUrl) {
  return encodeURIComponent(siteUrl);
}

export async function querySearchAnalytics({
  token,
  siteUrl,
  startDate,
  endDate,
  dimensions,
  searchType = "web",
  rowLimit = 25000,
}) {
  const url = `${SEARCH_ANALYTICS_BASE}/${sitePath(siteUrl)}/searchAnalytics/query`;
  const response = await fetchJson(
    url,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        type: searchType,
        rowLimit,
        dataState: "final",
      }),
    },
    `Search Console ${dimensions.join("+")} report`,
  );

  return response.rows || [];
}

export async function inspectUrl({ token, siteUrl, inspectionUrl, languageCode = "en-US" }) {
  const response = await fetchJson(
    URL_INSPECTION_ENDPOINT,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ inspectionUrl, siteUrl, languageCode }),
    },
    `URL Inspection ${inspectionUrl}`,
  );

  return response.inspectionResult || response;
}
