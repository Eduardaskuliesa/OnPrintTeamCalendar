// app/lib/actions/templates/createTemplate.ts
"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Template } from "@/app/types/emailTemplates";
import { getServerSession } from "next-auth";

export interface TemplateData {
  templateName: Template["templateName"];
  jsonUrl: Template["jsonUrl"];
  htmlUrl: Template["htmlUrl"];
}

export async function createTemplate(templateData: TemplateData) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }

    const url = new URL(
      `${process.env.VPS_QUEUE_ENDPOINT}/api/template/create`
    );

    console.log("Server sending templateData:", templateData);

    const response = await fetch(url, {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templateData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          responseData.message ||
          `Error: ${response.status} ${response.statusText}`,
        errorType: responseData.errorType || "SERVER_ERROR",
      };
    }

    return {
      success: true,
      message: "Template created successfully",
      data: responseData.data,
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
