export const siteName = "SolveGrid";

export const siteDescription =
  "Free online math, graphing, engineering, research simulation, finance, and everyday calculation tools for students, educators, engineers, and professionals.";

export const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

// Configure these before public launch. They are intentionally not faked in production pages.
export const siteOperatorName = process.env.NEXT_PUBLIC_SITE_OPERATOR?.trim() || siteName;
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";
