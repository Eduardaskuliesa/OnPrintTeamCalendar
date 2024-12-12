"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { dynamoDb } from "@/app/lib/dynamodb";
import { UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateUser(
  email: string,
  userData: { name?: string; color?: string; gapDays?: number }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const updateExpressions = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {
      ":updatedAt": new Date().toISOString(),
    };

    if (userData.name) {
      updateExpressions.push("#name = :name");
      expressionAttributeNames["#name"] = "name";
      expressionAttributeValues[":name"] = userData.name;
    }

    if (userData.color) {
      updateExpressions.push("color = :color");
      expressionAttributeValues[":color"] = userData.color;
    }

    if (userData.gapDays !== undefined) {
      console.log("Adding gapDays to update expression:", userData.gapDays);
      updateExpressions.push("gapDays = :gapDays");
      expressionAttributeValues[":gapDays"] = userData.gapDays;
    }

    await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.DYNAMODB_NAME!,
        Key: { email },
        UpdateExpression: `SET ${updateExpressions.join(
          ", "
        )}, updatedAt = :updatedAt`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: "attribute_exists(email)",
        ReturnValues: "ALL_NEW",
      })
    );

    if (userData.name) {
      const { Items: vacations } = await dynamoDb.send(
        new QueryCommand({
          TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
          IndexName: "userEmail-index",
          KeyConditionExpression: "userEmail = :email",
          ExpressionAttributeValues: {
            ":email": email,
          },
        })
      );
      if (vacations?.length) {
        await Promise.all(
          vacations.map((vacation) => {
            const updateExp = [];
            const expValues: Record<string, any> = {};

            if (userData.name) {
              updateExp.push("userName = :userName");
              expValues[":userName"] = userData.name;
            }

            if (userData.color) {
              updateExp.push("userColor = :userColor");
              expValues[":userColor"] = userData.color;
            }

            return dynamoDb.send(
              new UpdateCommand({
                TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
                Key: { id: vacation.id },
                UpdateExpression: `SET ${updateExp.join(", ")}`,
                ExpressionAttributeValues: expValues,
                ReturnValues: "ALL_NEW",
              })
            );
          })
        );
      }
    }
    revalidateTag(`user-${email}`);
    revalidateTag("users");
    revalidateTag("vacations");
    revalidateTag("admin-vacations");
    revalidatePath('/admin')

    return {
      success: true,
      message: "User and related vacations updated successfully",
    };
  } catch (error: any) {
    console.error("Update failed:", error);
    if (error.name === "ConditionalCheckFailedException") {
      return { success: false, error: "User not found" };
    }
    return { success: false, error: error.message };
  }
}
