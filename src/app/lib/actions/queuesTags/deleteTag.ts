"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { revalidateTag } from "next/cache";

export async function deleteTag(tagId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const command = new DeleteCommand({
      TableName: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
      Key: { tagId },
      ConditionExpression: "attribute_exists(tagId)",
    });

    revalidateTag("all-tags");

    await dynamoDb.send(command);

    return {
      success: true,
      message: "Žingsnys buvo ištryntas",
    };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      revalidateTag('all-tags')
      throw new Error("Tokio žyngsio nėra");
    }
    throw new Error(error.message);
  }
}
