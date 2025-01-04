import { openai } from "@/app/openai";
import { ins } from "./my-ins";

export const runtime = "nodejs";

export async function POST(request: Response) {
  const { content } = await request.json();

  try {
    let contents = null;

    const model = "gpt-3.5-turbo";
    if (!content[1]) {
      contents = content[0];
    } else {
      contents = content[0];
    }

    // تنظیم response به عنوان یک Stream
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // ایجاد درخواست stream به OpenAI
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: ins,
        },
        {
          role: "user",
          content: contents
        },
      ],
      stream: true // فعال کردن stream
    });

    // پردازش پاسخ‌های stream شده
    (async () => {
      try {
        for await (const chunk of completion) {
          // دریافت متن از chunk
          const content = chunk.choices[0]?.delta?.content || '';

          // ارسال داده به stream
          if (content) {
            await writer.write(encoder.encode(content));
          }

          // اگر usage وجود داشت، می‌توانید آن را هم پردازش کنید
          if (chunk.usage) {
            console.log('Usage:', chunk.usage);
          }
        }
      } catch (error) {
        console.error("Stream error:", error);
      } finally {
        await writer.close();
      }
    })();

    // برگرداندن stream به عنوان پاسخ
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Error fetching completion:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch completion" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
