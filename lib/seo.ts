import type { Metadata } from "next";
import { getTool, getToolPath } from "./tools";
import { siteName, siteUrl } from "./site";

const ogImage = { url: "/og-image.png", width: 1200, height: 630, alt: "SolveGrid statistics calculators for thesis research" };

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
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | ${siteName}`,
      description: tool.description,
      images: [ogImage.url],
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
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
