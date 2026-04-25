// top imports unchanged
import { isBowlingAdminAuthenticated } from "@/lib/bowling/admin-auth";
import { redirect } from "next/navigation";

export default async function BowlingAdminPage() {
  const isAuthed = await isBowlingAdminAuthenticated();

  if (!isAuthed) {
    redirect("/bowling-for-backpacks/admin/login");
  }

  const configured = isBowlingDatabaseConfigured();
  const registrations = (await listBowlingRegistrations()) ?? [];

  // rest unchanged
}
