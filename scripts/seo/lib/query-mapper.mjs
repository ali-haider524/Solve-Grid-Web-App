import fs from "node:fs";
import path from "node:path";

function normHeader(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function parseCsv(text) {
  const delimiter = (text.split(/\r?\n/, 1)[0]?.match(/\t/g)?.length || 0) >
    (text.split(/\r?\n/, 1)[0]?.match(/,/g)?.length || 0) ? "\t" : ",";
  const rows = [];
  let row = [], field = "", quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i += 1; }
      else quoted = !quoted;
    } else if (!quoted && ch === delimiter) {
      row.push(field); field = "";
    } else if (!quoted && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field); field = "";
      if (row.some((v) => String(v).trim())) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((v) => String(v).trim())) rows.push(row);
  return rows;
}

function metric(value, type) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "—" || raw === "-") return 0;
  if (type === "ctr") {
    if (raw.includes("%")) return (Number(raw.replace(/[%\s,]/g, "")) || 0) / 100;
    const n = Number(raw.replace(/,/g, "")) || 0;
    return n > 1 ? n / 100 : n;
  }
  return Number(raw.replace(/[,%\s]/g, "")) || 0;
}

function column(headers, metricName, period) {
  const candidates = headers.filter((h) => normHeader(h).includes(metricName));
  const prevWords = ["previous", "prev", "prior"];
  if (period === "previous") {
    return candidates.find((h) => prevWords.some((w) => normHeader(h).includes(w))) || null;
  }
  return candidates.find((h) => !prevWords.some((w) => normHeader(h).includes(w)) &&
    !normHeader(h).includes("difference") && !normHeader(h).includes("change")) || null;
}

function queryColumn(headers) {
  return headers.find((h) => {
    const n = normHeader(h);
    return n === "query" || n === "queries" || n.includes("top queries");
  }) || null;
}

export function parseComparisonQueriesCsv(filePath) {
  const matrix = parseCsv(fs.readFileSync(filePath, "utf8"));
  if (!matrix.length) throw new Error(`Empty CSV: ${filePath}`);
  const headers = matrix[0].map((h) => String(h).replace(/^\uFEFF/, "").trim());
  const qCol = queryColumn(headers);
  if (!qCol) throw new Error(`Query column not found in ${filePath}`);

  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
  const cols = {};
  for (const m of ["clicks", "impressions", "ctr", "position"]) {
    cols[m] = { current: column(headers, m, "current"), previous: column(headers, m, "previous") };
    if (!cols[m].current || !cols[m].previous) {
      throw new Error(`Comparison columns for ${m} not found in ${filePath}`);
    }
  }

  return matrix.slice(1).map((values) => {
    const query = String(values[idx[qCol]] || "").trim();
    const current = {}, previous = {};
    for (const m of ["clicks", "impressions", "ctr", "position"]) {
      current[m] = metric(values[idx[cols[m].current]], m);
      previous[m] = metric(values[idx[cols[m].previous]], m);
    }
    return {
      query,
      current,
      previous,
      changes: {
        impressions: current.impressions - previous.impressions,
        position: current.position && previous.position ? current.position - previous.position : null,
      },
    };
  }).filter((r) => r.query);
}

function slugForPage(page) {
  if (page === "/") return "home";
  return page.replace(/^\/+/, "").replaceAll("/", "__");
}

function scoreRows(rows) {
  return rows.map((row) => {
    let score = 0;
    const pos = row.current.position;
    const imp = row.current.impressions;
    if (pos > 0 && pos <= 10) score += 100;
    else if (pos <= 20) score += 85;
    else if (pos <= 40) score += 70;
    else if (pos <= 60) score += 45;
    else score += 15;
    score += Math.min(30, Math.log10(imp + 1) * 15);
    if (row.previous.impressions >= 3 && row.current.impressions === 0) score += 18;
    if (row.changes.position !== null && row.changes.position < -10) score += 12;
    return { ...row, score: Math.round(score * 10) / 10 };
  }).sort((a, b) => b.score - a.score);
}

function mdEsc(v) {
  return String(v ?? "").replaceAll("|", "\\|");
}

