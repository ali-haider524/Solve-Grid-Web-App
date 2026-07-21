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
  "lib/tools.ts",
  "lib/guides.ts",
  "app/layout.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "components/SiteFooter.tsx",
  "components/ToolHeader.tsx",
  "components/ToolCategoryHub.tsx",
  "components/ToolCrossLinks.tsx",
  "components/GuideArticle.tsx",
  "app/tools/page.tsx",
  "app/guides/page.tsx",
  "app/math-calculators/page.tsx",
  "app/engineering-calculators/page.tsx",
  "app/research-tools/page.tsx",
  "app/everyday-calculators/page.tsx",
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
    problems.push(
      ".env.example must document solvegrid.online as the production SITE_URL.",
    );
  }
  if (!environmentExample.includes("GOOGLE_SITE_VERIFICATION")) {
    problems.push(".env.example is missing GOOGLE_SITE_VERIFICATION.");
  }
}

if (
  exists("lib/site.ts") &&
  !read("lib/site.ts").includes("https://solvegrid.online")
) {
  problems.push("lib/site.ts is missing the canonical solvegrid.online fallback.");
}

if (exists("app/robots.ts")) {
  const robots = read("app/robots.ts");
  if (!robots.includes("/sitemap.xml")) {
    problems.push("robots.ts must advertise /sitemap.xml.");
  }
  if (!robots.includes('allow: "/"')) {
    problems.push("robots.ts must allow the public site to be crawled.");
  }
}

if (exists("app/sitemap.ts")) {
  const sitemap = read("app/sitemap.ts");
  for (const requiredSource of [
    "guideSlugs",
    "toolCategories",
    "tools",
    "trustPages",
  ]) {
    if (!sitemap.includes(requiredSource)) {
      problems.push(`sitemap.ts is missing registry source ${requiredSource}.`);
    }
  }
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
  if (!footer.includes('href: "/guides"')) {
    problems.push("Site footer must link to the calculation guide directory.");
  }
}

const registeredGuideSlugs = [];
if (exists("lib/guides.ts")) {
  const guidesSource = read("lib/guides.ts");
  registeredGuideSlugs.push(
    ...[...guidesSource.matchAll(/slug:\s*"([^"]+)"/g)].map(
      (match) => match[1],
    ),
  );

  const duplicates = registeredGuideSlugs.filter(
    (slug, index) => registeredGuideSlugs.indexOf(slug) !== index,
  );
  if (duplicates.length) {
    problems.push(
      `Duplicate guide registry slugs: ${[...new Set(duplicates)].join(", ")}`,
    );
  }

  for (const slug of registeredGuideSlugs) {
    const guidePath = `app/guides/${slug}/page.tsx`;
    if (!exists(guidePath)) {
      problems.push(`Guide registry entry has no route: /guides/${slug}`);
      continue;
    }

    const guideSource = read(guidePath);
    if (!guideSource.includes("metadata")) {
      problems.push(`Guide route is missing page metadata: /guides/${slug}`);
    }
    if (!guideSource.includes("GuideArticle")) {
      problems.push(`Guide route is not connected to GuideArticle: /guides/${slug}`);
    }
  }
}

const guideRoot = path.join(root, "app", "guides");
if (fs.existsSync(guideRoot)) {
  const routeSlugs = fs
    .readdirSync(guideRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(guideRoot, slug, "page.tsx")));

  for (const slug of routeSlugs) {
    if (!registeredGuideSlugs.includes(slug)) {
      problems.push(`Guide route is missing from lib/guides.ts: /guides/${slug}`);
    }
  }

  const nestedGuideRoutes = [];
  const walk = (directory, depth = 0) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath, depth + 1);
      if (entry.isFile() && entry.name === "page.tsx" && depth > 1) {
        nestedGuideRoutes.push(path.relative(root, fullPath));
      }
    }
  };
  walk(guideRoot);

  if (nestedGuideRoutes.length) {
    problems.push(
      `Unexpected nested guide routes: ${nestedGuideRoutes.join(", ")}`,
    );
  }
}

if (exists("app/favicon.ico.png")) {
  problems.push(
    "Remove app/favicon.ico.png; keep app/favicon.ico and app/icon.png as the canonical icon files.",
  );
}

if (problems.length) {
  console.error("\nSolveGrid launch-readiness verification failed.");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(
  "SolveGrid launch readiness verified: canonical domain, sitemap, robots, category hubs, trust pages, footer links, and guide routes are connected.",
);
