import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "OK City Center Events | Event Registration and Sponsorships",
    template: "%s | City Center",
  },
  description:
    "Find City Center event opportunities, register, sponsor, give, and support the work of relief and restoration in Oklahoma City.",
  keywords: [
    "OK City Center Events",
    "City Center events",
    "Christmas in July: Bowling for Backpacks",
    "Bowling for Backpacks",
    "bringing Christmas to students for Back 2 School",
    "Christmas in July Oklahoma City",
    "Christmas in July fundraiser OKC",
    "City Center Oklahoma City",
    "City Center OKC",
    "Oklahoma City back to school fundraiser",
    "OKC charity bowling event",
    "Oklahoma City nonprofit fundraiser",
    "sponsor a lane Oklahoma City",
    "backpacks for students OKC",
    "school supplies fundraiser Oklahoma City",
    "support youth and families Oklahoma City",
    "City Center Back 2 School Bash",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
