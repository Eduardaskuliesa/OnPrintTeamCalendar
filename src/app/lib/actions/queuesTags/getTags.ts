"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

async function fetchTagsFromDb() {
  console.log("Fetching all tag from DB at:", new Date().toISOString());

  const result = await dynamoDb.send(
    new ScanCommand({
      TableName: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
    })
  );

  if (!result.Items) {
    return [];
  }

  return result.Items;
}

const getCachedTags = () =>
  unstable_cache(() => fetchTagsFromDb(), ["all-tag"], {
    revalidate: 3600,
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
