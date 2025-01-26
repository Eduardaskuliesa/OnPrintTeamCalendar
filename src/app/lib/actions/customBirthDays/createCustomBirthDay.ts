"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { CustomBrithDayForm } from "@/app/types/api";
import { createTimestamp } from "@/app/utils/helpers/timeStamp";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { v4 as uuidv4 } from "uuid";
import { revalidateTag } from "next/cache";

export async function createCustomBirthDay(
  formData: CustomBrithDayForm,
  userId: string
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
        error: "Vardas ir gimimo data yra privaloma",
      };
    }

    const birthdayId = uuidv4();
    const timestamp = createTimestamp;
    const monthDay = formData.date.slice(5);

    const command = new PutCommand({
      TableName: process.env.CUSTOM_BIRTHDAYS_TABLE_NAME,
      Item: {
        userId: userId,
        birthdayId: birthdayId,
        name: formData.name,
        fullDate: formData.date,
        monthDay,
        notificationEnabled: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    await dynamoDb.send(command);
    revalidateTag(`user-${userId}-birthdays`);

    return {
      success: true,
      data: {
        userId: userId,
        birthdayId,
        name: formData.name,
        date: formData.date,
        monthDay,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };
  } catch (error) {
    console.error("Error creating birthday:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create birthday",
    };
  }
}
