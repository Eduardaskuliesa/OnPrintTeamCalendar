import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/app/lib/dynamodb";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
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
        console.log(user);
        return {
          id: user.email,
          email: user.email,
          name: user.name,
          role: user.role,
          color: user.color
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.color = user.color
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.color = token.color;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',    
    signOut: '/login',   
    error: '/login', 
  },
};
