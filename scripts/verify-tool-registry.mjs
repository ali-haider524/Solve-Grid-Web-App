import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const registryPath = path.join(projectRoot, "lib", "tools.ts");
const appPath = path.join(projectRoot, "app");

const source = fs.readFileSync(registryPath, "utf8");
const toolsBlockStart = source.indexOf("export const tools");
const toolsBlockEnd = source.indexOf("export function getToolPath");

if (toolsBlockStart === -1 || toolsBlockEnd === -1) {
  console.error("Could not locate the SolveGrid tool registry in lib/tools.ts.");
  process.exit(1);
}

const toolsBlock = source.slice(toolsBlockStart, toolsBlockEnd);
const registeredSlugs = [...toolsBlock.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
const duplicateSlugs = registeredSlugs.filter((slug, index) => registeredSlugs.indexOf(slug) !== index);

const publicToolDirectories = fs
  .readdirSync(appPath, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => /-(calculator|solver|converter|algebra|lab|analysis|statistics)$/.test(name));

const missingRoutes = registeredSlugs.filter((slug) => !fs.existsSync(path.join(appPath, slug, "page.tsx")));
const missingRegistryEntries = publicToolDirectories.filter((directory) => !registeredSlugs.includes(directory));

const seoContractProblems = [];
for (const slug of registeredSlugs) {
  const pagePath = path.join(appPath, slug, "page.tsx");
  if (!fs.existsSync(pagePath)) continue;

  const pageSource = fs.readFileSync(pagePath, "utf8");
  const expectedMetadata = `createToolMetadata("${slug}")`;
  const expectedSchema = `ToolSchema slug="${slug}"`;
  const expectedLinks = `ToolCrossLinks currentSlug="${slug}"`;

  if (!pageSource.includes(expectedMetadata)) seoContractProblems.push(`${slug}: missing createToolMetadata`);
  if (!pageSource.includes(expectedSchema)) seoContractProblems.push(`${slug}: missing ToolSchema`);
  if (!pageSource.includes(expectedLinks)) seoContractProblems.push(`${slug}: missing ToolCrossLinks`);
}

if (duplicateSlugs.length || missingRoutes.length || missingRegistryEntries.length || seoContractProblems.length) {
  console.error("\nSolveGrid platform verification failed.");

  if (duplicateSlugs.length) {
    console.error(`Duplicate registry slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
  }
  if (missingRoutes.length) {
    console.error(`Registered tools without app routes: ${missingRoutes.join(", ")}`);
  }
  if (missingRegistryEntries.length) {
    console.error(`Public tool routes missing registry entries: ${missingRegistryEntries.join(", ")}`);
  }
  if (seoContractProblems.length) {
    console.error(`SEO route contract problems:\n- ${seoContractProblems.join("\n- ")}`);
  }

  process.exit(1);
}

console.log(
  `SolveGrid platform verified: ${registeredSlugs.length} tools, ${publicToolDirectories.length} public tool routes, and SEO route contracts are connected.`,
);
