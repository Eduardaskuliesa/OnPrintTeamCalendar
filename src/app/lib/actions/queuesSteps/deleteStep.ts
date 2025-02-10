"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { revalidateTag } from "next/cache";

export async function deleteStep(stepId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    console.log(stepId);

    const command = new DeleteCommand({
      TableName: process.env.QUEUE_STEP_DYNAMODB_TABLE_NAME,
      Key: { stepId },
      ConditionExpression: "attribute_exists(stepId)",
    });

    revalidateTag("all-steps");

    await dynamoDb.send(command);

    return {
      success: true,
      message: "Žingsnys buvo ištryntas",
    };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("Tokio žyngsio nėra");
    }
    throw new Error(error.message);
  }
}
