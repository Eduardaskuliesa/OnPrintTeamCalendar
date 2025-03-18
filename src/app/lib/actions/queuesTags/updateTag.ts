"use server";
import { tagType } from "@/app/(main)/queues/tags/TagPage/TagCardContent";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";



export interface TagData {
    tagName: string;
    tagType: tagType;
    scheduledFor: number;
    templateId: number | null;
}
export async function updateTag(tagData: TagData, tagId: number) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/tag/${tagId}`);

    const response = await fetch(url, {
        cache: "no-cache",
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tagData)
    });

    if (!response.ok) {
        return {
            success: false,
            message: response.json(),
        };
    }

    revalidateTag("all-tags");

    return {
        success: true,
        message: response.json(),
    };
}
