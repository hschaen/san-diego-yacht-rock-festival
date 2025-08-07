import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "San Diego Yacht Rock Festival 2025 | Liberty Station",
  description: "San Diego's Premier Yacht Rock Festival - October 11, 2025 at Liberty Station. Experience smooth sounds with Yacht Rock Revue, Christopher Cross, and more!",
  keywords: "yacht rock, festival, san diego, liberty station, concert, music, 2025",
  openGraph: {
    title: "San Diego Yacht Rock Festival 2025",
    description: "Join us for smooth sounds at Liberty Station on October 11, 2025",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
