import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/app/lib/dynamodb";
import bcrypt from "bcryptjs";
import { revalidateTag } from "next/cache";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const command = new GetCommand({
            TableName: process.env.DYNAMODB_NAME || "",
            Key: { email: credentials.email },
          });

          const user = (await dynamoDb.send(command)).Item;

          if (
            !user ||
            !(await bcrypt.compare(credentials.password, user.password))
          ) {
            return null;
          }

          return {
            id: user.email,
            email: user.email,
            name: user.name,
            role: user.role,
            color: user.color,
            gapDays: user.gapDays,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.color = user.color;
        token.gapDays = user.gapDays;
        return token;
      }
      if (trigger === "update") {
        try {
          console.log("Updating token data after user update");
          const command = new GetCommand({
            TableName: process.env.DYNAMODB_NAME || "",
            Key: { email: token.email },
          });

          const freshUser = (await dynamoDb.send(command)).Item;
          if (freshUser) {
            console.log(freshUser);
            return {
              ...token,
              name: freshUser.name,
              role: freshUser.role,
              color: freshUser.color,
              gapDays: freshUser.gapDays,
            };
          }
          revalidateTag("users");
        } catch (error) {
          console.error("Error refreshing user data in JWT:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.color = token.color;
        session.user.gapDays = token.gapDays;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
};
