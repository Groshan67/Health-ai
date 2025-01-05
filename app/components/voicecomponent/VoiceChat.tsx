// ./app/components/voicecomponent/VoiceChat.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { AudioRecorder } from '@/app/components/voicecomponent/AudioRecorder';
import { ChatMessage } from '../voicecomponent/ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { MessageCircle, AlertCircle } from 'lucide-react';
import type { Message } from '@/app/types';
import { Alert, AlertDescription } from '@/app/components/voicecomponent/alert';

export function VoiceChat() {
    const { currentSession, addMessage } = useChatStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [micPermissionError, setMicPermissionError] = useState<string>('');
    const [isMobileBrowser, setIsMobileBrowser] = useState(false);

    useEffect(() => {
        // Check if running on mobile browser
        const checkMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
            setIsMobileBrowser(isMobile);
        };

        checkMobile();

        // Check initial microphone permission
        checkMicrophonePermission();
    }, []);

    const checkMicrophonePermission = async () => {
        try {
            // ابتدا بررسی کنید آیا API مجوزها پشتیبانی می‌شود
            if (navigator.permissions && navigator.permissions.query) {
                const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });

                if (result.state === 'denied') {
                    setMicPermissionError('لطفا دسترسی به میکروفون را در تنظیمات مرورگر فعال کنید');
                } else if (result.state === 'granted') {
                    setMicPermissionError('');
                }

                // گوش دادن به تغییرات وضعیت مجوز
                result.onchange = () => {
                    if (result.state === 'denied') {
                        setMicPermissionError('لطفا دسترسی به میکروفون را در تنظیمات مرورگر فعال کنید');
                    } else {
                        setMicPermissionError('');
                    }
                };
            }
        } catch (error) {
            console.log('Permission API not supported, will request on record');
        }
    };

    const handleAudioRecorded = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            // Special handling for iOS Safari
            // if (isMobileBrowser && /iphone|ipad|ipod/i.test(navigator.userAgent)) {
            //     await document.documentElement.requestFullscreen().catch(() => {
            //         console.log('Fullscreen not available');
            //     });
            // }

            // Transcribe audio
            const formData = new FormData();
            formData.append('audio', audioBlob);

            const transcriptionResponse = await fetch('/api/transcription', {
                method: 'POST',
                body: formData,
            });

            if (!transcriptionResponse.ok) {
                throw new Error('خطا در پردازش صدا');
            }

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

            if (!chatResponse.ok) {
                throw new Error('خطا در دریافت پاسخ');
            }

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
            setMicPermissionError(error instanceof Error ? error.message : 'خطا در پردازش صدا');
        } finally {
            setIsProcessing(false);
            // Exit fullscreen if we're in it
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fa-IR';

        // Handle mobile browser speech synthesis
        if (isMobileBrowser) {
            // Clear any existing utterances
            speechSynthesis.cancel();
            // Add a slight delay to ensure proper playback on mobile
            setTimeout(() => {
                speechSynthesis.speak(utterance);
            }, 100);
        } else {
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Error Alert */}
            {micPermissionError && (
                <Alert variant="destructive" className="m-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="mr-2">
                        {micPermissionError}
                    </AlertDescription>
                </Alert>
            )}

            {/* Mobile Instructions */}
            {isMobileBrowser && !micPermissionError && (
                <div className="text-sm text-gray-500 p-4 text-center">
                    برای ضبط صدا، لطفا اجازه دسترسی به میکروفون را تایید کنید
                </div>
            )}

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
                        isDisabled={isProcessing || !!micPermissionError}
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
