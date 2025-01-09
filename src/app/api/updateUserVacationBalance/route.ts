import { dynamoDb, dynamoName } from "@/app/lib/dynamodb";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

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

    const userIds = response.Items.map((user) => user.userId);
    const updatePromises = response.Items.map(async (user) => {
      if (!user.updateAmount) return;
      const newVacationDays =
        (user.vacationDays || 0) + (user.updateAmount || 0);

      return dynamoDb.send(
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
    });

    await Promise.all(updatePromises);
    revalidatePath("/account");
    revalidatePath("/admin");

    console.log("Starting revalidation for all users");
    await Promise.all(
      userIds.map(async (userId) => {
        console.log(`Revalidating user-${userId}`);
        await revalidateTag(`user-${userId}`);
      })
    );

    console.log("Revalidating users tag");
    await revalidateTag("users");

    console.log("Waiting for propagation");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Propagation delay completed");

    return NextResponse.json({
      success: true,
      message: "Successfully updated vacation days for all users",
      revalidated: true,
      userCount: userIds.length,
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
