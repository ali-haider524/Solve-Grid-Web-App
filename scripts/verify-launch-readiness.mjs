import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

const problems = [];
const requiredFiles = [
  ".env.example",
  "lib/site.ts",
  "app/layout.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "components/SiteFooter.tsx",
  "components/ToolHeader.tsx",
  "app/about/page.tsx",
  "app/contact/page.tsx",
  "app/methodology/page.tsx",
  "app/privacy-policy/page.tsx",
  "app/terms-of-use/page.tsx",
  "app/disclaimer/page.tsx",
  "app/not-found.tsx",
];

for (const relativePath of requiredFiles) {
  if (!exists(relativePath)) {
    problems.push(`Missing required launch file: ${relativePath}`);
  }
}

if (exists(".env.example")) {
  const environmentExample = read(".env.example");
  if (!environmentExample.includes("SITE_URL=https://solvegrid.online")) {
    problems.push(".env.example must document solvegrid.online as the production SITE_URL.");
  }
  if (!environmentExample.includes("GOOGLE_SITE_VERIFICATION")) {
    problems.push(".env.example is missing GOOGLE_SITE_VERIFICATION.");
  }
}

if (exists("lib/site.ts") && !read("lib/site.ts").includes("https://solvegrid.online")) {
  problems.push("lib/site.ts is missing the canonical solvegrid.online fallback.");
}

if (exists("app/robots.ts")) {
  const robots = read("app/robots.ts");
  if (!robots.includes("/sitemap.xml")) {
    problems.push("robots.ts must advertise /sitemap.xml.");
  }
}

if (exists("app/sitemap.ts")) {
  const sitemap = read("app/sitemap.ts");
  for (const requiredRoute of ["/tools", "/guides", "methodology"]) {
    if (!sitemap.includes(requiredRoute)) {
      problems.push(`sitemap.ts is missing ${requiredRoute}.`);
    }
  }
}

if (exists("components/SiteFooter.tsx")) {
  const footer = read("components/SiteFooter.tsx");
  for (const trustLink of [
    "/about",
    "/contact",
    "/methodology",
    "/privacy-policy",
    "/terms-of-use",
    "/disclaimer",
  ]) {
    if (!footer.includes(`href: "${trustLink}"`)) {
      problems.push(`Site footer is missing trust link ${trustLink}.`);
    }
  }
}

if (exists("lib/guides.ts")) {
  const guidesSource = read("lib/guides.ts");
  const guideSlugs = [
    ...guidesSource.matchAll(/slug:\s*"([^"]+)"/g),
  ].map((match) => match[1]);

  for (const slug of guideSlugs) {
    const guidePath = `app/guides/${slug}/page.tsx`;
    if (!exists(guidePath)) {
      problems.push(`Guide registry entry has no route: /guides/${slug}`);
      continue;
    }

    if (!read(guidePath).includes("metadata")) {
      problems.push(`Guide route is missing page metadata: /guides/${slug}`);
    }
  }
}

if (problems.length) {
  console.error("\nSolveGrid launch-readiness verification failed.");
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log(
  "SolveGrid launch readiness verified: canonical domain, trust pages, sitemap, robots, footer links, and guide routes are connected.",
);
