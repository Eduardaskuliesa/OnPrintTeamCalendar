"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

async function fetchTagsFromDb() {
  console.log("Fetching all tag from DB at:", new Date().toISOString());
  const url = new URL(`http://localhost:3000/api/tags`);

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

const getCachedTags = () =>
  unstable_cache(() => fetchTagsFromDb(), ["all-tag"], {
    revalidate: 1,
    tags: ["all-tags"],
  });

export async function getTags() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await getCachedTags()();
  return { data: result };
}
