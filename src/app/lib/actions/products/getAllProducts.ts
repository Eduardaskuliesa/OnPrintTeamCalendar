"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

async function fetchProductsFromDb() {
  console.log("Fetching all sales Products from DB at:", new Date().toISOString());
  const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/products`);

  const response = await fetch(url, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message,
    };
  }
  console.log(data);
  return data;
}

export async function getProducts() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await fetchProductsFromDb();
  return { data: result };
}
