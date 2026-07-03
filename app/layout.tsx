import type { Metadata } from "next";
import "./globals.css";
import { siteDescription, siteName, siteUrl } from "../lib/site";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SolveGrid | Free Online Math & Engineering Tools",
    template: "%s | SolveGrid",
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName,
    title: "SolveGrid | Free Online Math & Engineering Tools",
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "SolveGrid | Free Online Math & Engineering Tools",
    description: siteDescription,
  },
  verification: googleVerification
    ? {
        google: googleVerification,
      }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
