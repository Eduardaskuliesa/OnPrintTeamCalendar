"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

async function fecthTagFromDb(tagId: string) {
    console.log("Fetching tag from DB at:", new Date().toISOString());

    const result = await dynamoDb.send(
        new GetCommand({
            TableName: process.env.QUEUE_TAG_DYNAMODB_TABLE_NAME,
            Key: { tagId },
        })
    );

    if (!result.Item) {
        throw new Error("User not found");
    }

    return result.Item;
}

const getCachedTag = (tagId: string) =>
    unstable_cache(() => fecthTagFromDb(tagId), [`tag-${tagId}`], {
        revalidate: 3600,
        tags: [`tag-${tagId}`],
    });

export async function getTag(tagId: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const result = await getCachedTag(tagId)();
    return { data: result };
}
