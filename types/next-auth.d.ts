/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
    role?: string;
  }

  interface Session {
    user: {
      id?: string;
      userId?: string;
      email?: string;
      role?: string;
      impersonatedBy?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    userId?: string;
    email?: string;
    role?: string;
    impersonatedBy?: string;
  }
}
