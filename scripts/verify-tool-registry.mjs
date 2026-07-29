import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const toolsFile = path.join(root, "lib", "tools.ts");

if (!fs.existsSync(toolsFile)) {
  console.error("Tool registry verification failed: lib/tools.ts is missing.");
  process.exit(1);
}

const source = fs.readFileSync(toolsFile, "utf8");
const toolsArrayStart = source.indexOf("export const tools: ToolInfo[] = [");
const toolsArrayEnd = source.indexOf("\n];", toolsArrayStart);

if (toolsArrayStart < 0 || toolsArrayEnd < 0) {
  console.error("Tool registry verification failed: tools array was not found.");
  process.exit(1);
}

const toolsSource = source.slice(toolsArrayStart, toolsArrayEnd);
const slugs = [...toolsSource.matchAll(/\bslug:\s*"([a-z0-9-]+)"/g)].map(
  (match) => match[1],
);
const uniqueSlugs = new Set(slugs);
const errors = [];

if (!slugs.length) {
  errors.push("No tool slugs were found in lib/tools.ts.");
}

if (uniqueSlugs.size !== slugs.length) {
  const seen = new Set();
  const duplicates = slugs.filter((slug) => {
    if (seen.has(slug)) return true;
    seen.add(slug);
    return false;
  });
  errors.push(`Duplicate tool slugs: ${[...new Set(duplicates)].join(", ")}`);
}

for (const slug of uniqueSlugs) {
  const route = path.join(root, "app", slug, "page.tsx");
  if (!fs.existsSync(route)) {
    errors.push(`Tool registry entry has no route: /${slug}`);
  }
}

if (errors.length) {
  console.error("SolveGrid tool registry verification failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `SolveGrid platform verified: ${uniqueSlugs.size} tools and ${uniqueSlugs.size} public tool routes are connected.`,
);
