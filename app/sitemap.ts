import type { MetadataRoute } from "next";
import { guideSlugs } from "../lib/guides";
import { siteUrl } from "../lib/site";
import { toolCategories, tools, type ToolCategory } from "../lib/tools";

const trustPages = [
  "about",
  "contact",
  "methodology",
  "privacy-policy",
  "terms-of-use",
  "disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tools`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/guides`, changeFrequency: "weekly", priority: 0.84 },
    ...((Object.keys(toolCategories) as ToolCategory[]).map((category) => ({
      url: `${siteUrl}/${toolCategories[category].slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.88,
    }))),
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/${tool.slug}`,
    changeFrequency: "weekly",
    priority: tool.priority,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${siteUrl}/guides/${slug}`,
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  const trustRoutes: MetadataRoute.Sitemap = trustPages.map((slug) => ({
    url: `${siteUrl}/${slug}`,
    changeFrequency: "yearly",
    priority: 0.35,
  }));

  return [...siteRoutes, ...toolRoutes, ...guideRoutes, ...trustRoutes];
}
