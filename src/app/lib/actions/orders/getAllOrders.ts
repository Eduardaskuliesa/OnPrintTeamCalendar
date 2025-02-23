"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

async function fetchOrdersFromDb(page: number = 1) {
  console.log("Fetching orders from DB at:", new Date().toISOString());
  const url = new URL(`http://localhost:3000/api/orders?page=${page}`);

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

const getCachedOrders = () =>
  unstable_cache((page: number) => fetchOrdersFromDb(page), ["all-orders"], {
    revalidate: 100,
    tags: ["all-orders"],
  });

export async function getOrders(page: number = 1) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await getCachedOrders()(page);
  return { data: result };
}
