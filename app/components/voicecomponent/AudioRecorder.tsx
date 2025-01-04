// ./app/components/voicecomponent/AudioRecorder.tsx
"use client";

import React, { useState, useRef } from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';
import type { AudioRecorderProps } from '@/app/types';

export function AudioRecorder({ onAudioRecorded, isDisabled }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
                onAudioRecorded(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('خطا در دسترسی به میکروفون');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {error && (
                <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                </div>
            )}

            <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isDisabled}
                className={`
          p-3 rounded-full transition-all duration-200
          ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
        `}
            >
                {isRecording ? (
                    <Square className="w-6 h-6 text-white" />
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}
            </button>
        </div>
    );
}
