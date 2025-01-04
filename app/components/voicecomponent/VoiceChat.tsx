"use client";

import { useState, useEffect } from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { AudioRecorder } from './AudioRecorder';
import { ChatMessage, MessageInput } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator'

export const VoiceChat: React.FC = () => {
    const { currentSession, addMessage } = useChatStore();
    const [isProcessing, setIsProcessing] = useState(false);
    // در داخل کامپوننت VoiceChat:
    // const handleSendMessage = async (content: string, attachments: File[]) => {
    //     const formData = new FormData();
    //     formData.append('message', content);
    //     formData.append('sessionId', currentSession?.id || '');
    //     attachments.forEach(file => {
    //         formData.append('files', file);
    //     });

    //     try {
    //         const response = await fetch('/api/chat', {
    //             method: 'POST',
    //             body: formData
    //         });
    //         // پردازش پاسخ...
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //     }
    // };

    const handleAudioRecorded = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            // تبدیل صدا به متن
            const formData = new FormData();
            formData.append('audio', audioBlob);

            const transcriptionResponse = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            const { text } = await transcriptionResponse.json();

            // افزودن پیام کاربر
            addMessage({
                role: 'user',
                content: text,
            });

            // دریافت پاسخ از GPT-4
            const chatResponse = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    sessionId: currentSession?.id,
                }),
            });

            const { response } = await chatResponse.json();

            // افزودن پاسخ دستیار
            addMessage({
                role: 'assistant',
                content: response,
            });

            // تبدیل پاسخ به صدا و پخش آن
            speak(response);
        } catch (error) {
            console.error('Error processing audio:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fa-IR';
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="voice-chat">
            <div className="messages-container">
                {currentSession?.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
                {isProcessing && <TypingIndicator />}
            </div>

            <div className="controls">
                {/* <MessageInput onSend={handleSendMessage} /> */}
                <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                {isProcessing && <div className="processing">در حال پردازش...</div>}
            </div>
        </div>
    );
};
