import { AuthOptions}  from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { QueryCommand } from "@aws-sdk/lib-dynamodb"; // We only need QueryCommand now
import { dynamoDb } from "@/app/lib/dynamodb";
import bcrypt from "bcryptjs";

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
          const queryCommand = new QueryCommand({
            TableName: process.env.DYNAMODB_NAME || "",
            IndexName: "email-index",
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
              ":email": credentials.email,
            },
          });

          const queryResult = await dynamoDb.send(queryCommand);
          const user = queryResult.Items?.[0];

          if (
            !user ||
            !(await bcrypt.compare(credentials.password, user.password))
          ) {
            return null;
          }

          return {
            id: user.userId,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
};
