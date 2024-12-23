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
import { FormData } from "@/app/components/Calendar/VacationForm";
import { vacationsAction } from ".";

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
function getWorkingDays(startDate: Date, endDate: Date): number {
  let days = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    if (!isWeekend(current)) {
      days++;
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export async function bookVacation(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const user = await usersActions.getUser(session.user.id);
    console.log("user data:", user.data);
    let settings;
    if (user.data.useGlobal === true) {
      settings = await getGlobalSettings();
    } else {
      settings = await getUserSettings(session.user.id);
    }

    const vacations = await vacationsAction.getAdminVacations();
    console.log("vacations:", vacations);
    const userEmail = session.user.email

    const conflictCheck = await checkVacationConflicts(
      formData.startDate,
      formData.endDate,
      settings.data as GlobalSettingsType,
      vacations,
      userEmail
    );
    if (conflictCheck.hasConflict) {
      return {
        success: false,
        error: conflictCheck.error?.message,
        conflictDetails: conflictCheck.error,
      };
    }

    const workingDays = getWorkingDays(
      new Date(formData.startDate),
      new Date(formData.endDate)
    );

    const vacation = {
      id: crypto.randomUUID(),
      userEmail: user.data.email,
      userName: user.data.name,
      userColor: user.data.color,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "PENDING",
      gapDays: workingDays > 2 ? settings.data?.gapRules.days : 0,
      requiresApproval: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Item: vacation,
        ConditionExpression: "attribute_not_exists(id)",
      })
    );

    revalidateTag("vacations");
    revalidateTag("admin-vacations");

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
