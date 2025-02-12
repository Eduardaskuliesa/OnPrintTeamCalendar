"use server";

export async function batchDeleteQueues(jobIds: string[]) {
  const url = new URL(`http://localhost:3000/api/queue/batch-delete`);

  const response = await fetch(url, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobIds }),
  });

  const data = await response.json();
  console.log(data);
  return data;
}
