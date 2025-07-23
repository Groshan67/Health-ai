import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        // بررسی نوع درخواست
        const contentType = request.headers.get('content-type') || '';

        // اگر درخواست از نوع FormData باشد (برای تبدیل صدا به متن)
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const audioBlob = formData.get('audio') as Blob;

            if (!audioBlob) {
                return new Response(
                    JSON.stringify({ error: "No audio file provided" }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }

            // تبدیل Blob به File
            const audioFile = new File([audioBlob], 'audio.mp3', {
                type: audioBlob.type
            });

            // درخواست transcription به OpenAI
            const transcription = await openai.audio.transcriptions.create({
                file: audioFile,
                model: "whisper-1",
                language: "fa",
                response_format: "json",
            });

            return new Response(
                JSON.stringify({ text: transcription.text }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // اگر درخواست از نوع JSON باشد (برای چت)
        // if (contentType.includes('application/json')) {
        //     const { message, sessionId } = await request.json();

        //     const completion = await openai.chat.completions.create({
        //         model: "gpt-3.5-turbo",
        //         messages: [
        //             {
        //                 role: "user",
        //                 content: message
        //             }
        //         ],
        //     });

        // const response = completion.choices[0]?.message?.content || '';

        // return new Response(
        //     JSON.stringify({ response }),
        //     {
        //         status: 200,
        //         headers: { "Content-Type": "application/json" }
        //     }
        // );
        //}

        // اگر نوع درخواست نامعتبر باشد
        return new Response(
            JSON.stringify({ error: "Invalid content type" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        console.error("API Error:", error);
        return new Response(
            JSON.stringify({ error: `An error occurred : ${error}` }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
