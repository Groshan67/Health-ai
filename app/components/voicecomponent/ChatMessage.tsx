import { FC, useState } from 'react';
import { ChatMessage as ChatMessageType } from '@/app/types';
import { format } from 'date-fns';
import Image from 'next/image';
import { faIR } from 'date-fns/locale';

interface ChatMessageProps {
    message: ChatMessageType;
}


export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

    const handleAudioPlay = (audioUrl: string) => {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsAudioPlaying(false);
        audio.play();
        setIsAudioPlaying(true);
    };

    return (
        <div
            className={`flex flex-col mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'
                }`}
        >
            <div
                className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-200 text-gray-800 mr-auto'
                    }`}
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">
                        {message.role === 'user' ? 'شما' : 'دستیار'}
                    </span>
                    <span className="text-xs opacity-75">
                        {format(new Date(message.timestamp), 'HH:mm', {
                            locale: faIR,
                        })}
                    </span>
                </div>

                {/* متن پیام */}
                <p className="text-base leading-relaxed whitespace-pre-wrap mb-2">
                    {message.content}
                </p>

                {/* نمایش تصاویر */}
                {message.attachments?.filter(att => att.type === 'image').map((attachment, index) => (
                    <div key={index} className="relative w-full h-48 mt-2 rounded-lg overflow-hidden">
                        <Image
                            src={attachment.url}
                            alt="پیوست تصویری"
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}

                {/* نمایش فایل‌های صوتی */}
                {message.attachments?.filter(att => att.type === 'audio').map((attachment, index) => (
                    <div key={index} className="mt-2">
                        <button
                            onClick={() => handleAudioPlay(attachment.url)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full ${message.role === 'user'
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        >
                            <span className="material-icons text-sm">
                                {isAudioPlaying ? 'pause' : 'play_arrow'}
                            </span>
                            پخش صدا
                        </button>
                    </div>
                ))}

                <MessageActions message={message} />
            </div>
        </div>
    );
};

// برای استفاده بهتر از انیمیشن‌ها، می‌توانیم یک نسخه با انیمیشن هم داشته باشیم
export const AnimatedChatMessage: FC<ChatMessageProps> = ({ message }) => {
    return (
        <div
            className={`flex flex-col mb-4 animate-fade-in ${message.role === 'user' ? 'items-end' : 'items-start'
                }`}
        >
            <div
                className={`max-w-[80%] rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02] ${message.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-800 mr-auto hover:bg-gray-300'
                    }`}
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">
                        {message.role === 'user' ? 'شما' : 'دستیار'}
                    </span>
                    <span className="text-xs opacity-75">
                        {format(new Date(message.timestamp), 'HH:mm - yyyy/MM/dd', {
                            locale: faIR,
                        })}
                    </span>
                </div>
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                </p>
            </div>
        </div>
    );
};

// اضافه کردن کامپوننت Loading برای نمایش وضعیت در حال تایپ
export const TypingIndicator: FC = () => {
    return (
        <div className="flex items-center gap-2 p-4 max-w-[80%] mr-auto">
            <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
            <span className="text-sm text-gray-500">در حال تایپ...</span>
        </div>
    );
};

// کامپوننت MessageActions برای اضافه کردن قابلیت‌های بیشتر به هر پیام
export const MessageActions: FC<{ message: ChatMessageType }> = ({ message }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
    };

    const handleSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(message.content);
        utterance.lang = 'fa-IR';
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={handleCopy}
                className="text-xs text-gray-500 hover:text-gray-700"
            >
                کپی متن
            </button>
            <button
                onClick={handleSpeak}
                className="text-xs text-gray-500 hover:text-gray-700"
            >
                پخش صوتی
            </button>
        </div>
    );
};

export const MessageInput: FC<{
    onSend: (content: string, attachments: File[]) => void;
}> = ({ onSend }) => {
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const audioFile = new File([blob], 'voice-message.webm', { type: 'audio/webm' });
                setAttachments(prev => [...prev, audioFile]);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() || attachments.length > 0) {
            onSend(content, attachments);
            setContent('');
            setAttachments([]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border-t">
            {/* پیش‌نمایش پیوست‌ها */}
            {attachments.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {attachments.map((file, index) => (
                        <div key={index} className="relative">
                            {file.type.startsWith('image/') ? (
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt="پیش‌نمایش"
                                    width={60}
                                    height={60}
                                    className="rounded-lg"
                                />
                            ) : (
                                <div className="w-60 h-60 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="material-icons">audio_file</span>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                />

                {/* دکمه ضبط صدا */}
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-200'
                        }`}
                >
                    <span className="material-icons">
                        {isRecording ? 'stop' : 'mic'}
                    </span>
                </button>

                {/* دکمه آپلود فایل */}
                <label className="p-2 bg-gray-200 rounded-full cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAttachmentChange}
                        className="hidden"
                        multiple
                    />
                    <span className="material-icons">attach_file</span>
                </label>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    ارسال
                </button>
            </div>
        </form>
    );
};

