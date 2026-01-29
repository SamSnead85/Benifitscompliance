import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Synapse | AI-Native Benefits Compliance",
  description: "Autonomous ACA compliance platform powered by AI agents. Replace expensive service models with lean, intelligent automation.",
  keywords: ["ACA compliance", "benefits administration", "AI automation", "1095-C", "1094-C", "healthcare compliance"],
  authors: [{ name: "Synapse" }],
  openGraph: {
    title: "Synapse | AI-Native Benefits Compliance",
    description: "The future of ACA compliance. 90% lower cost. Real-time validation. Superior accuracy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {/* Atmospheric Background System */}
          <div className="atmosphere" aria-hidden="true" />
          <div className="noise-overlay" aria-hidden="true" />

          {/* Main Content */}
          <main className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
