"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { revalidateTag } from "next/cache";

export async function updateTagstatus(tagId: string, isActive: boolean) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const result = await dynamoDb.send(
        new UpdateCommand({
            TableName: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
            Key: { tagId },
            UpdateExpression: "SET isActive = :isActive",
            ExpressionAttributeValues: {
                ":isActive": isActive
            },
            ReturnValues: "ALL_NEW"
        })
    );
    revalidateTag('all-tags')
    revalidateTag(`tag-${tagId}`)
    return { data: result.Attributes };
}