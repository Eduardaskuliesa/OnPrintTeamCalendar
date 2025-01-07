"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

async function queryMonthlyWorkRecords(yearMonth: string) {
  console.log("Fetching all work records for month:", yearMonth);

  const command = new QueryCommand({
    TableName: process.env.WORKRECORDS_DYNAMODB_TABLE_NAME!,
    IndexName: "yearMonth-index",
    KeyConditionExpression: "yearMonth = :yearMonth",
    ExpressionAttributeValues: {
      ":yearMonth": yearMonth,
    },
  });

  const result = await dynamoDb.send(command);

  if (!result || !result.Items) {
    throw new Error("Failed to fetch monthly records");
  }

  return result.Items;
}

export async function getAllMonthlyWorkRecords(yearMonth: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const cachedRecords = await unstable_cache(
      () => queryMonthlyWorkRecords(yearMonth),
      [`all-work-records-${yearMonth}`],
      {
        revalidate: 86400,
        tags: [`monthly-records-${yearMonth}`],
      }
    )();

    return { data: cachedRecords };
  } catch (error: any) {
    console.error("Error fetching monthly records:", error);
    throw new Error(error.message);
  }
}
