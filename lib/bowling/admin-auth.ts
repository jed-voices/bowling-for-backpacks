import { cookies } from "next/headers";

export const BOWLING_ADMIN_COOKIE = "bfb_admin";
export const BOWLING_ADMIN_SECRET = process.env.ADMIN_SECRET || "legacy";

export const isAdminSecretConfigured = () => Boolean(BOWLING_ADMIN_SECRET);

export const isBowlingAdminAuthenticated = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(BOWLING_ADMIN_COOKIE)?.value === BOWLING_ADMIN_SECRET;
};
