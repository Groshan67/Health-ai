import ChatCompletion from 'openai';

// درخواست برای ایجاد Chat Completion
export interface OpenAIRequest {
    model: string;
    messages: {
        role: 'system' | 'user' | 'assistant';
        content: string;
    }[];
    max_tokens?: number;
    temperature?: number;
}

// پاسخ از Chat Completion
export type OpenAIResponse = ChatCompletion;
