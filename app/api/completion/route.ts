import { openai } from "@/app/openai";
import { ins } from "./my-ins";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { newMessage } = body;

  try {
    const model = "gpt-4o";

    // اگر هیچ متنی و تصویری ارسال نشده، خطا بده
    if (!newMessage || (!newMessage.text && !newMessage.image)) {
      throw new Error("پیام ارسال‌شده خالی است.");
    }

    let userMessage;

    if (!newMessage.image) {
      // فقط متن وجود دارد
      userMessage = {
        role: "user",
        content: newMessage.text,
      };
    } else {
      // تصویر و متن وجود دارد
      userMessage = {
        role: "user",
        content: [
          { type: "text", text: newMessage.text },
          { type: "image_url", image_url: { url: newMessage.image } },
        ],
      };
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: ins },
        userMessage,
      ],
      stream: true,
    });

    (async () => {
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            await writer.write(encoder.encode(content));
          }
        }
      } catch (error) {
        console.error("خطای استریم:", error);
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("خطا در دریافت پاسخ:", error);
    return new Response(
      JSON.stringify({ error: "خطا در دریافت پاسخ از مدل" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
