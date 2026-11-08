import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // A stray pnpm-lock.yaml in the user folder made Next.js pick the wrong workspace root.
  // Pin the root to this project (npm scripts always run from the project folder).
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  // The build ran 11 page workers at once and Windows ran out of memory ("Zone Allocation failed").
  // Two workers is plenty for ~85 static pages.
  experimental: { cpus: 2 },
  devIndicators: false,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      // Retired hub: the everyday/finance tools were removed in the research-statistics refocus.
      { source: "/everyday-calculators", destination: "/research-statistics", permanent: true },
      // Retired lab (folder deleted): duplicated the dedicated t-test, ANOVA and correlation calculators (keyword cannibalization).
      { source: "/advanced-statistics", destination: "/statistical-test-chooser", permanent: true },
      { source: "/advanced-statistics/:path*", destination: "/statistical-test-chooser", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
