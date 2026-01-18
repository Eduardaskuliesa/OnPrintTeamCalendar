import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

    // Verify the token is valid
    const decoded = await decode({ token, secret: secret! });

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to restore session" }, { status: 500 });
  }
}
