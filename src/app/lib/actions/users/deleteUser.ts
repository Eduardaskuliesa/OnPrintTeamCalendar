"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoName, settingsDynamoName, dynamoDb } from "../../dynamodb";

export async function deleteUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    console.log(userId);

    const deleteUserCommand = new DeleteCommand({
      TableName: dynamoName,
      Key: { userId },
      ConditionExpression: "attribute_exists(email)",
    });

    const deleteSettingsCommand = new DeleteCommand({
      TableName: settingsDynamoName,
      Key: { settingId: `USER_${userId}` },
    });

    await Promise.all([
      dynamoDb.send(deleteUserCommand),
      dynamoDb.send(deleteSettingsCommand),
    ]);

    revalidateTag("users");
    revalidateTag(`user-settings-${userId}`);
    

    return { message: "User and settings deleted successfully" };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("User not found");
    }
    throw new Error(error.message);
  }
}
