"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { FilterState } from "@/app/types/orderFilter";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

async function fetchOrdersFromDb(filters: FilterState, page: number = 1) {
  console.log("Fetching orders from DB at:", new Date().toISOString());
  const url = new URL(`http://localhost:3000/api/order/filter?page=${page}`);

  console.log(filters);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
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
  unstable_cache(
    (filters: FilterState, page: number) => fetchOrdersFromDb(filters, page),
    ["filtered-orders"],
    {
      revalidate: 100,
      tags: ["filtered-orders"],
    }
  );

export async function getFilteredOrders(filters: FilterState, page: number = 1) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await getCachedOrders()(filters, page);

  console.log(result);
  return { data: result };
}
