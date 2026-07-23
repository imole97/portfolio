import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { SkinProvider } from "@/components/SkinProvider";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { SeoContent } from "@/components/SeoContent";
import { content } from "@/lib/content";
import { siteUrl, OG_IMAGE, seoKeywords } from "@/lib/site";

// Inter is the cross-device fallback so non-Apple visitors previewing the
// Liquid Glass skin still get the feel. (DESIGN-SYSTEM §4.1 Typography)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Roboto Flex is the native voice of the Material You skin. (DESIGN-SYSTEM §4.2)
const robotoFlex = Roboto_Flex({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const pageTitle = `${content.hero.name} — ${content.hero.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    // Sub-pages (if added later) render as "Section · Imoleayo Adebanjo".
    template: `%s · ${content.hero.name}`,
  },
  description: content.hero.thesis,
  applicationName: `${content.hero.name} · Portfolio`,
  authors: [{ name: content.hero.name, url: siteUrl }],
  creator: content.hero.name,
  publisher: content.hero.name,
  keywords: seoKeywords,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: `${content.hero.name} — Portfolio`,
    title: pageTitle,
    description: content.hero.thesis,
    locale: "en_US",
    images: [{ ...OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: content.hero.thesis,
    images: [OG_IMAGE.url],
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
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Honor safe-area insets on notched devices. (DESIGN-SYSTEM §4.1 iPhone)
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoFlex.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full"
        style={
          {
            // Apple skins use the native SF stack first, Inter as the bundled fallback.
            ["--font-app" as string]:
              '-apple-system, "SF Pro Text", "SF Pro Display", var(--font-inter), system-ui, sans-serif',
          } as React.CSSProperties
        }
      >
        <PersonJsonLd />
        <SeoContent />
        <SkinProvider>{children}</SkinProvider>
      </body>
    </html>
  );
}
