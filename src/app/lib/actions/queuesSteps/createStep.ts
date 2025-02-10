import { getServerSession } from "next-auth";
import { dynamoDb } from "../../dynamodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

interface QueueStep {
    stepId: string,
    waitDuration: number,
    tag: string,
    actionConfig: {
        payload: string,
        subject: string,
    },
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
}

export async function createStep(stepData: QueueStep) {

    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }
        const timestamp = new Date().toISOString();
        const stepId = uuidv4()
        const waitDuration = stepData.waitDuration
        const tag = stepData.tag
        const actionConfig = stepData.actionConfig
        const isActive = true
        const createdAt = timestamp
        const updatedAt = timestamp

        const command = new PutCommand({
            TableName: process.env.QUEUE_STEP_DYNAMODB_TABLE_NAME,
            Item: {
                stepId,
                waitDuration,
                tag,
                actionConfig,
                isActive,
                createdAt,
                updatedAt
            },
            ConditionExpression: "attribute_not_exists(tag)"
        })
        await dynamoDb.send(command)
    } catch (error: any) {
        console.error("Error create queueStep:", error);
        if (error.name === "ConditionalCheckFailedException") {
            throw new Error("Toks žingsnis su tokiu tagu jau egzistuoja");
        }
        throw new Error(error.message);
    }
}


