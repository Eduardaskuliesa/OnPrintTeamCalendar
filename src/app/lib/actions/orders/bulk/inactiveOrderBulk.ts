"use server";

import { revalidateTag } from "next/cache";

interface Data {
    where: any
}

export async function inactiveOrdersBulk(data: Data) {

    const url = new URL(
        `http://localhost:3000/api/orders/inactive`
    );

    const extractedData = data.where;

    console.log("data:", extractedData);

    const response = await fetch(url, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(extractedData),
    });

    revalidateTag("all-orders");
    revalidateTag("filtered-orders");

    const responseData = await response.json();
    console.log("Response:", responseData);
    return responseData;
}
