/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    color?: string;
    gapDays?: number;
  }

  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
      color?: string;
      gapDays?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    color?: string;
    gapDays?: number;
  }
}
