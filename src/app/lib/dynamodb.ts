import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
    region: process.env.REGION
})

export const dynamoDb = DynamoDBDocumentClient.from(client)

export const dynamoName = process.env.DYNAMODB_NAME;
export const settingsDynamoName = process.env.SETTINGS_DYNAMODB_TABLE_NAME