"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

async function fetchSalesAgentsFromDb() {
  console.log("Fetching all sales Agents from DB at:", new Date().toISOString());
  const url = new URL(`${process.env.VPS_QUEUE_ENDPOINT}/api/salesagents`);

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

export async function getSalesAgents() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await fetchSalesAgentsFromDb();
  return { data: result };
}
