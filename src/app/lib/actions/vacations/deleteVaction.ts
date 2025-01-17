"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { usersActions } from "../users";

export async function deleteVacation(id: string, userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }


    const getResult = await dynamoDb.send(
      new GetCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Key: { id },
      })
    );

    
    if (!getResult.Item) {
      revalidateTag("vacations");
      revalidateTag("admin-vacations");
      revalidateTag(`users`);
      revalidateTag(`user-${userId}`);
      revalidateTag(`user-vacations-${userId}`);

      return {
        success: false,
        error: "Atostogos nerastos. Prašome perkrauti puslapį."
      };
    }

    const vacation = getResult.Item;
    console.log(vacation)
    const totalVacationDays = vacation.totalVacationDays;


    const user = await usersActions.getFreshUser(userId);
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
    revalidateTag(`user-${userId}`);
    revalidateTag(`user-vacations-${userId}`);

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