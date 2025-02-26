"use server";

import { revalidateTag } from "next/cache";

interface Data {
  orderIds: number[];
  tagIds: number[];
}

export async function addTagsToOrders(data: Data) {
  console.log(data);
  const url = new URL(
    `${process.env.NEXT_PUBLIC_VPS_QUEUE_ENDPOINT}/api/orders/selected/tscope/create`
  );

  const orderIds = data.orderIds;
  const tagIds = data.tagIds;

  console.log("Received orderIds:", data);

  const response = await fetch(url, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tagIds, orderIds }),
  });

  revalidateTag("all-orders");
  revalidateTag("filtered-orders");

  const responseData = await response.json();
  console.log("Response:", responseData);
  return responseData;
}
