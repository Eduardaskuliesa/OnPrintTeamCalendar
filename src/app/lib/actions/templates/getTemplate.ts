"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Template } from "@/app/types/emailTemplates";
import { getServerSession } from "next-auth";

export async function getTemplate(id: Template["id"]) {
  console.log(` Fetching Template ${id} from DB :`, new Date().toISOString());
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
      cache: "no-cache",
      method: "GET",
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
