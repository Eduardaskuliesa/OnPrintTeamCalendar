/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { settingsDynamoName } from "@/app/lib/dynamodb";
import { GlobalSettings } from "@/app/types/bookSettings";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoDb } from "@/app/lib/dynamodb";

export async function updateGlobalSettings(settings: Partial<GlobalSettings>) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL_SETTINGS" },
        UpdateExpression: "SET settings = :settings, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":settings": settings,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update global settings:", error);
    return { success: false, error: error.message };
  }
}
