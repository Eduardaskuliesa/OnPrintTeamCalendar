"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

export async function getAllMonthlyWorkRecords(
  yearMonth: string,
  lastEvaluatedKey?: string,
  peekNext: boolean = false
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const trueYearMonth = yearMonth.slice(0, 7);

    const cachedRecords = await unstable_cache(
      async () => {
        const command = new QueryCommand({
          TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
          IndexName: "yearMonth-index",
          KeyConditionExpression: "yearMonth = :yearMonth",
          ExpressionAttributeValues: {
            ":yearMonth": trueYearMonth,
          },
          Limit: peekNext ? 1 : 10, // If peeking, just get 1 record
          ExclusiveStartKey: lastEvaluatedKey
            ? JSON.parse(lastEvaluatedKey)
            : undefined,
        });

        const result = await dynamoDb.send(command);

        // If we're peeking, just return whether there are any items
        if (peekNext) {
          return {
            hasMore: result.Items && result.Items.length > 0,
          };
        }

        // If not peeking, return normal response
        return {
          data: result.Items,
          lastEvaluatedKey: result.LastEvaluatedKey
            ? JSON.stringify(result.LastEvaluatedKey)
            : undefined,
        };
      },
      [
        `work-records-${trueYearMonth}-${lastEvaluatedKey || "initial"}${
          peekNext ? "-peek" : ""
        }`,
      ],
      {
        revalidate: 86400,
        tags: [`monthly-records-${trueYearMonth}`],
      }
    )();

    return cachedRecords;
  } catch (error: any) {
    console.error("Error fetching monthly records:", error);
    throw new Error(error.message);
  }
}
