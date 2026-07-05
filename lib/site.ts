export const siteName = "SolveGrid";

export const canonicalProductionUrl = "https://solvegrid.online";

export const siteDescription =
  "Free online math, graphing, engineering, research simulation, finance, and everyday calculation tools for students, educators, engineers, and professionals.";

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
