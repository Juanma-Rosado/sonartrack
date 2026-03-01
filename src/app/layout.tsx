import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SonarTrack",
  description:
    "SonarTrack - Visualiza tus estadísticas de Spotify con un dashboard minimalista en modo oscuro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-zinc-50`}
      >
        <AppProviders>
          <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
