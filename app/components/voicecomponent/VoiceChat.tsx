// ./app/components/voicecomponent/VoiceChat.tsx
"use client";

import React, { useState } from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { AudioRecorder } from '@/app/components/voicecomponent/AudioRecorder';
import { ChatMessage } from '../voicecomponent/ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { MessageCircle } from 'lucide-react';
import type { Message } from '@/app/types';



export function VoiceChat() {
    const { currentSession, addMessage } = useChatStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAudioRecorded = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            // Transcribe audio
            const formData = new FormData();
            formData.append('audio', audioBlob);

            const transcriptionResponse = await fetch('/api/transcription', {
                method: 'POST',
                body: formData,
            });

            const { text } = await transcriptionResponse.json();

            // Add user message
            addMessage({
                role: 'user',
                content: text,
            });

            // Get GPT response
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

            // Add assistant message
            addMessage({
                role: 'assistant',
                content: response,
            });

            // Convert response to speech
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
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Container for chat messages */}
            <div className="flex-3 overflow-y-auto p-4 space-y-4">
                {currentSession?.messages.map((message: Message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}

                {/* Typing indicator */}
                {isProcessing && (
                    <div className="flex items-center space-x-2">
                        <TypingIndicator />
                    </div>
                )}
            </div>

            {/* Bottom section with recorder and processing message */}
            <div className="border-t border-gray-200 bg-white p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between sm:flex-col sm:space-y-4 sm:items-start">
                    {/* Audio Recorder button */}
                    <AudioRecorder
                        onAudioRecorded={handleAudioRecorded}
                        isDisabled={isProcessing}
                    />

                    {/* Processing message */}
                    {isProcessing && (
                        <div className="flex items-center text-sm text-gray-500 space-x-2 rtl:space-x-reverse">
                            <MessageCircle className="w-4 h-4 animate-pulse" />
                            <span>در حال پردازش...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
