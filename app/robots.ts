import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // ?_rsc= URLs are Next.js client-navigation payloads, not pages. They made up about 72% of
        // Googlebot requests in Search Console crawl stats, so keep crawl budget for real pages.
        disallow: ["/api/", "/*?_rsc=", "/*&_rsc="],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
