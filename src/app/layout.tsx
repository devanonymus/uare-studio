import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Inter,
  Inter_Tight,
} from "next/font/google";
import { PRODUCT } from "@/core/brand/identity";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-uviq-sans",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-uviq-display",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
  ],
  display: "swap",
  variable: "--font-uviq-mono",
});

export const metadata: Metadata = {
  title: {
    default: `${PRODUCT.fullName} | ${PRODUCT.company}`,
    template: `%s | ${PRODUCT.name}`,
  },
  description: PRODUCT.description,
  applicationName: PRODUCT.fullName,
  keywords: [
    "business intelligence",
    "AI audit",
    "digital intelligence",
    "commercial intelligence",
    "multisector analysis",
    "Univibe",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${interTight.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
