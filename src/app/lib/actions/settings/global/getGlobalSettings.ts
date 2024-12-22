"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { settingsDynamoName } from "@/app/lib/dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "@/app/lib/dynamodb";

const getCachedGlobalSettings = unstable_cache(
  async () => {
    console.log(
      "Fetching global settings from DB at:",
      new Date().toISOString()
    );

    const result = await dynamoDb.send(
      new GetCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL" },
      })
    );

    if (!result.Item) {
      throw new Error("Global settings not found in database");
    }

    return result.Item;
  },
  ["global-settings"],
  {
    revalidate: 680000,
    tags: ["global-settings"],
  }
);

export async function getGlobalSettings() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
    const result = await getCachedGlobalSettings();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to fetch global settings:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch global settings",
    };
  }
}
