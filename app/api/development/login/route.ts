import { NextResponse, type NextRequest } from "next/server";
import {
  DEVELOPMENT_AUTH_COOKIE,
  getDevelopmentSessionValue,
  isValidDevelopmentLogin,
} from "@/lib/events/development-auth";

const developmentUrl = (request: NextRequest, path: string) => {
  const host = request.headers.get("host") ?? request.nextUrl.host;
  return new URL(path, `${request.nextUrl.protocol}//${host}`);
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!isValidDevelopmentLogin(username, password)) {
    return NextResponse.redirect(developmentUrl(request, "/development?error=1"), {
      status: 303,
    });
  }

  const response = NextResponse.redirect(developmentUrl(request, "/development"), {
    status: 303,
  });

  response.cookies.set(DEVELOPMENT_AUTH_COOKIE, getDevelopmentSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
