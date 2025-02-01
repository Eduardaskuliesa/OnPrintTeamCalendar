"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { usersActions } from "../users";
import { deletePDFfromS3 } from "../s3Actions/deletePdf";

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
        error: "Atostogos nerastos. Prašome perkrauti puslapį.",
      };
    }

    const vacation = getResult.Item;
    const totalVacationDays = vacation.totalVacationDays;
    const year = vacation.startDate.slice(0, 4);

    const deletePdfResult = await deletePDFfromS3(vacation.id, year);
    if (!deletePdfResult.success) {
      console.error("Failed to delete PDF:", deletePdfResult.message);
    }

    const user = await usersActions.getFreshUser(userId);
    if (!user.data) {
      return { success: false, error: "Failed to fetch user data" };
    }

    const updatedVacationDays = user.data.vacationDays + totalVacationDays;

    const updateResult = await usersActions.updateUserVacationDays(
      userId,
      updatedVacationDays
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
      updatedUserBalance: updatedVacationDays,
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
