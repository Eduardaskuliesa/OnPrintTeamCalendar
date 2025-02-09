"use server";

export async function pauseQueue(id: string) {
  const url = new URL(`http://localhost:3000/api/queue/pause/${id}`);

  const response = await fetch(url, {
    cache: "no-cache",
    method: "POST",
  });

  const data = await response.json();
  console.log(data);
  return data;
}
