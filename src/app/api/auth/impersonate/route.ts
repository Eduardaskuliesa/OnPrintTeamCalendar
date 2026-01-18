import { NextRequest, NextResponse } from "next/server";
import { verifyImpersonationToken } from "@/app/lib/impersonation";
import { encode } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", request.url));
  }

  const payload = verifyImpersonationToken(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", request.url));
  }

  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  const jwtPayload = {
    userId: payload.targetUserId,
    email: payload.targetEmail,
    role: payload.targetRole,
    impersonatedBy: payload.adminUserId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  };

  const sessionToken = await encode({
    token: jwtPayload,
    secret: secret!,
  });

  const redirectUrl = payload.targetRole === "ADMIN" ? "/admin" : "/account";

  const response = NextResponse.redirect(new URL(redirectUrl, request.url));

  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  response.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
