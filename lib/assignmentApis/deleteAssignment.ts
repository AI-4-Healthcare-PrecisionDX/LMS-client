export async function deleteAssignment({
  token,
  endpoint,
}: {
  token: string;
  endpoint: string;
}) {
  try {
    const response = await fetch(`${process.env.API_KEY}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    throw new Error("Failed to delete data.");
  }
}