import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import {
  adsenseClient,
  contactEmail,
  siteDescription,
  siteName,
  siteAuthor,
  siteOperatorName,
  siteUrl,
  socialProfiles,
} from "../lib/site";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const viewport: Viewport = {
  themeColor: "#3157e8",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SolveGrid | Free Statistics Calculators for Thesis & Survey Research",
    template: "%s | SolveGrid",
  },
  description: siteDescription,
  applicationName: siteName,
  category: "Education",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
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
    locale: "en_US",
    siteName,
    title: "SolveGrid | Free Statistics Calculators for Thesis & Survey Research",
    description: siteDescription,
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SolveGrid statistics calculators for thesis research" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
    title: "SolveGrid | Free Statistics Calculators for Thesis & Survey Research",
    description: siteDescription,
  },
  verification: googleVerification
    ? {
        google: googleVerification,
      }
    : undefined,
  other: adsenseClient ? { "google-adsense-account": adsenseClient } : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  const authorId = `${siteUrl}/about#author`;

  const authorSchema = {
    "@type": "Person",
    "@id": authorId,
    name: siteAuthor.name,
    jobTitle: siteAuthor.jobTitle,
    description: siteAuthor.description,
    knowsAbout: siteAuthor.knowsAbout,
    url: `${siteUrl}/about`,
    worksFor: { "@id": organizationId },
  };

  const organizationSchema = {
    "@type": "Organization",
    "@id": organizationId,
    founder: { "@id": authorId },
    name: siteOperatorName,
    alternateName: ["Solve Grid", "solvegrid.online"],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/icon.png`,
    },
    description: siteDescription,
    ...(contactEmail
      ? {
          email: contactEmail,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: contactEmail,
            url: `${siteUrl}/contact`,
            availableLanguage: ["English"],
          },
        }
      : {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "website support",
            url: `${siteUrl}/contact`,
            availableLanguage: ["English"],
          },
        }),
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
  };

  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      authorSchema,
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        alternateName: ["Solve Grid", "solvegrid.online", "SolveGrid Statistics Calculators"],
        url: siteUrl,
        description: siteDescription,
        inLanguage: "en",
        publisher: { "@id": organizationId },
        isAccessibleForFree: true,
      },
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QDSPD4TGQN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QDSPD4TGQN');
          `}
        </Script>
        {adsenseClient ? (
          <Script
            async
            crossOrigin="anonymous"
            id="google-adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
