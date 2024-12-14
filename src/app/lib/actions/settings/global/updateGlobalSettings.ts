"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { settingsDynamoName } from "@/app/lib/dynamodb";
import { GlobalSettings } from "@/app/types/bookSettings";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoDb } from "@/app/lib/dynamodb";

// Helper function to check admin authorization
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function updateSettingEnabled(
  settingKey: keyof GlobalSettings,
  enabled: boolean
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL" },
        UpdateExpression: "SET #key.#enabled = :enabled",
        ExpressionAttributeNames: {
          "#key": settingKey,
          "#enabled": "enabled"
        },
        ExpressionAttributeValues: {
          ":enabled": enabled
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error(`Failed to update ${settingKey} enabled status:`, error);
    return { success: false, error: error.message };
  }
}
// Update gap rules
export async function updateGapRules(
  gapRules: GlobalSettings['gapRules']
) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL_SETTINGS" },
        UpdateExpression: "SET settings.gapRules = :rules, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":rules": gapRules,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update gap rules:", error);
    return { success: false, error: error.message };
  }
}

// Update booking rules
export async function updateBookingRules(
  bookingRules: GlobalSettings['bookingRules']
) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL_SETTINGS" },
        UpdateExpression: "SET settings.bookingRules = :rules, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":rules": bookingRules,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update booking rules:", error);
    return { success: false, error: error.message };
  }
}

// Update overlap rules
export async function updateOverlapRules(
  overlapRules: GlobalSettings['overlapRules']
) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL_SETTINGS" },
        UpdateExpression: "SET settings.overlapRules = :rules, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":rules": overlapRules,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update overlap rules:", error);
    return { success: false, error: error.message };
  }
}

// Update restricted days
export async function updateRestrictedDays(
  restrictedDays: GlobalSettings['restrictedDays']
) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL_SETTINGS" },
        UpdateExpression: "SET settings.restrictedDays = :days, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":days": restrictedDays,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update restricted days:", error);
    return { success: false, error: error.message };
  }
}

// Update seasonal rules
export async function updateSeasonalRules(
  seasonalRules: GlobalSettings['seasonalRules']
) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL_SETTINGS" },
        UpdateExpression: "SET settings.seasonalRules = :rules, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":rules": seasonalRules,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update seasonal rules:", error);
    return { success: false, error: error.message };
  }
}

// Update minimum days notice
export async function updateMinDaysNotice(
  minDaysNotice: GlobalSettings['bookingRules']['minDaysNotice']
) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL_SETTINGS" },
        UpdateExpression: "SET settings.bookingRules.minDaysNotice = :notice, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":notice": minDaysNotice,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update minimum days notice:", error);
    return { success: false, error: error.message };
  }
}