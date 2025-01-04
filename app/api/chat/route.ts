import { NextResponse } from 'next/server';
import { createChatCompletion } from '@/app/lib/openai';
import { openai } from '@/app/openai';

export async function POST(request) {
    if (request.method !== 'POST') {
        return request.status(405).json({ error: 'متد درخواستی مجاز نیست' });
    }

    try {
        const { audioData } = request.body;

        if (!audioData) {
            return request.status(400).json({ error: 'داده صوتی یافت نشد' });
        }

        // تبدیل داده‌های base64 به بافر
        const buffer = Buffer.from(audioData.split(',')[1], 'base64');

        // ایجاد فایل موقت
        const tempFile = new File([buffer], 'audio.mp3', {
            type: 'audio/mp3'
        });

        const transcription = await openai.audio.transcriptions.create({
            file: tempFile,
            model: 'whisper-1',
            language: 'fa', // زبان فارسی
            response_format: 'text'
        });


        return NextResponse.json({
            response: transcription

        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
