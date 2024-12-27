"use server";

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

export interface Vacation {
  id: string;
  userId: string;
  userName: string;
  startDate: string;
  userEmail: string;
  endDate: string;
  userColor: string;
  totalVacationDays: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

async function fetchUserVacations(userId: string): Promise<Vacation[]> {
  const command = new QueryCommand({
    TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  try {
    const result = await dynamoDb.send(command);
    return (result.Items as Vacation[]) || [];
  } catch (error) {
    console.error("Error querying vacations:", error);
    return [];
  }
}

// Create a cached version of fetchUserVacations
const getCachedUserVacations = (userId: string) =>
  unstable_cache(
    () => fetchUserVacations(userId),
    [`user-vacations-${userId}`],
    {
      revalidate: 604800, // 1 week
      tags: [`user-vacations-${userId}`],
    }
  );

export async function getUserVacations(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userId) {
    throw new Error("Unauthorized: No user session");
  }

  // Ensure only admins or the user themselves can fetch their vacations
  if (session.user.role !== "ADMIN" && session.user.userId !== userId) {
    throw new Error("Unauthorized: Insufficient permissions");
  }

  try {
    const cachedFetch = getCachedUserVacations(userId);
    const vacations = await cachedFetch();
    return { data: vacations };
  } catch (error) {
    console.error("Error fetching user vacations:", error);
    throw new Error("Failed to fetch vacations");
  }
}
