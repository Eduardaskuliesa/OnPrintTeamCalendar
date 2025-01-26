"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { revalidateTag } from "next/cache";

export async function deleteCustomDay(customDayId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userId) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  try {
    const command = new DeleteCommand({
      TableName: process.env.CUSTOM_DAYS_TABLE_NAME,
      Key: {
        customDayId: customDayId,
      },
      ConditionExpression: "attribute_exists(customDayId)",
    });

    await dynamoDb.send(command);

    revalidateTag("all-customDays");

    return {
      success: true,
      message: "Šventė sėkmingai ištrinta",
    };
  } catch (error) {
    console.error("Delete customDay error:", error);

    if ((error as any).name === "ConditionalCheckFailedException") {
      revalidateTag("all-customDays");
      return {
        success: false,
        error: "Tokios šventės neegzistuoja, prašome perkrauti puslapį",
      };
    }

    return {
      success: false,
      error: "Įvyko klaida trinant šventę, bandykite dar kartą",
    };
  }
}
