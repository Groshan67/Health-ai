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
    const streamRef = useRef<MediaStream | null>(null);

    // تشخیص نوع مرورگر
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // پاکسازی منابع در هنگام unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const getSupportedMimeType = () => {
        const types = [
            'audio/webm',
            'audio/mp4',
            'audio/mpeg',
            'audio/ogg',
            'audio/wav'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return 'audio/mp4'; // پیش‌فرض برای Safari
    };

    const startRecording = async () => {
        try {
<<<<<<< HEAD
            // اضافه کردن لاگ برای بررسی پشتیبانی مرورگر
            console.log('Browser check:', {
                userAgent: navigator.userAgent,
                hasMediaDevices: !!navigator.mediaDevices,
                hasUserMedia: !!navigator.mediaDevices?.getUserMedia,
                hasMediaRecorder: 'MediaRecorder' in window,
            });
    
            // بررسی پشتیبانی اولیه
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('مرورگر شما از ضبط صدا پشتیبانی نمی‌کند');
            }
    
            // تنظیمات ساده‌تر برای سازگاری بیشتر
            const constraints = {
                audio: true
            };
    
            console.log('Requesting media access...');
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Media access granted');
    
            streamRef.current = stream;
    
            // بررسی پشتیبانی MediaRecorder
            if (!window.MediaRecorder) {
                throw new Error('مرورگر شما از MediaRecorder پشتیبانی نمی‌کند');
            }
    
            // تنظیمات ساده‌تر برای MediaRecorder
            const mediaRecorder = new MediaRecorder(stream);
=======
            // درخواست دسترسی به میکروفون
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100, // نرخ نمونه‌برداری استاندارد
                }
            });

            streamRef.current = stream;

            const options: MediaRecorderOptions = {
                mimeType: getSupportedMimeType()
            };

            const mediaRecorder = new MediaRecorder(stream, options);
>>>>>>> 2e0dd71 (h)
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
    
            mediaRecorder.ondataavailable = (e) => {
                console.log('Data available:', e.data.size);
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };
<<<<<<< HEAD
    
            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                setError('خطا در ضبط صدا');
                cleanupRecording();
            };
    
            mediaRecorder.onstop = () => {
                try {
                    console.log('Recording stopped, processing chunks...');
                    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                    console.log('Created blob:', audioBlob.size);
                    onAudioRecorded(audioBlob);
                    cleanupRecording();
                } catch (err) {
                    console.error('Error in onstop handler:', err);
                    setError('خطا در پردازش صدای ضبط شده');
                    cleanupRecording();
                }
            };
    
            // شروع ضبط با timeslice کوتاه‌تر
            mediaRecorder.start(100);
            console.log('Recording started');
    
            setIsRecording(true);
            setError(null);
            setHasPermission(true);
    
        } catch (err) {
            console.error('Recording error:', err);
            const errorMessage = err instanceof Error ? err.message : 'خطا در شروع ضبط صدا';
            setError(errorMessage);
            setHasPermission(false);
            cleanupRecording();
=======

            mediaRecorder.onstop = async () => {
                try {
                    const audioBlob = new Blob(chunksRef.current, { type: options.mimeType });
                    onAudioRecorded(audioBlob);

                    // آزادسازی منابع
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach(track => track.stop());
                        streamRef.current = null;
                    }
                } catch (err) {
                    console.error('Error processing recording:', err);
                    setError('خطا در پردازش صدای ضبط شده');
                }
            };

            // برای Safari: ضبط در قطعات کوچکتر
            const timeslice = isSafari ? 100 : 1000;
            mediaRecorder.start(timeslice);

            setIsRecording(true);
            setError(null);
            setHasPermission(true);
        } catch (err) {
            console.error('Error starting recording:', err);
            const error = err as Error;

            switch (error.name) {
                case 'NotAllowedError':
                case 'PermissionDeniedError':
                    setError('لطفاً دسترسی به میکروفون را در تنظیمات مرورگر فعال کنید');
                    break;
                case 'NotFoundError':
                    setError('میکروفونی پیدا نشد');
                    break;
                case 'NotReadableError':
                    setError('میکروفون در دسترس نیست');
                    break;
                default:
                    setError('خطا در دسترسی به میکروفون');
            }
            setHasPermission(false);
>>>>>>> 2e0dd71 (h)
        }
    };
    
    const cleanupRecording = () => {
        console.log('Cleaning up recording resources');
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log('Track stopped:', track.kind);
            });
            streamRef.current = null;
        }
        chunksRef.current = [];
        mediaRecorderRef.current = null;
        setIsRecording(false);
    };
    
    const stopRecording = () => {
        console.log('Stopping recording...');
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                mediaRecorderRef.current.stop();
                console.log('MediaRecorder stopped');
            } catch (err) {
                console.error('Error stopping recording:', err);
                setError('خطا در توقف ضبط');
                cleanupRecording();
            }
        }
    };
    
    // اضافه کردن useEffect برای پاکسازی در هنگام unmount
    useEffect(() => {
        return () => {
            console.log('Component unmounting, cleaning up...');
            cleanupRecording();
        };
    }, []);

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
