
import { openai } from "@/app/openai";
import { ins } from "@/app/api/completion/my-ins";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const { message, sessionId } = await request.json();

        if (!message) {
            return new Response(
                JSON.stringify({ error: "Message is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

    
        // ساخت آرایه پیام‌ها برای OpenAI
        // const messagesForAI = [
        //     {
        //         role: "system",
        //         content: ins // "شما یک دستیار هوشمند و مهربان هستید که به زبان فارسی صحبت می‌کند و به کاربران کمک می‌کنید."
        //     },
        //     {
        //         role: "user",
        //         content: message
        //     }
        // ];

        // ارسال درخواست به OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                  role: "system",
                  content: ins,
                },
                {
                  role: "user",
                  content: message
                },
              ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const response = completion.choices[0]?.message?.content || '';



        return new Response(
            JSON.stringify({ response }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(
            JSON.stringify({
                error: "An error occurred while processing your request"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

