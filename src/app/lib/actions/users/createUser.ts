"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoName } from "@/app/lib/dynamodb";
import { dynamoDb } from "@/app/lib/dynamodb";
import { FormData } from "@/app/admin/CreateUserForm";
import bcrypt from "bcryptjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

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
