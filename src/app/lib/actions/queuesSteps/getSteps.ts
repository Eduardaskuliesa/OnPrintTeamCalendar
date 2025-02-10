"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { dynamoDb } from "../../dynamodb";

async function fetchStepsFromDb() {
    console.log("Fetching all steps from DB at:", new Date().toISOString());

    const result = await dynamoDb.send(
        new ScanCommand({
            TableName: process.env.QUEUE_STEP_DYNAMODB_TABLE_NAME,
        })
    );

    if (!result.Items) {
        return [];
    }

    return result.Items;
}

const getCachedSteps = () =>
    unstable_cache(() => fetchStepsFromDb(), ["all-steps"], {
        revalidate: 3600,
        tags: ["all-steps"],
    });

export async function getSteps() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const result = await getCachedSteps()();
    return { data: result };
}