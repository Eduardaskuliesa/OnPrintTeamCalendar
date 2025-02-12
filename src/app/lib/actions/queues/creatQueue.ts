"use server";

import { revalidateTag } from "next/cache";

interface RequestData {
  email: string;
  tags: {
    tagId: string;
    tagName: string;
    scheduledFor: number;
  }[];
}

export async function createQueue(requestData: RequestData) {
  try {
    console.log(requestData);
    const url = new URL(`http://localhost:3000/api/queue`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    revalidateTag("all-tags");

    return {
      success: response.ok,
      status: response.status,
      data: data,
      message: data.message || response.statusText,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    };
  }
}
