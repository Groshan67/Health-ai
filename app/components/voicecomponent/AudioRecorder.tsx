// ./app/components/voicecomponent/AudioRecorder.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';
import type { AudioRecorderProps } from '@/app/types';

export function AudioRecorder({ onAudioRecorded, isDisabled }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // بررسی وضعیت دسترسی به میکروفون در هنگام لود کامپوننت
    useEffect(() => {
        checkMicrophonePermission();
    }, []);

    const checkMicrophonePermission = async () => {
        try {
            // بررسی پشتیبانی مرورگر از API مجوزها
            if (navigator.permissions && navigator.permissions.query) {
                const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                setHasPermission(result.state === 'granted');

                // نظارت بر تغییرات وضعیت مجوز
                result.onchange = () => {
                    setHasPermission(result.state === 'granted');
                    if (result.state === 'denied') {
                        setError('لطفا دسترسی به میکروفون را در تنظیمات مرورگر فعال کنید');
                        stopRecording();
                    }
                };
            }
        } catch (err) {
            console.log('Permission API not supported');
        }
    };

    const requestMicrophoneAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            setHasPermission(true);
            setError(null);
            return stream;
        } catch (err) {
            if ((err as Error).name === 'NotAllowedError' || (err as Error).name === 'PermissionDeniedError') {
                setError('لطفا دسترسی به میکروفون را در تنظیمات مرورگر فعال کنید');
            } else {
                setError('خطا در دسترسی به میکروفون');
            }
            setHasPermission(false);
            throw err;
        }
    };

    const startRecording = async () => {
        try {
            // درخواست دسترسی به میکروفون در صورت نداشتن مجوز
            const stream = hasPermission ?
                await navigator.mediaDevices.getUserMedia({ audio: true }) :
                await requestMicrophoneAccess();

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm' // سازگاری بیشتر با مرورگرهای مختلف
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                onAudioRecorded(audioBlob);

                // آزادسازی منابع
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(1000); // ذخیره هر ثانیه برای اطمینان بیشتر
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error('Error starting recording:', err);
            if (!error) { // اگر قبلاً خطایی تنظیم نشده
                setError('خطا در شروع ضبط صدا');
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            try {
                mediaRecorderRef.current.stop();
            } catch (err) {
                console.error('Error stopping recording:', err);
            }
            setIsRecording(false);
        }
    };

    const handleRecordClick = async () => {
        if (!isRecording) {
            await startRecording();
        } else {
            stopRecording();
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
                onClick={handleRecordClick}
                disabled={isDisabled}
                className={`
                    p-3 rounded-full transition-all duration-200
                    ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
                `}
                aria-label={isRecording ? 'توقف ضبط' : 'شروع ضبط'}
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
