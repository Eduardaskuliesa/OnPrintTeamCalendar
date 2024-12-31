import { dynamoDb, dynamoName } from "@/app/lib/dynamodb";
import { ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const BATCH_SIZE = 25; 

export async function POST() {
  try {
    let lastEvaluatedKey: Record<string, any> | undefined;
    const allUpdates: Promise<any>[] = [];

    do {
      const scanCommand = new ScanCommand({
        TableName: dynamoName || "",
        ProjectionExpression: "userId, vacationDays, updateAmount",
        ExclusiveStartKey: lastEvaluatedKey,
      });

      const response = await dynamoDb.send(scanCommand);

      if (!response || !response.Items) {
        throw new Error("Failed to fetch users");
      }

      for (let i = 0; i < response.Items.length; i += BATCH_SIZE) {
        const batch = response.Items.slice(i, i + BATCH_SIZE);
        const writeRequests = batch
          .filter((user) => user.updateAmount)
          .map((user) => ({
            PutRequest: {
              Item: {
                userId: user.userId,
                vacationDays:
                  (user.vacationDays || 0) + (user.updateAmount || 0),
                updatedAt: new Date().toISOString(),
              },
            },
          }));

        if (writeRequests.length > 0) {
          allUpdates.push(
            dynamoDb.send(
              new BatchWriteCommand({
                RequestItems: {
                  [dynamoName || ""]: writeRequests,
                },
              })
            )
          );
        }
      }

      lastEvaluatedKey = response.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    await Promise.all(allUpdates);

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
