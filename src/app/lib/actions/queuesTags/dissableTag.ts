"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { revalidateTag } from "next/cache";

export async function updateTagStatus(tagId: string, isActive: boolean) {
  try {
    // Check authorization
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get current tag state
    const getCurrentTag = await dynamoDb.send(
      new GetCommand({
        TableName: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
        Key: { tagId },
      })
    );

    if (!getCurrentTag.Item) {
      return {
        success: false,
        error: "Tag not found",
      };
    }

    // First update the tag status
    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
        Key: { tagId },
        UpdateExpression: "SET isActive = :isActive",
        ExpressionAttributeValues: {
          ":isActive": isActive,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    const action = isActive ? "resume" : "pause";
    const url = new URL(`http://localhost:3000/api/queue/${action}/${tagId}`);

    const response = await fetch(url, {
      cache: "no-cache",
      method: "POST",
    });

    const actionResponse = await response.json();

    if (response.ok && actionResponse.success) {
      revalidateTag("all-tags");
      revalidateTag(`tag-${tagId}`);

      return {
        success: true,
        data: result.Attributes,
        actionResponse,
      };
    }

    if (
      !actionResponse.success &&
      !actionResponse.message?.includes("No active jobs found")
    ) {
      await dynamoDb.send(
        new UpdateCommand({
          TableName: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
          Key: { tagId },
          UpdateExpression: "SET isActive = :isActive",
          ExpressionAttributeValues: {
            ":isActive": getCurrentTag.Item?.isActive,
          },
        })
      );

      return {
        success: false,
        error: actionResponse?.message || `Failed to ${action} queues`,
        actionResponse,
      };
    }

    revalidateTag("all-tags");
    revalidateTag(`tag-${tagId}`);

    return {
      success: true,
      data: result.Attributes,
      actionResponse: {
        ...actionResponse,
        message: actionResponse.message || `Successfully updated tag status`,
      },
    };
  } catch (error) {
    console.error("Error updating tag status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
