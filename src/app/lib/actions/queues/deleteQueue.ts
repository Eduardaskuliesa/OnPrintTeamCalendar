"use server";

export async function deleteQueue(id: string) {
  const url = new URL(`http://localhost:3000/api/queue/${id}`);

  const response = await fetch(url, {
    cache: "no-cache",
    method: "DELETE",
  });

  const data = await response.json();
  console.log(data);
  return data;
}
