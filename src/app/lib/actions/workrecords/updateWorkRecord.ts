"use server";
import { dynamoDb } from "../../dynamodb";
import { PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { revalidateTag } from "next/cache";

export async function updateWorkRecord(
  userId: string,
  oldExactDay: string,
  updates: {
    time?: string;
    type?: string;
    date?: string;
    reason?: string;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const getCommand = new GetCommand({
      TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
      Key: {
        userId,
        date: oldExactDay,
      },
    });

    const existingRecord = await dynamoDb.send(getCommand);
    if (!existingRecord.Item) {
      throw new Error("Record not found");
    }

    const timestamp = new Date().toISOString();
    const newDate = updates.date || existingRecord.Item.date.split("#")[0];
    const yearMonth = newDate.slice(0, 7);

    const newRecord = {
      ...existingRecord.Item,
      ...updates,
      date: `${newDate}#${timestamp}`,
      yearMonth,
      updatedAt: timestamp,
    };

    const putCommand = new PutCommand({
      TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
      Item: newRecord,
    });
    await dynamoDb.send(putCommand);

    const deleteCommand = new DeleteCommand({
      TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
      Key: {
        userId,
        date: oldExactDay,
      },
    });
    await dynamoDb.send(deleteCommand);

    const oldYearMonth = oldExactDay.slice(0, 7);
    revalidateTag(`user-${userId}-records`);
    revalidateTag(`monthly-records-${oldYearMonth}`);
    if (yearMonth !== oldYearMonth) {
      revalidateTag(`monthly-records-${yearMonth}`);
    }

    return { success: true, data: newRecord };
  } catch (error: any) {
    console.error("Error updating work record:", error);
    return { success: false, error: error.message };
  }
}
