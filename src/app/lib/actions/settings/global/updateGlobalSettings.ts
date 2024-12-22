"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { settingsDynamoName } from "@/app/lib/dynamodb";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
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
  settingKey: keyof GlobalSettingsType,
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
          "#enabled": "enabled",
        },
        ExpressionAttributeValues: {
          ":enabled": enabled,
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
export async function updateGapRules(gapRules: {
  days: number;
  bypassGapRules?: boolean;
  canIgnoreGapsof?: string[];
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: "GLOBAL",
        },
        UpdateExpression: "SET #gapRules = :gapRules",
        ExpressionAttributeNames: {
          "#gapRules": "gapRules",
        },
        ExpressionAttributeValues: {
          ":gapRules": gapRules,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update gap rules:", {
      gapRules,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}

export async function updateOverlapRules(poeple: number) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: "GLOBAL",
        },
        UpdateExpression:
          "SET #overlapRules.#maxSimultaneousBookings = :maxSimultaneousBookings",
        ExpressionAttributeNames: {
          "#overlapRules": "overlapRules",
          "#maxSimultaneousBookings": "maxSimultaneousBookings",
        },
        ExpressionAttributeValues: {
          ":maxSimultaneousBookings": poeple,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update gap days:", {
      poeple,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}

export async function updateBookingRules(bookingRules: {
  maxDaysPerBooking: number;
  maxDaysPerYear: number;
  maxAdvanceBookingDays: number;
  minDaysNotice: number;
}) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: "GLOBAL",
        },
        UpdateExpression: "SET #bookingRules = :bookingRules",
        ExpressionAttributeNames: {
          "#bookingRules": "bookingRules",
        },
        ExpressionAttributeValues: {
          ":bookingRules": bookingRules,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update booking rules:", {
      bookingRules,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}

export async function updateSeasonalRules(seasonalRules: {
  enabled: boolean;
  blackoutPeriods: Array<{
    start: string;
    end: string;
    reason: string;
    name: string;
  }>;
  preferredPeriods: Array<{
    start: string;
    end: string;
    reason: string;
    name: string;
  }>;
}) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: "GLOBAL",
        },
        UpdateExpression: "SET #seasonalRules = :seasonalRules",
        ExpressionAttributeNames: {
          "#seasonalRules": "seasonalRules",
        },
        ExpressionAttributeValues: {
          ":seasonalRules": seasonalRules,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update seasonal rules:", {
      seasonalRules,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}

export async function updateRestrictedDays(restrictedDays: {
  enabled: boolean;
  holidays: string[];
  weekends: {
    restriction: "all" | "none" | "saturday-only" | "sunday-only";
  };
  customRestricted: string[];
}) {
  await checkAdminAuth();

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: "GLOBAL",
        },
        UpdateExpression: "SET #restrictedDays = :restrictedDays",
        ExpressionAttributeNames: {
          "#restrictedDays": "restrictedDays",
        },
        ExpressionAttributeValues: {
          ":restrictedDays": restrictedDays,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update restricted days:", {
      restrictedDays,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}
