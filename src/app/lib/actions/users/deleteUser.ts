"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoName } from "../../dynamodb";
import { dynamoDb } from "../../dynamodb";

export async function deleteUser(email: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const command = new DeleteCommand({
      TableName: dynamoName,
      Key: { email },
      ConditionExpression: "attribute_exists(email)",
    });

    await dynamoDb.send(command);
    revalidateTag("users");
    return { message: "User deleted successfully" };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("User not found");
    }
    throw new Error(error.message);
  }
}
