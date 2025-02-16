"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export interface QueueTag {
  tagName: string;
  scheduledFor: number;
}

export async function createTag(tagData: QueueTag) {
  try {
    console.log('Fires')
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }
    console.log(tagData);
    const url = new URL(`http://localhost:3000/api/tag`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tagData),
    });

    const data = await response.json();

    revalidateTag("all-tags");

    return {
      success: response.ok,
      status: response.status,
      data: data,
      message: data.message || response.statusText,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    };
  }
}
