"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { usersActions } from "../users";
import { sendCancelledEmail } from "../emails/sendCancelledEmail";

export async function cancelVacation(id: string, userId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user.role !== "USER" && session.user.role !== "ADMIN")) {
      return { success: false, error: "Unauthorized" };
    }

    // First fetch the vacation
    const getResult = await dynamoDb.send(
      new GetCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Key: { id },
      })
    );

    // If vacation not found, revalidate cache and return error
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
    
    // Get fresh user data
    const user = await usersActions.getFreshUser(userId);
    if (!user.data) {
      return { success: false, error: "Failed to fetch user data" };
    }

    // Update user vacation days
    const updateResult = await usersActions.updateUserVacationDays(
      userId,
      user.data.vacationDays + vacation.totalVacationDays
    );

    if (!updateResult.success) {
      return { success: false, error: "Failed to restore vacation days" };
    }

    // Delete the vacation
    await dynamoDb.send(
      new DeleteCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Key: { id },
      })
    );

    // Send cancellation email
    await sendCancelledEmail({
      name: user.data.name,
      startDate: vacation.startDate,
      endDate: vacation.endDate
    });

    // Revalidate tags
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
      error: `Failed to cancel vacation`,
      message: error,
    };
  }
}