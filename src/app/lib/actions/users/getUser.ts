"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoName } from "../../dynamodb";
import { dynamoDb } from "../../dynamodb";

async function fetchUserFromDb(userId: string) {
  console.log("Fetching single user from DB at:", new Date().toISOString());

  const result = await dynamoDb.send(
    new GetCommand({
      TableName: dynamoName,
      Key: { userId },
      ProjectionExpression:
        "email, #name, #role, color, createdAt, updatedAt, useGlobal",
      ExpressionAttributeNames: {
        "#name": "name",
        "#role": "role",
      },
    })
  );

  if (!result.Item) {
    throw new Error("User not found");
  }

  return result.Item;
}

const getCachedUser = (userId: string) =>
  unstable_cache(() => fetchUserFromDb(userId), [`user-${userId}`], {
    revalidate: 604800,
    tags: [`user-${userId}`],
  });

export async function getUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const result = await getCachedUser(userId)();
  return { data: result };
}
