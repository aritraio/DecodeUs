import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SwissHeader } from "@/components/layout/swiss-header";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DecodeUs // Conversation Intelligence",
  description:
    "Analyze patterns, not people. Privacy-first WhatsApp conversation intelligence. Zero raw chat storage.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="bg-white text-black antialiased">
        <NoiseOverlay />
        <SwissHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
