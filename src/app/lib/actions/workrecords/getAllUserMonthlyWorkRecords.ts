"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

async function queryUserMonthlyWorkRecords(userId: string, yearMonth: string) {
  const command = new QueryCommand({
    TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
    KeyConditionExpression:
      "userId = :userId AND begins_with(#date, :yearMonth)",
    ExpressionAttributeNames: {
      "#date": "date",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
      ":yearMonth": yearMonth,
    },
  });

  console.log("🔵 Executing fresh fetch:", new Date().toISOString());
  const result = await dynamoDb.send(command);

  return {
    data: result.Items,
  };
}

export async function getAllUserMonthlyWorkRecords(
  userId: string,
  yearMonth: string
) {
  try {
    const session = await getServerSession(authOptions);
    console.log(yearMonth)
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const cachedRecords = await unstable_cache(
      () => queryUserMonthlyWorkRecords(userId, yearMonth),
      [`work-records-${userId}-${yearMonth}`],
      {
        revalidate: 86400,
        tags: [`user-${userId}-records`],
      }
    )();
    return cachedRecords;
  } catch (error: any) {
    console.error("Error fetching user records:", error);
    throw new Error(error.message);
  }
}
