"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Template } from "@/app/types/emailTemplates";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function updateTemplateType(
    id: Template["id"],
    templateType: Template['type']
) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return {
                success: false,
                message: "Unauthorized: Admin access required",
            };
        }

        const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/template/${id}`);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                templateType,
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: responseData.message,
            };
        }

        revalidateTag("templates");
        return {
            success: true,
            message: "Template type updated successfully",
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Unknown error occurred",
            errorType: "UNEXPECTED_ERROR",
        };
    }
}
