"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

async function fecthStepFromDb(stepId: string) {
    console.log("Fetching step from DB at:", new Date().toISOString());

    const result = await dynamoDb.send(
        new GetCommand({
            TableName: process.env.QUEUE_STEP_DYNAMODB_TABLE_NAME,
            Key: { stepId },
        })
    );

    if (!result.Item) {
        throw new Error("User not found");
    }

    return result.Item;
}

const getCachedStep = (stepId: string) =>
    unstable_cache(() => fecthStepFromDb(stepId), [`step-${stepId}`], {
        revalidate: 3600,
        tags: [`step-${stepId}`],
    });

export async function getStep(stepId: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const result = await getCachedStep(stepId)();
    return { data: result };
}
