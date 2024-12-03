import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['main.d386b7ro7362a6.amplifyapp.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    DYNAMODB_NAME: process.env.DYNAMODB_NAME,
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    VACATION_DYNAMODB_TABLE_NAME: process.env.VACATION_DYNAMODB_TABLE_NAME,
    SALT_ROUNDS: process.env.SALT_ROUNDS
  }
};

export default nextConfig;