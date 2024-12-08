"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormData } from "@/app/admin/CreateUserForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { dynamoDb } from "@/app/lib/dynamodb";
import {
  ScanCommand,
  PutCommand,
  DeleteCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidateTag, unstable_cache } from "next/cache";

const dynamoName = process.env.DYNAMODB_NAME;

async function queryUsers() {
  console.log("DB Query executed at:", new Date().toISOString());

  const getAllUsers = new ScanCommand({
    TableName: dynamoName || "",
    ProjectionExpression:
      "email, #name, #role, color, createdAt, updatedAt, gapDays",
    ExpressionAttributeNames: {
      "#name": "name",
      "#role": "role",
    },
  });

  const response = await dynamoDb.send(getAllUsers);

  if (!response || !response.Items) {
    throw new Error("Failed to fetch users");
  }

  return response.Items;
}

// Create a stable cache key based on the session
async function getUserCacheKey() {
  const session = await getServerSession(authOptions);
  return `users-${session?.user?.email}-${session?.user?.role}`;
}

// The main getUsers function
export async function getUsers() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const cacheKey = await getUserCacheKey();

    const cachedUsers = await unstable_cache(queryUsers, [cacheKey], {
      revalidate: 604800,
      tags: ["users"],
    })();

    return { data: cachedUsers };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
}

// Create new user
export async function createUser(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const email = formData.email;
    const password = formData.password;
    const name = formData.name;
    const color = formData.color;
    const gapDays = 7;
    const role = "USER";

    if (!email || !password || !name) {
      throw new Error("Missing required fields");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = new PutCommand({
      TableName: dynamoName,
      Item: {
        email,
        color,
        password: hashedPassword,
        name,
        role,
        gapDays,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(email)",
    });

    await dynamoDb.send(createUser);
    console.log("Revalidating path at:", new Date().toISOString());
    revalidateTag("users");

    return { message: "User created successfully" };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("Šis elpaštas jau yra užimtas");
    }
    throw new Error(error.message);
  }
}

// Get single user
export async function getUser(email: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.email !== email) {
      throw new Error("Unauthorized");
    }

    const getUser = new GetCommand({
      TableName: dynamoName,
      Key: { email },
      ProjectionExpression: "email, #name, role, createdAt, updatedAt",
      ExpressionAttributeNames: {
        "#name": "name",
      },
    });

    const response = await dynamoDb.send(getUser);

    if (!response.Item) {
      throw new Error("User not found");
    }

    return { data: response.Item };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Delete user
export async function deleteUser(email: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const command = new DeleteCommand({
      TableName: dynamoName,
      Key: { email },
      ConditionExpression: "attribute_exists(email)",
    });

    await dynamoDb.send(command);
    revalidateTag("users");
    return { message: "User deleted successfully" };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("User not found");
    }
    throw new Error(error.message);
  }
}

// Update password
export async function updatePassword(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.email !== email) {
      throw new Error("Unauthorized");
    }

    const getCommand = new GetCommand({
      TableName: dynamoName,
      Key: { email },
    });

    const user = (await dynamoDb.send(getCommand)).Item;
    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new Error("Invalid current password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateCommand = new UpdateCommand({
      TableName: dynamoName,
      Key: { email },
      UpdateExpression: "SET password = :password, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":password": hashedPassword,
        ":updatedAt": new Date().toISOString(),
      },
    });

    await dynamoDb.send(updateCommand);
    return { message: "Password updated successfully" };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

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

    revalidateTag("users");
    revalidateTag("vacations");
    revalidateTag("admin-vacations");

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
