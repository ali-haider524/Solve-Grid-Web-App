export const siteName = "SolveGrid";

export const canonicalProductionUrl = "https://solvegrid.online";

export const siteDescription =
  "Free statistics calculators for thesis and survey research — sample size, Cronbach's alpha, Likert analysis, t-tests, ANOVA — plus supporting math and numerical-methods tools.";

function normalizeSiteUrl(value: string) {
  try {
    return new URL(value).origin.replace(/\/+$/, "");
  } catch {
    return canonicalProductionUrl;
  }
}

/*
  Local development keeps local URLs for easy testing. Production builds and
  deployments default to solvegrid.online unless SITE_URL is explicitly set.
*/
const fallbackSiteUrl =
  process.env.NODE_ENV === "production"
    ? canonicalProductionUrl
    : "http://localhost:3000";

export const siteUrl = normalizeSiteUrl(
  process.env.SITE_URL?.trim() || fallbackSiteUrl,
);

// Configure these before public launch. They are intentionally not faked.
export const siteOperatorName =
  process.env.NEXT_PUBLIC_SITE_OPERATOR?.trim() || siteName;
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";

// The person who builds and maintains SolveGrid (shown on the About page and in structured data).
export const siteAuthor = {
  name: "Talha",
  jobTitle: "Software Engineer and Web Developer",
  description:
    "Software engineer and web developer with experience in SEO, web development, project management, and e-commerce. Builds and maintains SolveGrid's calculators and guides.",
  knowsAbout: ["Software engineering", "Web development", "Search engine optimisation", "Project management", "E-commerce", "Research statistics tools"],
};

/*
  Google AdSense. Set NEXT_PUBLIC_ADSENSE_CLIENT to the publisher ID from the
  AdSense dashboard (format ca-pub-1234567890123456). When it is empty, no ad
  code, verification tag, or ads.txt entry is output.
*/
const rawAdsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "";
export const adsenseClient = /^ca-pub-\d{10,20}$/.test(rawAdsenseClient) ? rawAdsenseClient : "";
export const adsensePublisherId = adsenseClient.replace(/^ca-/, "");


function normalizePublicUrl(value: string) {
  if (!value.trim()) return "";

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString().replace(/\/+$/, "")
      : "";
  } catch {
    return "";
  }
}

export const githubUrl = normalizePublicUrl(
  process.env.NEXT_PUBLIC_GITHUB_URL || "",
);
export const linkedinUrl = normalizePublicUrl(
  process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
);
export const youtubeUrl = normalizePublicUrl(
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
);

export const socialProfiles = [githubUrl, linkedinUrl, youtubeUrl].filter(
  Boolean,
);
