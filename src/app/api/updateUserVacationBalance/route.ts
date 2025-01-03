import { dynamoDb, dynamoName } from "@/app/lib/dynamodb";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST() {
  try {
    const getAllUsers = new ScanCommand({
      TableName: dynamoName || "",
      ProjectionExpression: "userId, vacationDays, updateAmount",
    });

    const response = await dynamoDb.send(getAllUsers);

    if (!response || !response.Items) {
      throw new Error("Failed to fetch users");
    }

    const updatePromises = response.Items.map(async (user) => {
      if (!user.updateAmount) return;
      const newVacationDays =
        (user.vacationDays || 0) + (user.updateAmount || 0);

      const result = await dynamoDb.send(
        new UpdateCommand({
          TableName: dynamoName || "",
          Key: { userId: user.userId },
          UpdateExpression:
            "SET vacationDays = :vacationDays, updatedAt = :updatedAt",
          ExpressionAttributeValues: {
            ":vacationDays": newVacationDays,
            ":updatedAt": new Date().toISOString(),
          },
          ReturnValues: "ALL_NEW",
        })
      );

      revalidateTag(`user-${user.userId}`);
      return result;
    });

    await Promise.all(updatePromises);
    revalidateTag("users");

    return NextResponse.json({
      success: true,
      message: "Successfully updated vacation days for all users",
    });
  } catch (error) {
    console.error("Error updating vacation days:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update vacation days",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
