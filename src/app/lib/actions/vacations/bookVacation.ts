"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { checkVacationConflicts } from "../../validations/checkVacationConflicts";
import { dynamoDb } from "../../dynamodb";
import { usersActions } from "../users";
import { getGlobalSettings } from "../settings/global/getGlobalSettings";
import { getUserSettings } from "../settings/user/getUserSettings";
import { vacationsAction } from ".";
import { User } from "@/app/types/api";
import { sanitizeSettings } from "../settings/sanitizeSettings";
import { sendRequestEmail } from "../emails/sendRequestEmail";

interface FormData {
  startDate: string;
  endDate: string;
}

export async function bookVacation(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const user = await usersActions.getFreshUser(session.user.userId);

    const globalSettings = await getGlobalSettings();
    const userSettings = await getUserSettings(session.user.userId);

    const settings = sanitizeSettings(
      userSettings.data as GlobalSettingsType,
      globalSettings.data as GlobalSettingsType,
      user.data.useGlobal
    );

    const vacations = await vacationsAction.getFreshAdminVacations();

    const userEmail = session.user.email;

    const conflictCheck = await checkVacationConflicts(
      formData.startDate,
      formData.endDate,
      settings,
      vacations,
      userEmail,
      user.data as User
    );
    if (conflictCheck.hasConflict) {
      console.log(conflictCheck.error?.type);
      return {
        success: false,
        error: conflictCheck.error?.message,
        conflictDetails: conflictCheck.error,
      };
    }

    const remainingVacationDays =
      user.data.vacationDays - conflictCheck.vacationDaysUsed;

    const updateResult = await usersActions.updateUserVacationDays(
      session.user.userId,
      remainingVacationDays
    );
    if (!updateResult.success) {
      return {
        success: false,
        error: "Failed to update vacation days",
      };
    }

    const vacation = {
      id: crypto.randomUUID(),
      userEmail: user.data.email,
      userId: user.data.userId,
      userName: user.data.name,
      userColor: user.data.color,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "PENDING",
      totalVacationDays: conflictCheck.vacationDaysUsed,
      gapDays: conflictCheck.gapDays,
      requiresApproval: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await sendRequestEmail({
      to: user.data.email,
      name: user.data.name,
      surname: user.data.surname,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });

    await dynamoDb.send(
      new PutCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Item: vacation,
        ConditionExpression: "attribute_not_exists(id)",
      })
    );

    revalidateTag("vacations");
    revalidateTag("admin-vacations");
    revalidateTag(`user-${user.data.userId}`);
    revalidateTag(`user-vacations-${user.data.userId}`);

    return {
      success: true,
      data: vacation,
    };
  } catch (error) {
    console.error("Booking error:", error);
    return {
      success: false,
      error: "Failed to book vacation",
    };
  }
}
