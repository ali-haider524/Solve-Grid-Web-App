import type { Metadata } from "next";
import { getTool, getToolPath } from "./tools";
import { siteName, siteUrl } from "./site";

export function createToolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  const canonicalPath = getToolPath(tool);

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      title: `${tool.title} | ${siteName}`,
      description: tool.description,
      url: canonicalPath,
    },
    twitter: {
      card: "summary",
      title: `${tool.title} | ${siteName}`,
      description: tool.description,
    },
    other: {
      "application-name": siteName,
      "x-solvegrid-url": `${siteUrl}${canonicalPath}`,
    },
  };
}


export function createStaticPageMetadata(
  title: string,
  description: string,
  canonicalPath: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      title: `${title} | ${siteName}`,
      description,
      url: canonicalPath,
    },
    twitter: {
      card: "summary",
      title: `${title} | ${siteName}`,
      description,
    },
  };
}
