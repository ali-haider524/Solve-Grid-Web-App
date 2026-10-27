import path from "node:path";
import { readJson } from "./lib/fs-utils.mjs";

const root = process.cwd();
const config = await readJson(path.join(root, "seo.config.json"));
const errors = [];

if (!config.siteUrl?.startsWith("https://")) errors.push("siteUrl must use HTTPS.");
if (!config.searchConsoleSiteUrl) errors.push("searchConsoleSiteUrl is required.");
if (!Array.isArray(config.comparisons) || !config.comparisons.length) errors.push("At least one comparison is required.");
if (!Array.isArray(config.priorityPages) || !config.priorityPages.length) errors.push("priorityPages must not be empty.");
for (const page of [...(config.priorityPages || []), ...(config.pagespeedPages || []), ...(config.indexingPages || [])]) {
  if (!page.startsWith("/")) errors.push(`Page path must start with /: ${page}`);
}

if (errors.length) {
  console.error("SEO config validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`SEO config verified: ${config.priorityPages.length} priority pages, ${config.comparisons.length} comparison windows.`);
