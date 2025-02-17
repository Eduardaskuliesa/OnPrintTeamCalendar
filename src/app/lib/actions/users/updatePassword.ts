"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoName } from "../../dynamodb";
import { dynamoDb } from "../../dynamodb";
import bcrypt from "bcryptjs";
import { revalidateTag } from "next/cache";

export async function updatePassword(userId: string, newPassword: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.email !== userId) {
      throw new Error("Unauthorized");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateCommand = new UpdateCommand({
      TableName: dynamoName,
      Key: { userId },
      UpdateExpression: "SET password = :password, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":password": hashedPassword,
        ":updatedAt": new Date().toISOString(),
      },
    });

    await dynamoDb.send(updateCommand);
    
    revalidateTag(`user-${userId}`)
    return { message: "Password updated successfully" };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
