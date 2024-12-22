"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function deleteVacation(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await dynamoDb.send(
      new DeleteCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Key: { id },
      })
    );
    console.log(id, 'ID')
    revalidateTag("vacations");
    revalidateTag("admin-vacations");
    return { success: true, id };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to delete vacation`,
      message: error,
    };
  }
}
