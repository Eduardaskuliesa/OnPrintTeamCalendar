import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, dynamoName } from "@/app/lib/dynamodb";

const IMPERSONATION_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
const TOKEN_EXPIRY_SECONDS = 30;

// In-memory store for one-time tokens (sufficient for ~10 users)
const usedTokens = new Map<string, number>();

function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, expiry] of usedTokens.entries()) {
    if (now > expiry) {
      usedTokens.delete(token);
    }
  }
}

interface ImpersonationPayload {
  targetUserId: string;
  targetEmail: string;
  targetRole: string;
  adminUserId: string;
  exp: number;
  nonce: string;
}

export async function generateImpersonationToken(targetUserId: string): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const result = await dynamoDb.send(
    new GetCommand({
      TableName: dynamoName,
      Key: { userId: targetUserId },
    })
  );

  if (!result.Item) {
    throw new Error("Target user not found");
  }

  const targetUser = result.Item;
  const now = Math.floor(Date.now() / 1000);

  const payload: ImpersonationPayload = {
    targetUserId: targetUser.userId,
    targetEmail: targetUser.email,
    targetRole: targetUser.role || "USER",
    adminUserId: session.user.userId as string,
    exp: now + TOKEN_EXPIRY_SECONDS,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString).toString("base64url");

  const signature = crypto
    .createHmac("sha256", IMPERSONATION_SECRET!)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

export function verifyImpersonationToken(token: string): ImpersonationPayload | null {
  cleanupExpiredTokens();

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payloadBase64, signature] = parts;

  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", IMPERSONATION_SECRET!)
    .update(payloadBase64)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payloadString = Buffer.from(payloadBase64, "base64url").toString();
    const payload: ImpersonationPayload = JSON.parse(payloadString);

    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      return null;
    }

    if (usedTokens.has(payload.nonce)) {
      return null;
    }

    usedTokens.set(payload.nonce, Date.now() + TOKEN_EXPIRY_SECONDS * 1000 + 60000);

    return payload;
  } catch {
    return null;
  }
}
