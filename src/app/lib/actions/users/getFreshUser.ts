"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoName } from "../../dynamodb";
import { dynamoDb } from "../../dynamodb";

export async function getFreshUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const result = await dynamoDb.send(
    new GetCommand({
      TableName: dynamoName,
      Key: { userId },
    })
  );

  if (!result.Item) {
    throw new Error("User not found");
  }

  return { data: result.Item };
}
