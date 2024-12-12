"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoName } from "../../dynamodb";
import { dynamoDb } from "../../dynamodb";

async function fetchUserFromDb(email: string) {
  console.log("Fetching single user from DB at:", new Date().toISOString());

  const result = await dynamoDb.send(
    new GetCommand({
      TableName: dynamoName,
      Key: { email },
      ProjectionExpression:
        "email, #name, #role, color, gapDays, createdAt, updatedAt, useGlobalSettings",
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

const getCachedUser = (email: string) =>
  unstable_cache(() => fetchUserFromDb(email), [`user-${email}`], {
    revalidate: 604800,
    tags: [`user-${email}`],
  });

export async function getUser(email: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.email !== email) {
    throw new Error("Unauthorized");
  }

  const result = await getCachedUser(email)();
  return { data: result };
}
