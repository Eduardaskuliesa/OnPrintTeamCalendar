"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

export async function getTemplates() {
  console.log(` Fetching Templates from DB :`, new Date().toISOString());
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }

    const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/template`);

    const response = await fetch(url, {
      next: {
        revalidate: 300,
        tags: ["templates"],
      },
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
      message: "",
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
