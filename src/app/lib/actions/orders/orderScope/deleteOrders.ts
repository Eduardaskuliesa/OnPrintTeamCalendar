"use server";

import { revalidateTag } from "next/cache";

interface Data {
  orderIds: number[];
}

export async function deleteOrders(data: Data) {
  const url = new URL(
    `${process.env.VPS_QUEUE_ENDPOINT}/api/orders/selected/dscope/delete`
  );

  const orderIds = data.orderIds;

  console.log("Received orderIds:", orderIds);

  const response = await fetch(url, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderIds }),
  });

  revalidateTag("all-orders");
  revalidateTag("filtered-orders");

  const responseData = await response.json();
  console.log("Response:", responseData);
  return responseData;
}
