import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

import { site } from "@content/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { asset } from "@/lib/utils";

const fullName = `${site.honorific} ${site.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url.endsWith("/") ? site.url : site.url + "/"),
  title: { default: `${fullName} · ${site.tagline}`, template: `%s · ${fullName}` },
  description: site.description,
  authors: [{ name: fullName }],
  keywords: ["microbiology", "medical mycology", "Candida", "antifungal", "natural products", "antimicrobial resistance", site.name],
  openGraph: {
    type: "website",
    title: fullName,
    description: site.description,
    siteName: fullName,
    images: [{ url: "og.jpg", width: 1200, height: 630, alt: fullName }],
  },
  twitter: { card: "summary_large_image", title: fullName, description: site.description, images: ["og.jpg"] },
  alternates: { types: { "application/rss+xml": "feed.xml" } },
  icons: { icon: asset("/icon.svg") },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  honorificPrefix: site.honorific,
  jobTitle: site.role,
  affiliation: { "@type": "Organization", name: site.institution },
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: site.socials.map((s) => s.href),
  knowsAbout: ["Microbiology", "Medical mycology", "Antifungal drug discovery", "Antimicrobial resistance"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Mark JS-capable browsers before paint so reveal targets start hidden (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body className="grain">
        <SmoothScroll>
          <TransitionProvider>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
