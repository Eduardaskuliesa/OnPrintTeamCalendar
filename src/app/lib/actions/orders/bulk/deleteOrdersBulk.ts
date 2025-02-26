"use server";

import { revalidateTag } from "next/cache";

interface Data {
    where: any
}

export async function deleteOrdersBulk(data: Data) {

    const url = new URL(
        `${process.env.NEXT_PUBLIC_VPS_QUEUE_ENDPOIN}/api/orders/filter`
    );

    const filterData = data.where;

    console.log("data:", filterData);

    const response = await fetch(url, {
        cache: "no-cache",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filterData),
    });

    revalidateTag("all-orders");
    revalidateTag("filtered-orders");

    const responseData = await response.json();
    console.log("Response:", responseData);
    return responseData;
}
