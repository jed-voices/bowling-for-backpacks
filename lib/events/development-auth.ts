import { cookies } from "next/headers";
import { createHash } from "node:crypto";

export const DEVELOPMENT_AUTH_COOKIE = "cc_events_development";
export const LOCAL_DEVELOPMENT_USERNAME = "development";
export const LOCAL_DEVELOPMENT_PASSWORD = "citycenter@77";

const getCurrentDevelopmentPassword = () =>
  process.env.DEVELOPMENT_ADMIN_PASSWORD ||
  process.env.DEVELOPMENT_ADMIN_SECRET ||
  (process.env.NODE_ENV !== "production" ? LOCAL_DEVELOPMENT_PASSWORD : "");

const getScheduledDevelopmentPassword = (currentPassword: string) => {
  const nextPassword = process.env.DEVELOPMENT_ADMIN_NEXT_PASSWORD;
  const switchAt = process.env.DEVELOPMENT_ADMIN_PASSWORD_SWITCH_AT;

  if (!nextPassword || !switchAt) {
    return currentPassword;
  }

  const switchTime = Date.parse(switchAt);

  if (Number.isNaN(switchTime) || Date.now() < switchTime) {
    return currentPassword;
  }

  return nextPassword;
};

export const getDevelopmentCredentials = () => {
  const username =
    process.env.DEVELOPMENT_ADMIN_USERNAME ||
    LOCAL_DEVELOPMENT_USERNAME;
  const password = getScheduledDevelopmentPassword(getCurrentDevelopmentPassword());

  return { username, password };
};

export const getDevelopmentSessionValue = () => {
  const { username, password } = getDevelopmentCredentials();

  if (!username || !password) {
    return "";
  }

  return createHash("sha256")
    .update(`${username}:${password}`)
    .digest("hex");
};

export const isUsingLocalDevelopmentCredentials = () =>
  !process.env.DEVELOPMENT_ADMIN_USERNAME &&
  !process.env.DEVELOPMENT_ADMIN_PASSWORD &&
  !process.env.DEVELOPMENT_ADMIN_SECRET &&
  !process.env.DEVELOPMENT_ADMIN_NEXT_PASSWORD &&
  !process.env.DEVELOPMENT_ADMIN_PASSWORD_SWITCH_AT &&
  process.env.NODE_ENV !== "production";

export const isDevelopmentAuthConfigured = () =>
  Boolean(getDevelopmentCredentials().username && getDevelopmentCredentials().password);

const normalizeUsername = (username: string) => username.trim().toLowerCase();

const normalizePassword = (password: string) => password.trim();

export const isValidDevelopmentLogin = (username: string, password: string) => {
  const configuredCredentials = getDevelopmentCredentials();

  return (
    Boolean(getDevelopmentSessionValue()) &&
    normalizeUsername(username) === normalizeUsername(configuredCredentials.username) &&
    normalizePassword(password) === configuredCredentials.password
  );
};

export const isDevelopmentAuthenticated = async () => {
  const sessionValue = getDevelopmentSessionValue();

  if (!sessionValue) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(DEVELOPMENT_AUTH_COOKIE)?.value === sessionValue;
};

export const signInDevelopmentUser = async (username: string, password: string) => {
  const sessionValue = getDevelopmentSessionValue();

  if (!sessionValue || !isValidDevelopmentLogin(username, password)) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(DEVELOPMENT_AUTH_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return true;
};

export const signOutDevelopmentUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(DEVELOPMENT_AUTH_COOKIE);
};
