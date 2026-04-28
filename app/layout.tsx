import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "Christmas in July | Bowling for Backpacks | Bringing Christmas to Students for Back to School",
    template: "%s | City Center",
  },
  description:
    "Register a team, sponsor a lane, or make a gift for Christmas in July | Bowling for Backpacks, City Center's fundraiser bringing Christmas to students for back to school.",
  keywords: [
    "Christmas in July | Bowling for Backpacks",
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
