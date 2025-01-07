"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

async function queryUserWorkRecords(userId: string, yearMonth: string) {
  console.log(
    "Fetching user work records from DB at:",
    new Date().toISOString()
  );

  const command = new QueryCommand({
    TableName: process.env.WORKRECORDS_DYNAMODB_TABLE_NAME!,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `USER#${userId}#${yearMonth}`,
    },
  });

  const result = await dynamoDb.send(command);

  if (!result || !result.Items) {
    throw new Error("Failed to fetch work records");
  }

  return result.Items;
}

export async function getUserMonthlyWorkRecords(
  userId: string,
  yearMonth: string
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const cachedRecords = await unstable_cache(
      () => queryUserWorkRecords(userId, yearMonth),
      [`work-records-${userId}-${yearMonth}`],
      {
        revalidate: 86400,
        tags: [`user-${userId}-records`],
      }
    )();

    return { data: cachedRecords };
  } catch (error: any) {
    console.error("Error fetching work records:", error);
    throw new Error(error.message);
  }
}
