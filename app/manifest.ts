import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SolveGrid",
    short_name: "SolveGrid",
    description: "Free online math, graphing, engineering, and everyday calculators.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fc",
    theme_color: "#3157e8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
