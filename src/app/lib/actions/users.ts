/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { FormData } from "@/app/admin/CreateUserForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { dynamoDb } from "@/app/lib/dynamodb";
import { 
  ScanCommand, 
  PutCommand, 
  DeleteCommand, 
  GetCommand, 
  UpdateCommand 
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from 'next/cache';

const dynamoName = process.env.DYNAMODB_NAME;

// Get all users
export async function getUsers() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const getAllUsers = new ScanCommand({
      TableName: dynamoName || "",
      ProjectionExpression: "email, #name, #role, color, createdAt, updatedAt",
      ExpressionAttributeNames: {
        "#name": "name",
        "#role": "role"
      },
    });

    const response = await dynamoDb.send(getAllUsers);

    if (!response || !response.Items) {
      throw new Error("Failed to fetch users");
    }

    return { data: response.Items };
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
    const password = formData.password
    const name = formData.name
    const color = formData.color
    const role = 'USER'

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(email)",
    });

    await dynamoDb.send(createUser);
    
    revalidatePath('/admin');
    
    return { message: "User created successfully" };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("Email already exists");
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
    revalidatePath('/admin');
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