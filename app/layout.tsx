import type { Metadata, Viewport } from "next";
import "./globals.css";
import { contactEmail, siteDescription, siteName, siteUrl } from "../lib/site";
import Script from "next/script";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const viewport: Viewport = {
  themeColor: "#3157e8",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SolveGrid | Free Online Math & Engineering Tools",
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
    apple: "/favicon.ico",
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
  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteName,
        url: siteUrl,
        ...(contactEmail ? { email: contactEmail } : {}),
      },
      {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        inLanguage: "en",
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
      </body>
    </html>
  );
}
