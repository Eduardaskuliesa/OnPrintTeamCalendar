"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function deleteTag(tagId: number) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const url = new URL(`${process.env.NEXT_PUBLIC_VPS_QUEUE_ENDPOINT}/api/tag/${tagId}`);

  const response = await fetch(url, {
    cache: "no-cache",
    method: "DELETE",
  });

  if (!response.ok) {
    return {
      success: false,
      message: response.json(),
    };
  }

  revalidateTag("all-tags");

  return {
    success: true,
    message: response.json(),
  };
}
