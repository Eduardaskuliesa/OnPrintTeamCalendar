"use server";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { revalidateTag } from "next/cache";

export interface QueueTag {
  TagId?: string;
  waitDuration: number;
  tag: string;
  actionConfig: {
    template: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  jobCount?: string;
}

export async function createTag(tagData: QueueTag) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }
    const timestamp = new Date().toISOString();
    const tagId = uuidv4();
    const waitDuration = tagData.waitDuration;
    const tagName = tagData.tag;
    const actionConfig = tagData.actionConfig;
    const isActive = true;
    const createdAt = timestamp;
    const updatedAt = timestamp;
    const jobCount = 0;

    const command = new PutCommand({
      TableName: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
      Item: {
        tagId,
        waitDuration,
        tagName,
        actionConfig,
        isActive,
        jobCount,
        createdAt,
        updatedAt,
      },
      ConditionExpression: "attribute_not_exists(tag)",
    });
    revalidateTag("all-tags");
    await dynamoDb.send(command);
    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error create queueTag:", error);
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("Toks tagas jau egzistuoja");
    }
    throw new Error(error.message);
  }
}
