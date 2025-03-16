"use server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../../s3bucket";

export interface EmailTemplateRetrieveResponse {
    html: string;
    jsonData: string;
    name: string;
}

export const getEmailTemplate = async (templateName: string): Promise<EmailTemplateRetrieveResponse> => {
    const bucketName = process.env.S3_TEMPLATE_BUCKET_NAME;
    if (!bucketName) {
        throw new Error("S3_TEMPLATE_BUCKET_NAME environment variable is not set");
    }

    const htmlFilename = `${templateName}.html`;
    const jsonFilename = `${templateName}.json`;
    const s3KeyHtml = `templates/${templateName}/${htmlFilename}`;
    const s3KeyJson = `templates/${templateName}/${jsonFilename}`;

    try {
        const htmlCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: s3KeyHtml,
        });

        const jsonCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: s3KeyJson,
        });

        const [htmlResponse, jsonResponse] = await Promise.all([
            s3client.send(htmlCommand),
            s3client.send(jsonCommand)
        ]);

        if (!htmlResponse.Body || !jsonResponse.Body) {
            throw new Error("Failed to retrieve template: Response body is undefined");
        }


        const htmlBody = await htmlResponse.Body.transformToString();
        const jsonBody = await jsonResponse.Body.transformToString();

        return {
            html: htmlBody,
            jsonData: jsonBody,
            name: templateName
        };
    } catch (error) {
        console.error("Error retrieving email template:", error);
        throw new Error(`Failed to retrieve template "${templateName}": ${error}`);
    }
};