import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BIS-SpecAI | AI Standards Recommendation Engine (SIH 2026)",
  description: "AI-Powered Technical Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications - Smart India Hackathon 2026 Problem Statement #26108",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable} antialiased`}>
      <body className="min-h-screen bg-[#FFF4D6] text-[#231A14] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
