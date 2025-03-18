
"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";


export async function deleteRule(id: number) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/rule/${id}`);

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
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

