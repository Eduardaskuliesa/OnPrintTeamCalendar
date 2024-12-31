"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { dynamoDb } from "@/app/lib/dynamodb";
import { UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import bcrypt from "bcryptjs";

interface UpdateUserData {
  name?: string;
  surname?: string;
  email?: string;
  color?: string;
  useGlobal?: boolean;
  password?: string;
  vacationDays?: number;
  updateAmount?: number;
  birthday?: string;
}

export async function updateUser(userId: string, userData: UpdateUserData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized: No active session");
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

    if (userData.surname !== undefined) {
      updateExpressions.push("surname = :surname");
      expressionAttributeValues[":surname"] = userData.surname;
    }
    
    if (userData.email) {
      updateExpressions.push("email = :email");
      expressionAttributeValues[":email"] = userData.email;
    }

    if (userData.color) {
      updateExpressions.push("color = :color");
      expressionAttributeValues[":color"] = userData.color;
    }

    if (userData.useGlobal !== undefined) {
      updateExpressions.push("useGlobal = :useGlobal");
      expressionAttributeValues[":useGlobal"] = userData.useGlobal;
    }
   
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      updateExpressions.push("password = :password");
      expressionAttributeValues[":password"] = hashedPassword;
    }

    if (userData.vacationDays !== undefined) {
      updateExpressions.push("vacationDays = :vacationDays");
      expressionAttributeValues[":vacationDays"] = userData.vacationDays;
    }

    if (userData.updateAmount !== undefined) {
      updateExpressions.push("updateAmount = :updateAmount");
      expressionAttributeValues[":updateAmount"] = userData.updateAmount;
    }

    if (userData.birthday) {
      updateExpressions.push("birthday = :birthday");
      expressionAttributeValues[":birthday"] = userData.birthday;
    }

    updateExpressions.push("updatedAt = :updatedAt");

    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.DYNAMODB_NAME!,
        Key: { userId },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: "attribute_exists(userId)",
        ReturnValues: "ALL_NEW",
      })
    );

    if (userData.name || userData.color || userData.email || userData.surname) {
      const { Items: vacations } = await dynamoDb.send(
        new QueryCommand({
          TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
          IndexName: "userId-index",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId,
          },
        })
      );

      if (vacations?.length) {
        await Promise.all(
          vacations.map((vacation) => {
            const updateExp = [];
            const expValues: Record<string, any> = {};

            if (userData.name || userData.surname) {
              updateExp.push("userName = :userName");
              expValues[":userName"] = `${userData.name || ""} ${
                userData.surname || ""
              }`.trim();
            }

            if (userData.color) {
              updateExp.push("userColor = :userColor");
              expValues[":userColor"] = userData.color;
            }

            if (userData.email) {
              updateExp.push("userEmail = :userEmail");
              expValues[":userEmail"] = userData.email;
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
      revalidateTag("users");
      revalidateTag(`user-${userId}`);
      revalidateTag("vacations");
    }

    return {
      success: true,
      message: "User updated successfully",
      user: result.Attributes,
    };
  } catch (error: any) {
    console.error("Update failed:", error);

    if (error.name === "ConditionalCheckFailedException") {
      return { success: false, error: "User not found" };
    }

    return {
      success: false,
      error: error.message || "Failed to update user",
    };
  }
}

export async function updateUserGlobalStatus(
  email: string,
  useGlobal: boolean
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.DYNAMODB_NAME!,
        Key: { email },
        UpdateExpression: "SET useGlobal = :useGlobal, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":useGlobal": useGlobal,
          ":updatedAt": new Date().toISOString(),
        },
        ConditionExpression: "attribute_exists(email)",
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag(`user-${email}`);
    revalidateTag("users");

    return {
      success: true,
      message: "User global status updated successfully",
      user: result.Attributes,
    };
  } catch (error: any) {
    console.error("Update failed:", error);
    if (error.name === "ConditionalCheckFailedException") {
      return { success: false, error: "User not found" };
    }
    return { success: false, error: error.message };
  }
}
