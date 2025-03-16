"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Template } from "@/app/types/emailTemplates";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { s3client } from "../../s3bucket";
import { revalidateTag } from "next/cache";

export async function deleteTemplate(
  id: Template["id"],
  templateName: Template["templateName"]
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }

    const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/template/${id}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message,
      };
    }
    const htmlFilename = `${templateName}.html`;
    const jsonFilename = `${templateName}.json`;
    const s3KeyHtml = `templates/${templateName}/${htmlFilename}`;
    const s3KeyJson = `templates/${templateName}/${jsonFilename}`;

    const commandHtml = new DeleteObjectCommand({
      Bucket: process.env.S3_TEMPLATE_BUCKET_NAME,
      Key: s3KeyHtml,
    });

    const commandJson = new DeleteObjectCommand({
      Bucket: process.env.S3_TEMPLATE_BUCKET_NAME,
      Key: s3KeyJson,
    });

    await Promise.all([s3client.send(commandHtml), s3client.send(commandJson)]);
    revalidateTag("templates");
    return {
      success: true,
      message: "Template delete successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      errorType: "UNEXPECTED_ERROR",
    };
  }
}
