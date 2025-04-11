import { SESClient } from "@aws-sdk/client-ses";

const client = new SESClient({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.REGION,
});

export const sesClient = client;
