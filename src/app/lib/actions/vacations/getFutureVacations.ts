"use server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/app/lib/dynamodb";

export async function getFutureVacations(date: Date) {
  console.log(
    "Fetching future vacations from DB at:",
    new Date().toISOString()
  );

  const pendingCommand = new QueryCommand({
    TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    IndexName: "status-index",
    KeyConditionExpression: "#status = :status",
    FilterExpression: "#startDate >= :date",
    ExpressionAttributeNames: {
      "#status": "status",
      "#startDate": "startDate",
    },
    ExpressionAttributeValues: {
      ":status": "PENDING",
      ":date": date.toISOString().split("T")[0],
    },
  });

  const approvedCommand = new QueryCommand({
    TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    IndexName: "status-index",
    KeyConditionExpression: "#status = :status",
    FilterExpression: "#startDate >= :date",
    ExpressionAttributeNames: {
      "#status": "status",
      "#startDate": "startDate",
    },
    ExpressionAttributeValues: {
      ":status": "APPROVED",
      ":date": date.toISOString().split("T")[0],
    },
  });

  const [pendingResult, approvedResult] = await Promise.all([
    dynamoDb.send(pendingCommand),
    dynamoDb.send(approvedCommand),
  ]);

  return [...(pendingResult.Items || []), ...(approvedResult.Items || [])];
}
