"use server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

async function fetchAdminVacations() {
  console.log("Fetching AdminVacation from DB at:", new Date().toISOString());
  const pendingCommand = new QueryCommand({
    TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    IndexName: "status-index",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": "PENDING",
    },
  });

  const approvedCommand = new QueryCommand({
    TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    IndexName: "status-index",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": "APPROVED",
    },
  });

  const [pendingResult, approvedResult] = await Promise.all([
    dynamoDb.send(pendingCommand),
    dynamoDb.send(approvedCommand),
  ]);

  return [...(pendingResult.Items || []), ...(approvedResult.Items || [])];
}
export const getAdminVacations = unstable_cache(
  fetchAdminVacations,
  ["admin-vacations"],
  {
    revalidate: 36000,
    tags: ["admin-vacations"],
  }
);
