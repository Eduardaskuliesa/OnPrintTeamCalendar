"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoName, settingsDynamoName } from "@/app/lib/dynamodb";
import { dynamoDb } from "@/app/lib/dynamodb";
import { FormData } from "@/app/admin/CreateUserForm";
import bcrypt from "bcryptjs";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { GlobalSettingsType } from "@/app/types/bookSettings";

async function getGlobalSettings(): Promise<GlobalSettingsType> {
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: settingsDynamoName,
      Key: { settingId: "GLOBAL" },
    })
  );
  console.log("Global settings fetched:", result);

  if (!result.Item) {
    throw new Error("Global settings not found");
  }

  return result.Item as GlobalSettingsType;
}

export async function createUser(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const email = formData.email;
    const password = formData.password;
    const name = formData.name;
    const color = formData.color;
    const vacationDays = 20;
    const useGlobal = true;
    const role = "USER";

    if (!email || !password || !name) {
      throw new Error("Missing required fields");
    }

    const globalSettings = await getGlobalSettings();
    console.log("Fetched global settings:", globalSettings);

    const hashedPassword = await bcrypt.hash(password, 10);
    const timestamp = new Date().toISOString();

    const createUser = new PutCommand({
      TableName: dynamoName,
      Item: {
        email,
        color,
        password: hashedPassword,
        name,
        role,
        vacationDays: vacationDays,
        useGlobal,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      ConditionExpression: "attribute_not_exists(email)",
    });

    // Create structured user settings
    const userSettings = {
      settingId: `USER_${email}`,
      bookingRules: globalSettings.bookingRules,
      gapRules: globalSettings.gapRules,
      overlapRules: globalSettings.overlapRules,
      restrictedDays: globalSettings.restrictedDays,
      seasonalRules: globalSettings.seasonalRules,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    console.log("Creating user settings:", userSettings);

    const createSettings = new PutCommand({
      TableName: settingsDynamoName,
      Item: userSettings,
    });

    await Promise.all([
      dynamoDb.send(createUser),
      dynamoDb.send(createSettings),
    ]);

    console.log("User and settings created successfully");

    revalidateTag("users");
    revalidateTag("global-settings");
    revalidateTag(`user-${email}`);

    return {
      message: "User and settings created successfully",
      user: {
        email,
        name,
        color,
        role,
        vacationDays: vacationDays,
        useGlobal,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      settings: userSettings,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("Šis elpaštas jau yra užimtas");
    }
    throw new Error(error.message);
  }
}
