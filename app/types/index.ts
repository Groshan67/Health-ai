export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    attachments?: {
        type: 'image' | 'audio';
        url: string;
    }[];
}

export interface ChatSession {
    id: string;
    messages: ChatMessage[];
}