"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

async function fetchTagFromDb(tagId: number) {
  console.log("Fetching tag from DB at:", new Date().toISOString());
  const url = new URL(`http://localhost:3000/api/tag/${tagId}`);

  const response = await fetch(url, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message,
    };
  }

  return data;
}

const getCachedTag = (tagId: number) =>
  unstable_cache(() => fetchTagFromDb(tagId), [`tag-${tagId}`], {
    revalidate: 10,
    tags: [`tag-${tagId}`],
  });

export async function getTag(tagId: number) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await getCachedTag(tagId)();
  return { data: result };
}
