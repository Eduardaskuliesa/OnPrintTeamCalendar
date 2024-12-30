"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { dynamoDb } from "../../dynamodb";
import { usersActions } from "../users";
import { getGlobalSettings } from "../settings/global/getGlobalSettings";
import { getUserSettings } from "../settings/user/getUserSettings";
import { User } from "@/app/types/api";
import { sanitizeSettings } from "../settings/sanitizeSettings";
import { calculateVacationDays } from "../../validations/helpers";

interface formData {
  startDate: string;
  endDate: string;
  createGap: boolean;
  gapEndDate: string;
}

export async function bookAsAdminVacation(formData: formData, user: User) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const globalSettings = await getGlobalSettings();
    const userSettings = await getUserSettings(user.userId);

    const settings = sanitizeSettings(
      userSettings.data as GlobalSettingsType,
      globalSettings.data as GlobalSettingsType,
      user.useGlobal
    );

    const { totalVacationDays } = calculateVacationDays(
      new Date(formData.startDate),
      new Date(formData.endDate),
      settings
    );

    let gapDays = 0;
    if (formData.createGap && formData.gapEndDate) {
      const gapStart = new Date(formData.endDate);
      gapStart.setDate(gapStart.getDate() + 1);
      const gapEnd = new Date(formData.gapEndDate);
      const timeDiff = Math.abs(gapEnd.getTime() - gapStart.getTime());
      gapDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    }

    const remainingVacationDays = user.vacationDays - totalVacationDays;

    console.log("Days left:", remainingVacationDays);

    const updateResult = await usersActions.updateUserVacationDays(
      user.userId,
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
      userEmail: user.email,
      userId: user.userId,
      userName: user.name,
      userColor: user.color,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "APPROVED",
      totalVacationDays,
      gapDays,
      requiresApproval: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedBy: session?.user.email,
      approvedAt: new Date().toISOString(),
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
    revalidateTag(`user-vacations-${user.userId}`);

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
