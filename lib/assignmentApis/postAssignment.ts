export async function PostAssignment({ endpoint, content } : { endpoint: string, content: any }) {
  try {
    const response = await fetch(`${process.env.API_KEY}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return error ? error : { message: "Something went wrong" };
  }
}