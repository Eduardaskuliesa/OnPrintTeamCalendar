
"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

interface RuleData {
    ruleName: string,
    ruleType: string,
    tagIds: number[]
}

export async function createRule(ruleData: RuleData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    console.log(ruleData)
    const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/rule`);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ruleData),
    });

    const data = await response.json();

    if (!response.ok) {
        return {
            success: false,
            message: data.message,
        };
    }
    console.log(data);
    return data;
}

