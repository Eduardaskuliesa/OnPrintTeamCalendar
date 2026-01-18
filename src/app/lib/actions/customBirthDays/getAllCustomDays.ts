"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { unstable_cache } from "next/cache";

async function fetchAllCustomDays() {
  console.log(`Fetching all customDays`, new Date().toISOString());

  try {
    const command = new ScanCommand({
      TableName: process.env.CUSTOM_DAYS_TABLE_NAME,
    });

    const result = await dynamoDb.send(command);
    console.log(result);
    return {
      data: result.Items,
    };
  } catch (error) {
    console.error("Error in fetchAllCustomDays:", error);
    throw error;
  }
}

export async function getAllCustomDays() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const ONE_MONTH = 30 * 24 * 60 * 60;

    const cachedRecords = await unstable_cache(
      () => fetchAllCustomDays(),
      ["all-customDays"],
      {
        revalidate: ONE_MONTH,
        tags: [`all-customDays`],
      }
    )();

    return {
      success: true,
      data: cachedRecords.data,
    };
  } catch (error) {
    console.error("Error in getAllCustomDays:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch customDays",
    };
  }
}
