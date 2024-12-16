"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { settingsDynamoName } from "@/app/lib/dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "@/app/lib/dynamodb";

async function fetchUserSettings(email: string) {
  console.log(
    `Fetching user settings for ${email} from DB at:`,
    new Date().toISOString()
  );

  const result = await dynamoDb.send(
    new GetCommand({
      TableName: settingsDynamoName,
      Key: { settingId: `USER_${email}` },
    })
  );

  if (!result.Item) {
    // If no user settings exist, get global settings
    const globalSettings = await dynamoDb.send(
      new GetCommand({
        TableName: settingsDynamoName,
        Key: { settingId: "GLOBAL" },
      })
    );

    return globalSettings.Item;
  }

  return result.Item;
}

const getCachedUserSettings = (email: string) =>
  unstable_cache(() => fetchUserSettings(email), [`user-settings-${email}`], {
    revalidate: 604800, // 7 days
    tags: [`user-settings-${email}`],
  });

export async function getUserSettings(email: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN" && session?.user?.email !== email) {
    throw new Error("Unauthorized");
  }

  const result = await getCachedUserSettings(email)();
  return { data: result };
}
