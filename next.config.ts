import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {},
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    S3_BUKCET_KEY_ID: process.env.S3_BUKCET_KEY_ID,
    S3_BUKCET_ACCESS_KEY: process.env.S3_BUKCET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    DYNAMODB_NAME: process.env.DYNAMODB_NAME,
    VACATION_DYNAMODB_TABLE_NAME: process.env.VACATION_DYNAMODB_TABLE_NAME,
    WORKRECORD_DYNAMODB_TABLE_NAME: process.env.WORKRECORD_DYNAMODB_TABLE_NAME,
    SETTINGS_DYNAMODB_TABLE_NAME: process.env.SETTINGS_DYNAMODB_TABLE_NAME,
    CUSTOM_BIRTHDAYS_TABLE_NAME: process.env.CUSTOM_BIRTHDAYS_TABLE_NAME,
    CUSTOM_DAYS_TABLE_NAME: process.env.CUSTOM_DAYS_TABLE_NAME,
    QUEUE_TAG_DYNAMODB_TABLE_NAME: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    REVALIDATE_SECRET_QUEUES: process.env.REVALIDATE_SECRET_QUEUES,
    VPS_QUEUE_ENDPOIN: process.env.VPS_QUEUE_ENDPOIN,
  },
};

export default nextConfig;
