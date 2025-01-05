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



export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export interface Session {
    id: string;
    messages: Message[];
}

export interface AudioRecorderProps {
    onAudioRecorded: (blob: Blob) => void;
    isDisabled?: boolean;

}

export interface ChatMessageProps {
    message: Message;
}
