/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    color?: string;
  }

  interface Session {
    user: {
      role?: string;
      color?: string; // Add this
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    color?: string;
  }
}
