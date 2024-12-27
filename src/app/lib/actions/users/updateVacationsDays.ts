"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { dynamoDb } from "@/app/lib/dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function updateUserVacationDays(
  userId: string,
  vacationDays: number
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized: No active session");
    }

    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.DYNAMODB_NAME!,
        Key: { userId },
        UpdateExpression:
          "SET vacationDays = :vacationDays, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":vacationDays": vacationDays,
          ":updatedAt": new Date().toISOString(),
        },
        ConditionExpression: "attribute_exists(userId)",
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-${userId}`);
    revalidateTag("users");

    return {
      success: true,
      message: "Vacation days updated successfully",
      user: result.Attributes,
    };
  } catch (error: any) {
    console.error("Update failed:", error);

    if (error.name === "ConditionalCheckFailedException") {
      return { success: false, error: "User not found" };
    }

    return {
      success: false,
      error: error.message || "Failed to update vacation days",
    };
  }
}
