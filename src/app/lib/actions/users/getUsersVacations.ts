"use server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";
import { Vacation } from "@/app/types/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function getUserVacations(userId: string) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.userId !== userId)
  ) {
    throw new Error("Unauthorized");
  }

  return unstable_cache(
    async () => {
      console.log(
        "Fetching user vacations from DB at:",
        new Date().toISOString()
      );

      const command = new QueryCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      });

      const result = await dynamoDb.send(command);
      return { data: (result.Items as Vacation[]) || [] };
    },
    [`user-vacations-${userId}`],
    {
      revalidate: 604800, // 1 week
      tags: [`user-vacations-${userId}`],
    }
  )();
}
