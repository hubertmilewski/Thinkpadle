import type { Metadata } from "next";
import { siteContent } from "@/data/content";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const ibmPlex = IBM_Plex_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex",
});

const baseUrl = "https://thinkpadle.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteContent.header.title} | ${siteContent.header.subtitle}`,
    template: `%s | ${siteContent.header.title}`,
  },
  description: siteContent.metadata.description,
  keywords: [...siteContent.metadata.keywords],
  authors: [{ name: siteContent.metadata.author }],
  
  openGraph: {
    title: siteContent.header.title,
    description: siteContent.metadata.description,
    url: baseUrl,
    siteName: siteContent.header.title,
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Thinkpadle - Daily ThinkPad Guessing Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: siteContent.header.title,
    description: siteContent.metadata.description,
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ibmPlex.variable} antialiased font-sans`}>
        {children}
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}