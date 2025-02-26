"use server";

import { revalidateTag } from "next/cache";

interface Data {
    tagIds: number[];
    where: any
}

export async function pauseTagsToFilteredOrders(data: Data) {

    const url = new URL(
        `${process.env.NEXT_PUBLIC_VPS_QUEUE_ENDPOIN}/api/orders/pause/tags`
    );

    const filters = data.where
    const tagIds = data.tagIds;

    console.log("data:", data);

    const response = await fetch(url, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ filters, tagIds }),
    });

    revalidateTag("all-orders");
    revalidateTag("filtered-orders");

    const responseData = await response.json();
    console.log("Response:", responseData);
    return responseData;
}