export function runQueryMapper({
  repoRoot = process.cwd(),
  auditPath = path.join(process.cwd(), "seo-output", "recovery-audit.json"),
  inputRoot = path.join(process.cwd(), "seo-input", "page-queries"),
  outputDir = path.join(process.cwd(), "seo-output"),
} = {}) {
  if (!fs.existsSync(auditPath)) throw new Error(`Recovery audit missing: ${auditPath}`);

  const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
  const protectedPages = new Set(audit.protectedPages || []);
  const pages = [...new Set((audit.clusters || []).flatMap((c) => c.pages || []))];

  const pageResults = [];
  for (const page of pages) {
    const slug = slugForPage(page);
    const csvPath = path.join(inputRoot, slug, "Queries.csv");
    const auditPage = (audit.clusters || []).flatMap((c) => c.pageAudits || []).find((p) => p.page === page);
    const lowRiskAuditActions = (auditPage?.recommendations || []).filter((r) => r.risk === "LOW");

    if (!fs.existsSync(csvPath)) {
      pageResults.push({
        page,
        slug,
        status: lowRiskAuditActions.length ? "READY_LOW_RISK_ONLY" : "HOLD_NEEDS_PAGE_QUERY_DATA",
        queryData: false,
        csvPath: path.relative(repoRoot, csvPath).replaceAll("\\", "/"),
        lowRiskAuditActions,
        topQueries: [],
      });
      continue;
    }

    const rows = scoreRows(parseComparisonQueriesCsv(csvPath));
    const meaningful = rows.filter((r) =>
      r.current.impressions >= 2 ||
      r.previous.impressions >= 3 ||
      (r.current.position > 0 && r.current.position <= 30)
    );

    pageResults.push({
      page,
      slug,
      status: protectedPages.has(page) ? "PROTECTED" :
        meaningful.length ? "READY_FOR_IMPLEMENTATION_REVIEW" :
        (lowRiskAuditActions.length ? "READY_LOW_RISK_ONLY" : "HOLD_WEAK_QUERY_DATA"),
      queryData: true,
      csvPath: path.relative(repoRoot, csvPath).replaceAll("\\", "/"),
      lowRiskAuditActions,
      topQueries: meaningful.slice(0, 12),
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    mode: "advisory-query-mapper",
    sourceAuditGeneratedAt: audit.generatedAt || null,
    policy: {
      productionEdits: false,
      gitPush: false,
      deploy: false,
      weakSignalMetadataChanges: "BLOCKED",
    },
    pageResults,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, "change-gate.json");
  const mdPath = path.join(outputDir, "change-gate.md");
  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), "utf8");

  const lines = [
    "# SolveGrid SEO Change Gate — Phase 4",
    "",
    `Generated: ${output.generatedAt}`,
    "",
    "This phase maps page-specific Search Console queries to the Recovery Audit before any implementation.",
    "",
    "## Decision table",
    "",
    "| Page | Status | Page-query CSV | Confirmed low-risk audit actions |",
    "| --- | --- | --- | --- |",
  ];

  for (const item of pageResults) {
    lines.push(`| ${mdEsc(item.page)} | ${item.status} | ${item.queryData ? "yes" : "no"} | ${mdEsc(item.lowRiskAuditActions.map((a) => a.type).join(", ") || "none")} |`);
  }

  for (const item of pageResults) {
    lines.push("", `## ${item.page}`, "");
    lines.push(`Status: **${item.status}**`);
    lines.push("");
    if (!item.queryData) {
      lines.push(`Missing page-specific comparison export: \`${item.csvPath}\``);
      lines.push("");
    }
    if (item.lowRiskAuditActions.length) {
      lines.push("Low-risk source audit actions:");
      for (const a of item.lowRiskAuditActions) lines.push(`- **${a.type}** — ${a.reason}`);
      lines.push("");
    }
    if (item.topQueries.length) {
      lines.push("| Query | Current impr. | Previous impr. | Current pos. | Previous pos. |");
      lines.push("| --- | ---: | ---: | ---: | ---: |");
      for (const q of item.topQueries) {
        lines.push(`| ${mdEsc(q.query)} | ${q.current.impressions} | ${q.previous.impressions} | ${q.current.position || "—"} | ${q.previous.position || "—"} |`);
      }
      lines.push("");
    }
  }

  lines.push("## Implementation rule", "");
  lines.push("Only pages marked `READY_FOR_IMPLEMENTATION_REVIEW` or `READY_LOW_RISK_ONLY` should move to the implementation agent. Titles, H1s, URLs and canonicals remain blocked unless stronger page-specific query evidence supports a separate approval.");
  lines.push("");

  fs.writeFileSync(mdPath, lines.join("\n"), "utf8");
  return { output, jsonPath, mdPath };
}
