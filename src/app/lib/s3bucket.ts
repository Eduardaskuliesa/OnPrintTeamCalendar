import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_BUKCET_KEY_ID!,
        secretAccessKey: process.env.S3_BUKCET_ACCESS_KEY!,
    },
    region: process.env.REGION
});

export const s3client = client;
export const bucketName = process.env.S3_BUCKET_NAME;