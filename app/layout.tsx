import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "Bowling for Backpacks | Bringing Christmas to Students for Back to School",
    template: "%s | City Center",
  },
  description:
    "Register a team, sponsor a lane, or make a gift for Bowling for Backpacks, City Center's Christmas in July fundraiser bringing Christmas to students for back to school.",
  keywords: [
    "Bowling for Backpacks",
    "bringing Christmas to students for back to school",
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
    "City Center back to school bash",
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
