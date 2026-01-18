"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { createWorkRecord } from "./createWorkRecord";
import { dynamoDb } from "../../dynamodb";
import { QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

interface TransferBalanceParams {
  userId: string;
  fromYear: number;
  balanceTime: string; // Format: "HH:MM"
  isPositive: boolean;
}

interface ExistingTransfer {
  exists: boolean;
  date?: string; // The full date key needed for deletion
}

// Find existing transfer from this year (returns the record's date key if found)
async function findExistingTransfer(userId: string, fromYear: number): Promise<ExistingTransfer> {
  const nextYear = fromYear + 1;

  const command = new QueryCommand({
    TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
    KeyConditionExpression: "userId = :userId AND begins_with(#date, :yearPrefix)",
    FilterExpression: "transferredFrom = :fromYear",
    ExpressionAttributeNames: {
      "#date": "date",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
      ":yearPrefix": `${nextYear}`,
      ":fromYear": fromYear,
    },
  });

  const result = await dynamoDb.send(command);

  if (result.Items && result.Items.length > 0) {
    return {
      exists: true,
      date: result.Items[0].date, // Return the date key for deletion
    };
  }

  return { exists: false };
}

// Delete existing transfer record
async function deleteExistingTransfer(userId: string, date: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
    Key: {
      userId,
      date,
    },
  });

  await dynamoDb.send(command);

  const yearMonth = date.split("#")[0].slice(0, 7);
  const year = date.split("#")[0].slice(0, 4);

  revalidateTag(`user-${userId}-records`);
  revalidateTag(`monthly-records-${yearMonth}`);
  revalidateTag(`monthly-records-${year}`);
}

export async function transferBalanceToNextYear({
  userId,
  fromYear,
  balanceTime,
  isPositive,
}: TransferBalanceParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.userId) {
      return {
        success: false,
        error: "Neprisijungęs vartotojas",
      };
    }

    // Don't allow transfer if balance is 00:00
    if (balanceTime === "00:00") {
      return {
        success: false,
        error: "Nėra ką perkelti - balansas yra 00:00",
      };
    }

    // Check if transfer from this year already exists - if so, delete it first
    const existingTransfer = await findExistingTransfer(userId, fromYear);
    const wasReplaced = existingTransfer.exists;

    if (existingTransfer.exists && existingTransfer.date) {
      await deleteExistingTransfer(userId, existingTransfer.date);
    }

    const nextYear = fromYear + 1;
    const transferDate = `${nextYear}-01-01`;

    // Create work record for January 1st of the next year
    const workRecord = {
      userId,
      date: transferDate,
      type: isPositive ? ("overtime" as const) : ("late" as const),
      time: balanceTime,
      yearMonth: `${nextYear}-01`,
      reason: isPositive
        ? `Perkeltas viršvalandžių balansas iš ${fromYear} m.`
        : `Perkeltas skolos balansas iš ${fromYear} m.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedBy: session.user.userId,
      transferredFrom: fromYear, // Mark as transferred record - cannot be edited/deleted
    };

    await createWorkRecord(workRecord);

    return {
      success: true,
      message: wasReplaced
        ? `Balansas atnaujintas ir perkeltas į ${nextYear} m.`
        : `Balansas sėkmingai perkeltas į ${nextYear} m.`,
    };
  } catch (error) {
    console.error("Error transferring balance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nepavyko perkelti balanso",
    };
  }
}
