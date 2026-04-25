import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BOWLING_ADMIN_COOKIE } from "@/lib/bowling/admin-auth";

export default function AdminLoginPage() {
  async function login(formData: FormData) {
    "use server";

    const secret = formData.get("secret");

    if (secret === process.env.ADMIN_SECRET) {
      const cookieStore = await cookies();
      cookieStore.set(BOWLING_ADMIN_COOKIE, String(secret), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });

      redirect("/bowling-for-backpacks/admin");
    }

    redirect("/bowling-for-backpacks/admin/login?error=1");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bfb-cream">
      <form action={login} className="bg-white p-8 shadow-soft rounded-sm w-full max-w-sm">
        <h1 className="font-heading text-2xl font-black mb-4">Admin Access</h1>
        <input
          name="secret"
          type="password"
          placeholder="Enter admin secret"
          className="w-full border p-3 mb-4"
        />
        <button className="bfb-primary w-full">Enter</button>
      </form>
    </main>
  );
}
