import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

// تعریف کلاینت OpenAI
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
});

// تعریف تایپ برای پیام‌های ورودی
type MessageRole = 'system' | 'user' | 'assistant';

interface ChatMessage {
    role: MessageRole;
    content: string;
}

export const createChatCompletion = async (messages: ChatMessage[]) => {
    try {
        // تبدیل پیام‌ها به فرمت مورد نیاز OpenAI
        const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 1000,
        });

        return completion.choices[0].message;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
};
