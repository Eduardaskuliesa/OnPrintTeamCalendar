"use server";
import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { dynamoDb } from "@/app/lib/dynamodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { FormData } from "@/app/components/Calendar/VacationForm";


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

async function checkVacationConflicts(startDate: string, endDate: string) {
  const existingVacations = await dynamoDb.send(
    new ScanCommand({
      TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    })
  );

  for (const vacation of existingVacations.Items || []) {
    const vacStart = new Date(vacation.startDate);
    const vacEnd = new Date(vacation.endDate);

    if (new Date(startDate) <= vacEnd && new Date(endDate) >= vacStart) {
      return {
        hasConflict: true,
        error: {
          type: "OVERLAP",
          dates: [{ start: vacation.startDate, end: vacation.endDate }],
        },
      };
    }

    const gapStart = new Date(vacEnd);
    gapStart.setDate(gapStart.getDate() + 1);
    const gapEnd = new Date(vacEnd);
    gapEnd.setDate(gapEnd.getDate() + vacation.gapDays);

    if (new Date(startDate) <= gapEnd && new Date(endDate) >= gapStart) {
      return {
        hasConflict: true,
        error: {
          type: "GAP_CONFLICT",
          dates: [{ start: gapStart.toISOString(), end: gapEnd.toISOString() }],
        },
      };
    }
  }

  return { hasConflict: false };
}

// Base function to fetch vacations data
async function fetchVacationsData() {
  console.log("Fetching vacations from DB at:", new Date().toISOString());
  const result = await dynamoDb.send(
    new ScanCommand({
      TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    })
  );

  const vacations = result.Items?.map((vacation) => {
    const mainEvent = {
      id: vacation.id,
      title: vacation.userName,
      start: new Date(vacation.startDate).toISOString(),
      end: new Date(
        new Date(vacation.endDate).setDate(new Date(vacation.endDate).getDate())
      ).toISOString(),
      backgroundColor: vacation.userColor,
      status: vacation.status,
      email: vacation.userEmail,
    };

    const gapEvent =
      vacation.gapDays > 0
        ? {
            id: `gap-${vacation.id}`,
            title: `Tarpas - ${vacation.userName}`,
            start: new Date(
              new Date(vacation.endDate).setDate(
                new Date(vacation.endDate).getDate() + 1
              )
            ).toISOString(),
            end: new Date(
              new Date(vacation.endDate).setDate(
                new Date(vacation.endDate).getDate() + vacation.gapDays
              )
            ).toISOString(),
            backgroundColor: "#808080",
            status: "GAP",
          }
        : null;

    return gapEvent ? [mainEvent, gapEvent] : [mainEvent];
  });

  return vacations?.flat() || [];
}

export const getVacations = unstable_cache(
  fetchVacationsData,
  ["vacations-list"],
  {
    revalidate: 604800,
    tags: ["vacations"],
  }
);

export async function bookVacation(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Not authenticated");

    const workingDays = getWorkingDays(
      new Date(formData.startDate),
      new Date(formData.endDate)
    );

    const conflictCheck = await checkVacationConflicts(
      formData.startDate,
      formData.endDate
    );

    if (conflictCheck.hasConflict) {
      return {
        success: false,
        status: 404,
        error:
          conflictCheck.error?.type === "OVERLAP"
            ? "These dates are already booked"
            : "This booking conflicts with a required gap period",
        conflictData: conflictCheck.error,
      };
    }

    const vacation = {
      id: crypto.randomUUID(),
      userEmail: session.user.email,
      userName: session.user.name,
      userColor: session.user.color,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "PENDING",
      gapDays: workingDays > 2 ? 7 : 0,
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
    revalidatePath("/");
    return { success: true, data: vacation };
  } catch (error) {
    console.error("Failed to book vacation:", error);
    return {
      success: false,
      error: "Failed to book vacation. Please try again.",
    };
  }
}

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
    revalidateTag("vacations");
    revalidateTag("admin-vacations");
    revalidatePath("/");
    return { success: true, deletedId: id };
  } catch (error) {
    return {
      success: false,
      error: `Failed to delete vacation`,
      message: error,
    };
  }
}

export async function updateVacationStatus(
  id: string,
  status: "APPROVED" | "REJECTED"
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
        Key: { id },
        UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":updatedAt": new Date().toISOString(),
        },
      })
    );
    revalidateTag("admin-vacations");

    return { success: true };
  } catch (error) {
    console.error("Failed to update vacation status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

async function fetchAdminVacations() {
  console.log("Fetching AdminVacation from DB at:", new Date().toISOString());
  const pendingCommand = new QueryCommand({
    TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    IndexName: "status-index",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": "PENDING",
    },
  });

  const approvedCommand = new QueryCommand({
    TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
    IndexName: "status-index",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": "APPROVED",
    },
  });

  const [pendingResult, approvedResult] = await Promise.all([
    dynamoDb.send(pendingCommand),
    dynamoDb.send(approvedCommand),
  ]);

  return [...(pendingResult.Items || []), ...(approvedResult.Items || [])];
}
export const getAdminVacations = unstable_cache(
  fetchAdminVacations,
  ["admin-vacations"],
  {
    revalidate: 86400,
    tags: ["admin-vacations"],
  }
);
