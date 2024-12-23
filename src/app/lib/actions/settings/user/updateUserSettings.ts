/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { settingsDynamoName } from "@/app/lib/dynamodb";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoDb } from "@/app/lib/dynamodb";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createUserSettings(
  userId: string,
  settings: GlobalSettingsType
) {
  await checkAuth();

  try {
    const result = await dynamoDb.send(
      new PutCommand({
        TableName: settingsDynamoName,
        Item: {
          settingId: `USER_${userId}`,
          ...settings,
          useGlobalSettings: {
            gapRules: false,
            bookingRules: false,
            overlapRules: false,
            restrictedDays: false,
            seasonalRules: false,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to create user settings:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserSettingEnabled(
  userId: string,
  settingKey: keyof GlobalSettingsType,
  enabled: boolean
) {
  await checkAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: `USER_${userId}` },
        UpdateExpression:
          "SET #key.#enabled = :enabled, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#key": settingKey,
          "#enabled": "enabled",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":enabled": enabled,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-settings-${userId}`);
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error(`Failed to update user ${settingKey} enabled status:`, error);
    return { success: false, error: error.message };
  }
}

export async function updateUserBookingRules(
  userId: string,
  bookingRules: GlobalSettingsType["bookingRules"]
) {
  await checkAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: `USER_${userId}` },
        UpdateExpression:
          "SET #bookingRules = :bookingRules, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#bookingRules": "bookingRules",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":bookingRules": bookingRules,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-settings-${userId}`);

    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update user booking rules:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserGapDays(
  userId: string,
  gapRules: GlobalSettingsType["gapRules"]
) {
  await checkAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: `USER_${userId}`,
        },
        UpdateExpression: "SET #gapRules = :gapRules, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#gapRules": "gapRules",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":gapRules": {
            enabled: gapRules.enabled,
            days: gapRules.days,
            bypassGapRules: gapRules.bypassGapRules ?? null,
            canIgnoreGapsof: gapRules.canIgnoreGapsof ?? null,
          },
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-settings-${userId}`);
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update gap rules:", {
      gapRules,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}

export async function updateUserOverlapRules(
  userId: string,
  overlapRules: GlobalSettingsType["overlapRules"]
) {
  await checkAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: `USER_${userId}`,
        },
        UpdateExpression:
          "SET #overlapRules = :overlapRules, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#overlapRules": "overlapRules",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":overlapRules": {
            enabled: overlapRules.enabled,
            maxSimultaneousBookings: overlapRules.maxSimultaneousBookings,
            bypassOverlapRules: overlapRules.bypassOverlapRules ?? null,
            canIgnoreOverlapRulesOf:
              overlapRules.canIgnoreOverlapRulesOf ?? null,
          },
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-settings-${userId}`);
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update overlap rules:", {
      overlapRules,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}

export async function updateUserSeasonalRules(
  userId: string,
  seasonalRules: GlobalSettingsType["seasonalRules"]
) {
  await checkAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: `USER_${userId}`,
        },
        UpdateExpression:
          "SET #seasonalRules = :seasonalRules, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#seasonalRules": "seasonalRules",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":seasonalRules": seasonalRules,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-settings-${userId}`);
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update seasonal rules:", {
      seasonalRules,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}

export async function updateUserRestrictedDays(
  userId: string,
  restrictedDays: GlobalSettingsType["restrictedDays"]
) {
  await checkAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: `USER_${userId}`,
        },
        UpdateExpression:
          "SET #restrictedDays = :restrictedDays, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#restrictedDays": "restrictedDays",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":restrictedDays": restrictedDays,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-settings-${userId}`);
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update restricted days:", {
      restrictedDays,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}

export async function updateUserGlobalSettingsPreference(
  userId: string,
  settingKey: keyof GlobalSettingsType,
  useGlobal: boolean
) {
  await checkAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: { settingId: `USER_${userId}` },
        UpdateExpression:
          "SET useGlobalSettings.#key = :useGlobal, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#key": settingKey,
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":useGlobal": useGlobal,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-settings-${userId}`);
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update user global settings preference:", error);
    return { success: false, error: error.message };
  }
}
