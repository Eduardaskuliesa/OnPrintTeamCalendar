"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { settingsDynamoName } from "@/app/lib/dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "@/app/lib/dynamodb";

const getCachedGlobalSettings = unstable_cache(
  async () => {
    console.log(
      "Fetching global settings from DB at:",
      new Date().toISOString()
    );

    const result = await dynamoDb.send(
      new GetCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL" },
      })
    );

    if (!result.Item) {
      return {
        gapRules: {
          enabled: true,
          days: 7,
        },
        bookingRules: {
          maxDaysPerBooking: 14,
          maxDaysPerYear: 20,
          maxAdvanceBookingDays: 180,
          minDaysNotice: {
            enabled: true,
            days: 14,
          },
        },
        overlapRules: {
          enabled: true,
          maxSimultaneousBookings: 2,
        },
        restrictedDays: {
          holidays: [],
          weekends: false,
          customRestricted: [],
        },
        seasonalRules: {
          blackoutPeriods: [],
          preferredPeriods: [],
        },
      };
    }

    return result.Item;
  },
  ["global-settings"],
  {
    revalidate: 680000,
    tags: ["global-settings"],
  }
);

export async function getGlobalSettings() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const result = await getCachedGlobalSettings();
  return { data: result };
}
