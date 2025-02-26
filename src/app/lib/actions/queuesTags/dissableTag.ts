"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";


export async function updateTagStatus(tagId: number, isActive: boolean) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/tag/${tagId}`);

    const response = await fetch(url, {
      cache: "no-cache",
      method: "POST",
      body: JSON.stringify(isActive),
    });

    const actionResponse = await response.json();

    if (response.ok && actionResponse.success) {
      revalidateTag("all-tags");
      revalidateTag(`tag-${tagId}`);

      return {
        success: true,
        actionResponse,
      };
    }

    revalidateTag("all-tags");
    revalidateTag(`tag-${tagId}`);

    return {
      success: true,
      data: actionResponse.data,
      actionResponse: {
        ...actionResponse,
        message: actionResponse.message || `Successfully updated tag status`,
      },
    };
  } catch (error) {
    console.error("Error updating tag status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
