"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

async function fetchTagsFromDb() {
  console.log("Fetching all tag from DB at:", new Date().toISOString());
  console.log("endpoint: ", process.env.NEXT_PUBLIC_VPS_QUEUE_ENDPOINT);
  const url = new URL(`${process.env.NEXT_PUBLIC_VPS_QUEUE_ENDPOINT}/api/tags`);

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

export async function getTags() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await fetchTagsFromDb();
  return { data: result };
}
