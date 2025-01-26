"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { unstable_cache } from "next/cache";

async function fetchCustomBirthDaysByUser(userId: string) {
  console.log(`Fetching customBrithDays`, new Date().toISOString());

  try {
    const command = new QueryCommand({
      TableName: process.env.CUSTOM_BIRTHDAYS_TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });
    const result = await dynamoDb.send(command);
    return {
      data: result.Items,
    };
  } catch (error) {
    console.error("Error in fetchCustomBirthDaysByUser:", error);
    throw error;
  }
}

export async function getAllCustomBirthDaysByUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const cachedRecords = await unstable_cache(
      () => fetchCustomBirthDaysByUser(userId),
      [`birthdays`, userId],
      {
        revalidate: 86400,
        tags: [`user-${userId}-birthdays`],
      }
    )();

    return {
      success: true,
      data: cachedRecords.data,
    };
  } catch (error) {
    console.error("Error in getAllCustomBirthDaysByUser:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch birthdays",
    };
  }
}
