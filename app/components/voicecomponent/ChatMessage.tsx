// ./app/components/voicecomponent/ChatMessage.tsx
"use client";

import React from 'react';
import { User, BriefcaseMedical } from 'lucide-react';
import type { ChatMessageProps } from '@/app/types';

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`
        flex items-start space-x-2 rtl:space-x-reverse max-w-2xl
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}>
                <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? 'bg-green-100' : 'bg-gray-100'}
        `}>
                    {isUser ? (
                        <User className="w-5 h-5 text-gray-500" />
                    ) : (
                        <BriefcaseMedical className="w-5 h-5 text-gray-500 " />
                    )}
                </div>

                <div className={`
          p-3 rounded-lg
          ${isUser ? 'bg-green-500 text-black' : 'bg-white border border-gray-200'}
        `}>
                    <p className="text-sm whitespace-pre-wrap" dir='rtl'>{message.content}</p>
                </div>
            </div>
        </div>
    );
}
