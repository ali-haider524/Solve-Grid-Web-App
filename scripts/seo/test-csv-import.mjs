import os from "node:os";
import path from "node:path";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { parseGscComparisonCsv } from "./lib/csv.mjs";

const dir = await mkdtemp(path.join(os.tmpdir(), "solvegrid-seo-csv-"));
const file = path.join(dir, "Queries.csv");
const sample = [
  "Top queries,Clicks Last 7 days,Clicks Previous 7 days,Impressions Last 7 days,Impressions Previous 7 days,CTR Last 7 days,CTR Previous 7 days,Position Last 7 days,Position Previous 7 days",
  '"optimization calculator",0,0,17,40,0%,0%,32.7,42',
  '"matrix rank calculator",1,0,50,30,2%,0%,26.5,41',
].join("\n");

try {
  await writeFile(file, sample, "utf8");
  const parsed = await parseGscComparisonCsv(file, "query");
  if (parsed.current.length !== 2 || parsed.previous.length !== 2) throw new Error("Unexpected CSV row count.");
  if (parsed.current[0].query !== "optimization calculator") throw new Error("Query parsing failed.");
  if (parsed.current[0].impressions !== 17 || parsed.previous[0].impressions !== 40) throw new Error("Comparison metric parsing failed.");
  if (Math.abs(parsed.current[1].ctr - 0.02) > 0.0001) throw new Error("CTR parsing failed.");
  if (parsed.periodInfo?.days !== 7) throw new Error("Comparison window detection failed.");
  if (!parsed.periodInfo?.currentLabel.toLowerCase().includes("last 7 days")) throw new Error("Current-period label detection failed.");
  console.log("SEO CSV importer V2 tests passed.");
} finally {
  await rm(dir, { recursive: true, force: true });
}
