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

    const isYearOnly = yearMonth.length === 4;
    const trueYearMonth = isYearOnly ? yearMonth : yearMonth.slice(0, 7);

    const cachedRecords = await unstable_cache(
      async () => {
        try {
          const command = new QueryCommand({
            TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
            IndexName: isYearOnly ? "year-index" : "yearMonth-index",
            KeyConditionExpression: isYearOnly
              ? "#yr = :yearValue"
              : "yearMonth = :yearValue",
            ExpressionAttributeNames: isYearOnly
              ? {
                  "#yr": "year",
                }
              : undefined,
            ExpressionAttributeValues: {
              ":yearValue": isYearOnly ? yearMonth : trueYearMonth,
            },
            Limit: peekNext ? 1 : 10,
            ExclusiveStartKey: lastEvaluatedKey
              ? JSON.parse(lastEvaluatedKey)
              : undefined,
          });

          const result = await dynamoDb.send(command);

          if (peekNext) {
            return {
              hasMore: result.Items && result.Items.length > 0,
            };
          }

          return {
            data: result.Items,
            lastEvaluatedKey: result.LastEvaluatedKey
              ? JSON.stringify(result.LastEvaluatedKey)
              : undefined,
          };
        } catch (error: any) {
          if (
            error.name === "ValidationException" ||
            error.message.includes("starting key is outside query boundaries")
          ) {
            return peekNext
              ? { hasMore: false }
              : { data: [], lastEvaluatedKey: undefined };
          }
          throw error;
        }
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
