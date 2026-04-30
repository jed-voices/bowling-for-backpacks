import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Bowling Admin Dashboard",
};

export default function LegacyBowlingAdminPage() {
  redirect("/admin/bowling-for-backpacks");
}
