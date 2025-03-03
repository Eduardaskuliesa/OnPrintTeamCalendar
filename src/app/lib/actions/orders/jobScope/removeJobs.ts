"use server";

import { revalidateTag } from "next/cache";

interface Data {
    jobIds: string[];
}

export async function deleteJobs(data: Data) {
    console.log(data);
    const url = new URL(
        `${process.env.VPS_QUEUE_ENDPOINT}/api/queue/jobs/delete`
    );

    const jobIds = data.jobIds;


    console.log("Received orderIds:", data);

    const response = await fetch(url, {
        cache: "no-cache",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobIds }),
    });

    revalidateTag("all-orders");
    revalidateTag("filtered-orders");

    const responseData = await response.json();
    console.log("Response:", responseData);
    return responseData;
}
