import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {},
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    DYNAMODB_NAME: process.env.DYNAMODB_NAME,
    VACATION_DYNAMODB_TABLE_NAME: process.env.VACATION_DYNAMODB_TABLE_NAME,
    WORKRECORD_DYNAMODB_TABLE_NAME: process.env.WORKRECORD_DYNAMODB_TABLE_NAME,
    SETTINGS_DYNAMODB_TABLE_NAME: process.env.SETTINGS_DYNAMODB_TABLE_NAME,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    RESEND_API_KEY: process.env.RESEND_API_KEY
  },
};

export default nextConfig;
