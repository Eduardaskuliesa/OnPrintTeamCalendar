"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

export async function getUserMonthlyWorkRecords(
  userId: string,
  yearMonth: string,
  lastEvaluatedKey?: string,
  peekNext: boolean = false
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const trueYearMonth = yearMonth.slice(0, 7);

    const cachedRecords = await unstable_cache(
      async () => {
        const command = new QueryCommand({
          TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
          KeyConditionExpression:
            "userId = :userId AND begins_with(#date, :year)",
          ExpressionAttributeNames: {
            "#date": "date",
          },
          ExpressionAttributeValues: {
            ":userId": userId,
            ":year": trueYearMonth,
          },
          Limit: peekNext ? 1 : 10,
          ScanIndexForward: false,
          ...(lastEvaluatedKey &&
            lastEvaluatedKey !== "null" && {
              ExclusiveStartKey: JSON.parse(lastEvaluatedKey),
            }),
        });

        try {
          const result = await dynamoDb.send(command);

          if (peekNext) {
            return { hasMore: result.Items && result.Items.length > 0 };
          }

          return {
            data: result.Items || [],
            lastEvaluatedKey: result.LastEvaluatedKey
              ? JSON.stringify(result.LastEvaluatedKey)
              : null,
          };
        } catch (error: any) {
          // Only return empty results if we hit the validation error
          if (error.name === "ValidationException") {
            return peekNext
              ? { hasMore: false }
              : { data: [], lastEvaluatedKey: null };
          }
          throw error;
        }
      },
      [
        `work-records-${userId}-${trueYearMonth}-${
          lastEvaluatedKey || "initial"
        }${peekNext ? "-peek" : ""}`,
      ],
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
