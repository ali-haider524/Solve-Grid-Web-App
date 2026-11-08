import type { MetadataRoute } from "next";
import { guides, type GuideTopic } from "../lib/guides";
import { lastUpdated } from "../lib/content-dates";
import { siteUrl } from "../lib/site";
import { getToolsByCategory, toolCategories, type ToolCategory } from "../lib/tools";

// The sitemap is written in "table of contents" order so it mirrors the site hierarchy:
//   1. Home
//   2. Each section hub, followed straight away by the calculators in that section
//   3. The guides index, followed by guides grouped by topic
//   4. Trust and legal pages
// Priority falls one step per level (home > hub > page > trust). Every URL appears once.

const sectionOrder: ToolCategory[] = ["statistics", "math", "engineering", "research"];
const guideTopicOrder: GuideTopic[] = ["statistics", "algebra", "graphing", "engineering", "research"];

const trustPages = [
  "about",
  "methodology",
  "validation",
  "contact",
  "privacy-policy",
  "terms-of-use",
  "disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    key: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" | "yearly",
  ): MetadataRoute.Sitemap[number] => ({
    url: path ? `${siteUrl}/${path}` : siteUrl,
    lastModified: new Date(lastUpdated(key)),
    changeFrequency,
    priority,
  });

  const routes: MetadataRoute.Sitemap = [entry("", "", 1, "weekly"), entry("tools", "tools", 0.9, "weekly")];

  for (const category of sectionOrder) {
    const hub = toolCategories[category].slug;
    routes.push(entry(hub, hub, category === "statistics" ? 0.95 : 0.85, "weekly"));
    const sectionTools = [...getToolsByCategory(category)].sort((a, b) => b.priority - a.priority);
    for (const tool of sectionTools) {
      routes.push(entry(tool.slug, tool.slug, category === "statistics" ? 0.8 : 0.7, "monthly"));
    }
  }

  routes.push(entry("guides", "guides", 0.85, "weekly"));
  for (const topic of guideTopicOrder) {
    for (const guide of guides.filter((item) => item.topic === topic)) {
      routes.push(
        entry(`guides/${guide.slug}`, `guides/${guide.slug}`, topic === "statistics" ? 0.7 : 0.6, "monthly"),
      );
    }
  }

  for (const slug of trustPages) {
    routes.push(entry(slug, slug, slug === "methodology" || slug === "validation" ? 0.5 : 0.3, "yearly"));
  }

  return routes.filter((route, index) => routes.findIndex((item) => item.url === route.url) === index);
}
