import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { SkinProvider } from "@/components/SkinProvider";
import { content } from "@/lib/content";

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

export const metadata: Metadata = {
  title: `${content.hero.name} — ${content.hero.role}`,
  description: content.hero.thesis,
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
        <SkinProvider>{children}</SkinProvider>
      </body>
    </html>
  );
}
