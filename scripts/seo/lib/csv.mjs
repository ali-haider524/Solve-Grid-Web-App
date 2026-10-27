import path from "node:path";
import { readdir, readFile, stat } from "node:fs/promises";

function normalizeHeader(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function countDelimiter(line, delimiter) {
  let count = 0;
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') i += 1;
      else quoted = !quoted;
    } else if (!quoted && char === delimiter) {
      count += 1;
    }
  }
  return count;
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  const options = [",", "\t", ";"];
  return options.sort((a, b) => countDelimiter(firstLine, b) - countDelimiter(firstLine, a))[0];
}

export function parseCsv(text, delimiter = detectDelimiter(text)) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (!quoted && char === delimiter) {
      row.push(field);
      field = "";
      continue;
    }

    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((value) => String(value).trim() !== "")) rows.push(row);
      row = [];
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => String(value).trim() !== "")) rows.push(row);
  return rows;
}

export async function readCsv(filePath) {
  const text = await readFile(filePath, "utf8");
  const matrix = parseCsv(text);
  if (!matrix.length) return { headers: [], rows: [] };

  const headers = matrix[0].map((header) => String(header).replace(/^\uFEFF/, "").trim());
  const rows = matrix.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
  return { headers, rows };
}

function metricValue(value, metric) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "—" || raw === "-") return 0;
  if (metric === "ctr") {
    if (raw.includes("%")) return Number(raw.replace(/[%\s,]/g, "")) / 100 || 0;
    const numeric = Number(raw.replace(/,/g, ""));
    return numeric > 1 ? numeric / 100 : numeric || 0;
  }
  return Number(raw.replace(/[,%\s]/g, "")) || 0;
}

function dimensionHeader(headers, dimension) {
  const normalized = headers.map((header) => [header, normalizeHeader(header)]);
  if (dimension === "query") {
    return normalized.find(([, h]) => h === "query" || h === "queries" || h.includes("top queries"))?.[0];
  }
  return normalized.find(([, h]) => h === "page" || h === "pages" || h.includes("top pages"))?.[0];
}

function metricCandidates(headers, metric) {
  return headers.filter((header) => normalizeHeader(header).includes(metric));
}

function periodColumn(headers, metric, period) {
  const candidates = metricCandidates(headers, metric);
  const normalized = candidates.map((header) => ({ header, value: normalizeHeader(header) }));
  const previousWords = ["previous", "prev", "prior"];
  const currentWords = ["last", "current", "recent", "selected"];

  if (period === "previous") {
    return normalized.find(({ value }) => previousWords.some((word) => value.includes(word)))?.header || null;
  }

  const explicitCurrent = normalized.find(({ value }) =>
    currentWords.some((word) => value.includes(word)) && !previousWords.some((word) => value.includes(word)),
  )?.header;
  if (explicitCurrent) return explicitCurrent;

  return normalized.find(({ value }) =>
    !previousWords.some((word) => value.includes(word)) && !value.includes("difference") && !value.includes("change"),
  )?.header || null;
}

function plainMetricColumn(headers, metric) {
  const normalizedMetric = metric === "position" ? ["position", "average position"] : [metric];
  return headers.find((header) => {
    const h = normalizeHeader(header);
    return normalizedMetric.some((name) => h === name || h.endsWith(` ${name}`));
  }) || metricCandidates(headers, metric)[0] || null;
}

function periodLabelFromHeader(header, metric) {
  if (!header) return "";
  return String(header)
    .replace(new RegExp(`^\\s*${metric}\\s*`, "i"), "")
    .trim();
}

function comparisonPeriodInfo(headers) {
  const currentClicks = periodColumn(headers, "clicks", "current");
  const previousClicks = periodColumn(headers, "clicks", "previous");
  const currentLabel = periodLabelFromHeader(currentClicks, "clicks");
  const previousLabel = periodLabelFromHeader(previousClicks, "clicks");
  const daysMatch = currentLabel.match(/(\d+)\s*days?/i);

  return {
    currentLabel: currentLabel || "current period",
    previousLabel: previousLabel || "previous period",
    days: daysMatch ? Number(daysMatch[1]) : null,
  };
}

function toGscRows(rows, headers, dimension, period = "single") {
  const dimensionKey = dimensionHeader(headers, dimension);
  if (!dimensionKey) {
    throw new Error(`Could not find the ${dimension} column. Found headers: ${headers.join(", ")}`);
  }

  const columns = {};
  for (const metric of ["clicks", "impressions", "ctr", "position"]) {
    columns[metric] = period === "single"
      ? plainMetricColumn(headers, metric)
      : periodColumn(headers, metric, period);
  }

  const missing = Object.entries(columns).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    throw new Error(`Could not find ${period} metric columns (${missing.join(", ")}). Headers: ${headers.join(", ")}`);
  }

  return rows
    .map((row) => ({
      [dimension]: String(row[dimensionKey] || "").trim(),
      clicks: metricValue(row[columns.clicks], "clicks"),
      impressions: metricValue(row[columns.impressions], "impressions"),
      ctr: metricValue(row[columns.ctr], "ctr"),
      position: metricValue(row[columns.position], "position"),
    }))
    .filter((row) => row[dimension]);
}

export async function parseGscComparisonCsv(filePath, dimension) {
  const { headers, rows } = await readCsv(filePath);
  const hasPrevious = headers.some((header) => /previous|prev|prior/i.test(header));
  if (!hasPrevious) {
    throw new Error(`${path.basename(filePath)} does not look like a Search Console comparison export.`);
  }
  return {
    current: toGscRows(rows, headers, dimension, "current"),
    previous: toGscRows(rows, headers, dimension, "previous"),
    headers,
    periodInfo: comparisonPeriodInfo(headers),
  };
}

export async function parseGscSingleCsv(filePath, dimension) {
  const { headers, rows } = await readCsv(filePath);
  return toGscRows(rows, headers, dimension, "single");
}

async function walk(dir, depth = 0, maxDepth = 3) {
  const output = [];
  if (depth > maxDepth) return output;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return output;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full, depth + 1, maxDepth));
    else output.push(full);
  }
  return output;
}

export async function findCsvByName(root, targetName) {
  const files = await walk(root);
  return files.find((file) => path.basename(file).toLowerCase() === targetName.toLowerCase()) || null;
}

export async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}
