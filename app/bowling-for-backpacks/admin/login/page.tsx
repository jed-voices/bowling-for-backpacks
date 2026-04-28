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
    <main className="flex min-h-screen items-center justify-center bg-cc-light-blue/35">
      <form action={login} className="ops-card w-full max-w-sm p-8">
        <h1 className="mb-4 font-heading text-2xl font-bold text-cc-dark-blue">Admin Access</h1>
        <input
          name="secret"
          type="password"
          placeholder="Enter admin secret"
          className="ops-field mb-4"
        />
        <button className="ops-primary w-full">Enter</button>
      </form>
    </main>
  );
}
