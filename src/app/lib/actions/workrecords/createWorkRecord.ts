"use server";
import { WorkRecord } from "@/app/types/api";
import { dynamoDb } from "../../dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function createWorkRecord(workRecord: WorkRecord) {
  console.log("Creating work record:", new Date().toISOString());
  const timestamp = new Date().toISOString();
  const yearMonth = workRecord.date.slice(0, 7);
  console.log(yearMonth);

  try {
    const formattedRecord = {
      userId: `USER#${workRecord.userId}#${yearMonth}`,
      date: `${workRecord.type.toUpperCase()}#${workRecord.date}`,
      type: workRecord.type,
      hours: workRecord.hours,
      reason: workRecord.reason,
      yearMonth: yearMonth,
      createdAt: timestamp,
      updatedAt: timestamp,
      approvedBy: workRecord.approvedBy,
    };

    const command = new PutCommand({
      TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
      Item: formattedRecord,
    });

    await dynamoDb.send(command);
  } catch (error: any) {
    console.error("Error creating work record:", error);
    return { success: false, error: error.message };
  }
}
