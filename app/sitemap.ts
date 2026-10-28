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
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date("2026-10-28"),
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${siteUrl}/tools`, changeFrequency: "weekly", priority: 0.96 },
    { url: `${siteUrl}/guides`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = (
    Object.keys(toolCategories) as ToolCategory[]
  ).map((category) => ({
    url: `${siteUrl}/${toolCategories[category].slug}`,
    changeFrequency: "weekly",
    priority: category === "math" || category === "engineering" ? 0.92 : 0.88,
  }));

  // Update a slug's date here whenever its content changes, so crawlers see real freshness.
  const contentUpdated: Record<string, string> = {
    "statistical-test-chooser": "2026-10-28",
    "sample-size-calculator": "2026-10-28",
    "cronbach-alpha-calculator": "2026-10-28",
    "likert-scale-calculator": "2026-10-28",
    "chi-square-calculator": "2026-10-28",
    "mann-whitney-u-test-calculator": "2026-10-28",
    "shapiro-wilk-test-calculator": "2026-10-28",
    "cohens-kappa-calculator": "2026-10-28",
    "effect-size-calculator": "2026-10-28",
    "wilcoxon-signed-rank-test-calculator": "2026-10-28",
    "kruskal-wallis-test-calculator": "2026-10-28",
    "intraclass-correlation-calculator": "2026-10-28",
    "sobel-test-calculator": "2026-10-28",
    "t-test-calculator": "2026-10-28",
    "one-way-anova-calculator": "2026-10-28",
    "correlation-calculator": "2026-10-28",
    "linear-regression-calculator": "2026-10-28",
    "friedman-test-calculator": "2026-10-28",
    "mcnemar-test-calculator": "2026-10-28",
    "guides/how-to-report-chi-square-apa": "2026-10-28",
    "guides/how-to-report-regression-apa": "2026-10-28",
    "guides/how-to-report-correlation-apa": "2026-10-28",
    "statistics-calculator": "2026-10-28",
    "advanced-statistics": "2026-10-28",
    "guides/choose-a-statistical-test": "2026-10-28",
    "guides/slovin-formula-sample-size": "2026-10-28",
    "guides/likert-scale-interpretation": "2026-10-28",
    "guides/how-to-report-anova-apa": "2026-10-28",
    "guides/how-to-report-t-test-apa": "2026-10-28",
    "guides/standard-deviation-formula": "2026-10-28",
  };
  const updated = (key: string) =>
    contentUpdated[key] ? { lastModified: new Date(contentUpdated[key]) } : {};

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
    ...(slug === "about" || slug === "contact" || slug === "methodology"
      ? { lastModified: new Date("2026-07-30") }
      : {}),
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
