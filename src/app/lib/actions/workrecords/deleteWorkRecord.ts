"use server";
import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../dynamodb";
import { revalidateTag } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

export async function deleteWorkRecord(userId: string, exactDate: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const getCommand = new GetCommand({
      TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
      Key: {
        userId: userId,
        date: exactDate,
      },
    });

    let existingRecord;
    try {
      existingRecord = await dynamoDb.send(getCommand);
    } catch (error: any) {
      console.error("Error checking record existence:", error);
      return { success: false, error: "Klaida tikrinant įrašą" };
    }

    if (!existingRecord.Item) {
      const yearMonth = exactDate.split("#")[0].slice(0, 7);
      const trueYearMonth = exactDate.split("#")[0].slice(0, 10);
      const year = exactDate.split("#")[0].slice(0, 4);
      revalidateTag(`user-${userId}-records`);
      revalidateTag(`monthly-records-${yearMonth}`);
      revalidateTag(`monthly-records-${trueYearMonth}`);
      revalidateTag(`monthly-records-${year}`);
      return { success: false, error: "Įrašas nerastas, perkraukite puslapį" };
    }

    const deleteCommand = new DeleteCommand({
      TableName: process.env.WORKRECORD_DYNAMODB_TABLE_NAME!,
      Key: {
        userId: userId,
        date: exactDate,
      },
      ReturnValues: "ALL_OLD",
    });

    const deleteResult = await dynamoDb.send(deleteCommand);

    if (!deleteResult.Attributes) {
      return { success: false, error: "Nepavyko ištrinti įrašo" };
    }

    const yearMonth = exactDate.split("#")[0].slice(0, 7);

    revalidateTag(`user-${userId}-records`);
    revalidateTag(`monthly-records-${yearMonth}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteWorkRecord:", error);
    return {
      success: false,
      error: error.message || "Įvyko klaida trinant įrašą",
    };
  }
}
