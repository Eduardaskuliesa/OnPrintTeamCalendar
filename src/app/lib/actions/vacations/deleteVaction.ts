"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { usersActions } from "../users";

export async function deleteVacation(
  id: string,
  userId: string,
  totalVacationDays: number
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const user = await usersActions.getUser(userId);
    if (!user.data) {
      return { success: false, error: "Failed to fetch user data" };
    }

    const updateResult = await usersActions.updateUserVacationDays(
      userId,
      user.data.vacationDays + totalVacationDays
    );

    if (!updateResult.success) {
      return { success: false, error: "Failed to restore vacation days" };
    }

    await dynamoDb.send(
      new DeleteCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Key: { id },
      })
    );

    revalidateTag("vacations");
    revalidateTag("admin-vacations");
    revalidateTag(`users`);
    revalidateTag(`user-vacations-${user.data.userId}`);

    return {
      success: true,
      id,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to delete vacation`,
      message: error,
    };
  }
}
