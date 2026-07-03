export const siteName = "SolveGrid";

export const siteDescription =
  "Free online math, graphing, equation, and engineering tools for students, educators, and professionals.";

export const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);
