"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoDb } from "../../dynamodb";

export async function updateVacationStatus(
  id: string,
  status: "APPROVED" | "REJECTED",
  userId: string
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Key: { id },
        UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":updatedAt": new Date().toISOString(),
        },
      })
    );
    revalidateTag("admin-vacations");
    revalidateTag("vacations");
    revalidateTag(`user-vacations-${userId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update vacation status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
