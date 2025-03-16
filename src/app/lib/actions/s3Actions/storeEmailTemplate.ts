"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../../s3bucket";

export interface EmailTemplateData {
    name: string;
    html: string;
    jsonData: string;
}

export const storeEmailTemplate = async (
    templateData: EmailTemplateData,
) => {
    const htmlFilename = `${templateData.name}.html`;
    const jsonFilename = `${templateData.name}.json`;

    const s3KeyHtml = `templates/${templateData.name}/${htmlFilename}`;
    const s3KeyJson = `templates/${templateData.name}/${jsonFilename}`;
    console.log('bucketName:', process.env.S3_TEMPLATE_BUCKET_NAME)
    const htmlCommand = new PutObjectCommand({
        Bucket: process.env.S3_TEMPLATE_BUCKET_NAME,
        Key: s3KeyHtml,
        Body: templateData.html,
        ContentType: "text/html",
    });

    const jsonCommand = new PutObjectCommand({
        Bucket: process.env.S3_TEMPLATE_BUCKET_NAME,
        Key: s3KeyJson,
        Body: templateData.jsonData,
        ContentType: "application/json",
    });

    await Promise.all([
        s3client.send(htmlCommand),
        s3client.send(jsonCommand)
    ]);

    const baseUrl = `https://${process.env.S3_TEMPLATE_BUCKET_NAME}.s3.amazonaws.com`;
    const htmlUrl = `${baseUrl}/${s3KeyHtml}`;
    const jsonUrl = `${baseUrl}/${s3KeyJson}`;

    return {
        htmlUrl,
        jsonUrl
    };
};