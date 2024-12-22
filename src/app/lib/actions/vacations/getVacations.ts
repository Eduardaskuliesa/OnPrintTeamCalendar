"use server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/app/lib/dynamodb";
import { unstable_cache } from "next/cache";

async function fetchVacationsData() {
  console.log("Fetching vacations from DB at:", new Date().toISOString());

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

  const allVacations = [
    ...(pendingResult.Items || []),
    ...(approvedResult.Items || []),
  ];

  const vacations = allVacations.map((vacation) => {
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
    console.log(vacation.gapDays);

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
                new Date(vacation.endDate).getDate() + Number(vacation.gapDays)
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
