
import { openai } from "@/app/openai";
import { ins } from "@/app/api/completion/my-ins";
import { cookies } from "next/headers";
import { createClient } from "@/app/lib/server";

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

        // اتصال به دیتابیس و دریافت تاریخچه چت
        // const cookieStore = cookies();
        // const supabase = createClient(cookieStore);

        // let chatHistory = [];
        // if (sessionId) {
        //     const { data: messages, error } = await supabase
        //         .from('messages')
        //         .select('role, content')
        //         .eq('session_id', sessionId)
        //         .order('created_at', { ascending: true });

        //     if (!error && messages) {
        //         chatHistory = messages;
        //     }
        // }

        // ساخت آرایه پیام‌ها برای OpenAI
        const messagesForAI = [
            {
                role: "system",
                content: ins // "شما یک دستیار هوشمند و مهربان هستید که به زبان فارسی صحبت می‌کند و به کاربران کمک می‌کنید."
            },
            // ...chatHistory.map(msg => ({
            //     role: msg.role,
            //     content: msg.content
            // })),
            {
                role: "user",
                content: message
            }
        ];

        // ارسال درخواست به OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messagesForAI,
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

