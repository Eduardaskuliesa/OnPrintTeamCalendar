"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoName, dynamoDb } from "../../dynamodb";

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

export async function getUsers() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "USER") {
      throw new Error("Unauthorized");
    }

    const cachedUsers = await unstable_cache(queryUsers, ["all-users"], {
      revalidate: 3600,
      tags: ["users"],
    })();

    return { data: cachedUsers };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
}
