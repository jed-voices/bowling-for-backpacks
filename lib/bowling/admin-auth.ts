import { cookies } from "next/headers";

export const BOWLING_ADMIN_COOKIE = "bfb_admin";

export const isAdminSecretConfigured = () => Boolean(process.env.ADMIN_SECRET);

export const isBowlingAdminAuthenticated = async () => {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(BOWLING_ADMIN_COOKIE)?.value === secret;
};
