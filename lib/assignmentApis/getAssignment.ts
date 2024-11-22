export async function getAssignment({ endpoint }: { endpoint: string }) {
  try {
    const response = await fetch(`${process.env.API_KEY}/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return error ? error : { message: "Something went wrong" };
  }
}