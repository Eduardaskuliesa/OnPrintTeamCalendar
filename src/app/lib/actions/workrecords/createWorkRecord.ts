"use server";
import { WorkRecord } from "@/app/types/api";
import { dynamoDb } from "../../dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function createWorkRecord(workRecord: WorkRecord) {
  console.log("Creating work record:", new Date().toISOString());
  const timestamp = new Date().toISOString();
  const yearMonth = workRecord.date.slice(0, 10);
  const trueYearMonth = yearMonth.slice(0, 7);
  const year = workRecord.date.slice(0, 4)

  try {
    const formattedRecord = {
      userId: workRecord.userId,
      date: `${workRecord.date}#${timestamp}`,
      type: workRecord.type,
      time: workRecord.time,
      reason: workRecord.reason,
      yearMonth: trueYearMonth,
      createdAt: timestamp,
      updatedAt: timestamp,
      approvedBy: workRecord.approvedBy,
    };

    const command = new PutCommand({
      TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
      Item: formattedRecord,
    });
    revalidateTag(`user-${workRecord.userId}-records`);
    revalidateTag(`monthly-records-${trueYearMonth}`);
    revalidateTag(`monthly-records-${yearMonth}`);
    revalidateTag(`monthly-records-${year}`);


    await dynamoDb.send(command);
  } catch (error: any) {
    console.error("Error creating work record:", error);
    return { success: false, error: error.message };
  }
}
