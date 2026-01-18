"use server";

import { generateImpersonationToken } from "@/app/lib/impersonation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { encode } from "next-auth/jwt";

export async function createImpersonationUrl(targetUserId: string): Promise<string> {
  const token = await generateImpersonationToken(targetUserId);

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return `${baseUrl}/api/auth/impersonate?token=${encodeURIComponent(token)}`;
}

export async function getCurrentSessionToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  const token = await encode({
    token: {
      userId: session.user.userId,
      email: session.user.email,
      role: session.user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    },
    secret: secret!,
  });

  return token;
}
