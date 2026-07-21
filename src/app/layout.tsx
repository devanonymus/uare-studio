import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PRODUCT } from "@/core/brand/identity";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
    <html lang="it" data-scroll-behavior="smooth">
      <body
        className={`${geist.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
