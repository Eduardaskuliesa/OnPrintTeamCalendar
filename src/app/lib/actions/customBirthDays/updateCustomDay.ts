"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { CustomBrithDayForm } from "@/app/types/api";
import { createTimestamp } from "@/app/utils/helpers/timeStamp";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { revalidateTag } from "next/cache";

export async function updateCustomDay(
  customDayId: string,
  formData: CustomBrithDayForm
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    if (!formData.name || !formData.date) {
      return {
        success: false,
        error: "Pavadinimas ir data yra privaloma",
      };
    }

    const timestamp = createTimestamp;
    const monthDay = formData.date;

    const command = new UpdateCommand({
      TableName: process.env.CUSTOM_DAYS_TABLE_NAME,
      Key: {
        customDayId: customDayId,
      },
      UpdateExpression:
        "SET #name = :name, fullDate = :fullDate, monthDay = :monthDay, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": formData.name,
        ":fullDate": formData.date,
        ":monthDay": monthDay,
        ":updatedAt": timestamp,
      },
    });

    await dynamoDb.send(command);
    revalidateTag(`all-customDays`);

    return {
      success: true,
      data: {
        customDayId,
        name: formData.name,
        date: formData.date,
        monthDay,
        updatedAt: timestamp,
      },
    };
  } catch (error) {
    console.error("Error updating birthday:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update birthday",
    };
  }
}
