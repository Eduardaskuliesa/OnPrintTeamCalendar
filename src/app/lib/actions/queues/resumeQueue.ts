"use server";

export async function resumeQueue(id: string) {
  const url = new URL(`http://localhost:3000/api/queue/resume/${id}`);

  const response = await fetch(url, {
    cache: "no-cache",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch queue items");
  }

  return response.json();
}
