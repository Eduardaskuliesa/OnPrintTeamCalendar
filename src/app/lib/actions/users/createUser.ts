"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoName, settingsDynamoName } from "@/app/lib/dynamodb";
import { dynamoDb } from "@/app/lib/dynamodb";
import { FormData } from "@/app/admin/components/forms/CreateUserForm";
import bcrypt from "bcryptjs";
import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/app/types/api";

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

    const existingUser = await dynamoDb.send(
      new QueryCommand({
        TableName: dynamoName,
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": formData.email,
        },
      })
    );

    if (existingUser.Items && existingUser.Items.length > 0) {
      throw new Error("Vartotojas su šiuo el. paštu jau egzistuoja");
    }

    const userId = uuidv4();
    const email = formData.email;
    const password = formData.password;
    const name = formData.name;
    const surname = formData.surname;
    const birthday = formData.birthday || "";
    const color = formData.color;
    const vacationDays = formData.vacationDays;
    const updateAmount = formData.updateAmount;
    const useGlobal = false;
    const role = "USER";
    const jobTitle = formData.jobTitle;

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
        userId,
        email,
        color,
        birthday,
        password: hashedPassword,
        name,
        surname,
        role,
        jobTitle,
        vacationDays,
        updateAmount,
        useGlobal,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      ConditionExpression: "attribute_not_exists(email)",
    });

    const userSettings = {
      settingId: `USER_${userId}`,
      bookingRules: globalSettings.bookingRules,
      gapRules: globalSettings.gapRules,
      overlapRules: globalSettings.overlapRules,
      restrictedDays: globalSettings.restrictedDays,
      seasonalRules: globalSettings.seasonalRules,
      useGlobalSettings: {
        gapRules: true,
        bookingRules: true,
        overlapRules: true,
        restrictedDays: true,
        seasonalRules: true,
      },
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
    revalidateTag(`user-${userId}`);

    return {
      message: "User and settings created successfully",
      user: {
        userId,
        email,
        name,
        surname,
        color,
        jobTitle,
        birthday,
        role: role as User["role"],
        vacationDays,
        updateAmount,
        useGlobal,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      settings: userSettings,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("Vartotojas su šiuo ID jau egzistuoja");
    }
    throw new Error(error.message);
  }
}
