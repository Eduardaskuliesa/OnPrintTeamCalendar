"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { dynamoDb, settingsDynamoName } from "@/app/lib/dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function updateEmails(emails: {
  admin: string[];
  accountant: string;
  founderNameSurname: string;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  console.log(emails);

  try {
    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: settingsDynamoName,
        Key: {
          settingId: "GLOBAL",
        },
        UpdateExpression: `
          SET #emails.#admin = :admin,
              #emails.#accountant = :accountant,
              #emails.#founderNameSurname = :founderNameSurname,
              #updatedAt = :updatedAt
          `,
        ExpressionAttributeNames: {
          "#emails": "emails",
          "#admin": "admin",
          "#accountant": "accountant",
          "#founderNameSurname": "founderNameSurname",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":admin": emails.admin,
          ":accountant": emails.accountant,
          ":founderNameSurname": emails.founderNameSurname,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    revalidateTag("global-settings");
    console.log("success");
    return { success: true, data: updateResult.Attributes };
  } catch (error: any) {
    console.error("Failed to update emails:", {
      emails,
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}
