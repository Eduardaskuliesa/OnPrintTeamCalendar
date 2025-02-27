"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

async function fetchOrdersFromDb(page: number = 1) {
  console.log("Fetching orders from DB at:", new Date().toISOString());
  const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/orders?page=${page}&limit=100`);

  const response = await fetch(url, {
    method: "GET",
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

  return data;
}

export async function getOrders(page: number = 1) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await fetchOrdersFromDb(page);
  return { data: result };
}
