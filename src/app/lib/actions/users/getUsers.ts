/* eslint-disable react-hooks/rules-of-hooks */
"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoName } from "../../dynamodb";
import { dynamoDb } from "../../dynamodb";

async function queryUsers() {
  console.log("Fetching all Users:", new Date().toISOString());

  const getAllUsers = new ScanCommand({
    TableName: dynamoName || "",
  });

  const response = await dynamoDb.send(getAllUsers);

  if (!response || !response.Items) {
    throw new Error("Failed to fetch users");
  }

  return response.Items;
}

async function getUserCacheKey() {
  const session = await getServerSession(authOptions);
  return `users-${session?.user?.email}-${session?.user?.role}`;
}

export async function getUsers() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const cacheKey = await getUserCacheKey();

    const cachedUsers = await unstable_cache(queryUsers, [cacheKey], {
      revalidate: 604800,
      tags: ["users"],
    })();

    return { data: cachedUsers };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
}
