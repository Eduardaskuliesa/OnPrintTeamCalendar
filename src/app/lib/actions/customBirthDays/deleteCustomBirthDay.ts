"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { revalidateTag } from "next/cache";

export async function deleteBirthday(birthdayId: string, userId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userId) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }
  console.log(userId);

  try {
    const command = new DeleteCommand({
      TableName: process.env.CUSTOM_BIRTHDAYS_TABLE_NAME,
      Key: {
        userId: userId,
        birthdayId: birthdayId,
      },
      ConditionExpression:
        "attribute_exists(userId) AND attribute_exists(birthdayId)",
    });

    await dynamoDb.send(command);

    revalidateTag(`user-${userId}-birthdays`);

    return {
      success: true,
      message: "Gimtadienis sėkmingai ištrintas",
    };
  } catch (error) {
    console.error("Delete birthday error:", error);

    if ((error as any).name === "ConditionalCheckFailedException") {
      revalidateTag(`user-${userId}-birthdays`);
      return {
        success: false,
        error: "Tokio gimtadienio neegzistuoja, prašome perkrauti puslapį",
      };
    }

    return {
      success: false,
      error: "Įvyko klaida trinant gimtadienį, bandykite dar kartą",
    };
  }
}
