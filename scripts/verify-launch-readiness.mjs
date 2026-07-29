import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function requireFile(relativePath) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    errors.push(`Required launch file is missing: ${relativePath}`);
  }
}

for (const relativePath of [
  "app/layout.tsx",
  "app/page.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "app/guides/page.tsx",
  "components/GuideArticle.tsx",
  "components/SiteFooter.tsx",
  "lib/guides.ts",
  "lib/seo.ts",
  "lib/site.ts",
  "public/llms.txt",
]) {
  requireFile(relativePath);
}

const guidesFile = path.join(root, "lib", "guides.ts");
if (fs.existsSync(guidesFile)) {
  const source = fs.readFileSync(guidesFile, "utf8");
  const slugs = [...source.matchAll(/\bslug:\s*"([a-z0-9-]+)"/g)].map(
    (match) => match[1],
  );
  const uniqueSlugs = new Set(slugs);

  if (uniqueSlugs.size !== slugs.length) {
    errors.push("Duplicate guide slugs were found in lib/guides.ts.");
  }

  for (const slug of uniqueSlugs) {
    const route = path.join(root, "app", "guides", slug, "page.tsx");
    if (!fs.existsSync(route)) {
      errors.push(`Guide registry entry has no route: /guides/${slug}`);
    }
  }

  const guidesRoot = path.join(root, "app", "guides");
  if (fs.existsSync(guidesRoot)) {
    for (const directoryEntry of fs.readdirSync(guidesRoot, {
      withFileTypes: true,
    })) {
      if (!directoryEntry.isDirectory()) continue;
      const folder = path.join(guidesRoot, directoryEntry.name);
      const page = path.join(folder, "page.tsx");
      if (!fs.existsSync(page)) {
        errors.push(`Guide folder has no page.tsx: ${directoryEntry.name}`);
      }

      for (const child of fs.readdirSync(folder, { withFileTypes: true })) {
        if (child.isDirectory()) {
          errors.push(
            `Unexpected nested guide folder: /guides/${directoryEntry.name}/${child.name}`,
          );
        }
      }
    }
  }
}

if (errors.length) {
  console.error("SolveGrid launch-readiness verification failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "SolveGrid launch readiness verified: routes, metadata foundations, guides, sitemap, robots, footer, and llms.txt are connected.",
);
