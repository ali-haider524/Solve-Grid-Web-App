import type { MetadataRoute } from "next";
import { guideSlugs } from "../lib/guides";
import { lastUpdated } from "../lib/content-dates";
import { siteUrl } from "../lib/site";
import { toolCategories, tools, type ToolCategory } from "../lib/tools";

const trustPages = [
  "about",
  "contact",
  "methodology",
  "validation",
  "privacy-policy",
  "terms-of-use",
  "disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = (key: string) => ({ lastModified: new Date(lastUpdated(key)) });

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      ...updated(""),
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${siteUrl}/tools`, ...updated("tools"), changeFrequency: "weekly", priority: 0.96 },
    { url: `${siteUrl}/guides`, ...updated("guides"), changeFrequency: "weekly", priority: 0.9 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = (
    Object.keys(toolCategories) as ToolCategory[]
  ).map((category) => ({
    url: `${siteUrl}/${toolCategories[category].slug}`,
    ...updated(toolCategories[category].slug),
    changeFrequency: "weekly",
    priority: category === "math" || category === "engineering" ? 0.92 : 0.88,
  }));


  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/${tool.slug}`,
    ...updated(tool.slug),
    changeFrequency: "weekly",
    priority: tool.priority,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${siteUrl}/guides/${slug}`,
    ...updated(`guides/${slug}`),
    changeFrequency: "monthly",
    priority: slug === "choose-a-statistical-test" ? 0.9 : 0.76,
  }));

  const trustRoutes: MetadataRoute.Sitemap = trustPages.map((slug) => ({
    url: `${siteUrl}/${slug}`,
    ...updated(slug),
    changeFrequency: "yearly",
    priority: slug === "methodology" || slug === "about" ? 0.5 : 0.35,
  }));

  const routes = [
    ...coreRoutes,
    ...categoryRoutes,
    ...toolRoutes,
    ...guideRoutes,
    ...trustRoutes,
  ];

  return routes.filter(
    (route, index) => routes.findIndex((item) => item.url === route.url) === index,
  );
}
