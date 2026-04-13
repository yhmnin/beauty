import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";
import { ImageResolver } from "@/components/content/ImageResolver";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beauty — Aesthetic Intelligence",
  description:
    "A voice-driven exploration of humanity's finest aesthetic achievements. Discover design, architecture, and craft through conversation.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Beauty",
  },
  openGraph: {
    title: "Beauty — Aesthetic Intelligence",
    description:
      "Discover the stories behind humanity's finest aesthetic achievements through voice conversation.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistMono.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        {/* Noto Sans for CJK fallback (Chinese + Japanese) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Preload KH fonts for fast first paint */}
        <link rel="preload" href="/fonts/KHGiga-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/KHTeka-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <ImageResolver />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
