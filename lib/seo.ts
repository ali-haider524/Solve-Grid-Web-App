import type { Metadata } from "next";
import { getTool, getToolPath } from "./tools";
import { siteName, siteUrl } from "./site";

const sharedMetadata: Pick<Metadata, "authors" | "creator" | "publisher"> = {
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
};

export function createToolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  const canonicalPath = getToolPath(tool);

  return {
    ...sharedMetadata,
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_US",
      title: `${tool.title} | ${siteName}`,
      description: tool.description,
      url: canonicalPath,
    },
    twitter: {
      card: "summary",
      title: `${tool.title} | ${siteName}`,
      description: tool.description,
    },
    robots: {
      index: true,
      follow: true,
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
    ...sharedMetadata,
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_US",
      title: `${title} | ${siteName}`,
      description,
      url: canonicalPath,
    },
    twitter: {
      card: "summary",
      title: `${title} | ${siteName}`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
