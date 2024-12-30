import { openai } from "@/app/openai";
import { ins } from "./my-ins";

export const runtime = "nodejs";

export async function POST(request) {
  const { content } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: ins,
        },
        {
          role: "user",
          content: [
            { type: "text", text: content[1] },
            { type: "image_url", image_url: { url: content[0] } },
          ],
        },
      ],
    });

    // Return the OpenAI API response as JSON
    return new Response(JSON.stringify(completion.choices[0].message.content), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching completion:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch completion" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
