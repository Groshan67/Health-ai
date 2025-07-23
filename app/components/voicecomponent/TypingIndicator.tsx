// ./app/components/voicecomponent/TypingIndicator.tsx
"use client";

import { FC } from 'react';

export const TypingIndicator: FC = () => {
    return (
        <div className="flex items-center space-x-2 p-4" dir='rtl' >
            <span className="text-sm text-gray-500"> در حال تایپ </span>
            <div className="flex space-x-1 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>

        </div>
    );
};
