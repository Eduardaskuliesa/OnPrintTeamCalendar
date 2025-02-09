"use server";
import { LastEvaluatedKey } from "@/app/types/queueApi";

export async function getQueueItemsByStatus(
  status: string,
  lastEvaluatedKey?: LastEvaluatedKey
) {
  const url = new URL(`http://localhost:3000/api/queue/status/${status}`);
  if (lastEvaluatedKey) {
    url.searchParams.append(
      "lastEvaluatedKey",
      JSON.stringify(lastEvaluatedKey)
    );
  }

  const response = await fetch(url, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch queue items");
  }

  return response.json();
}
