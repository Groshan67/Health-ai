"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./chat.module.css";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import WeatherWidget from "@/app/components/weather-widget";
import { ResponseDisplay } from "@/app/components/ResponseDisplay";
import { InputForm } from "@/app/components/InputForm";
import { Skeleton } from "@/app/components/Skeleton";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'assistant';
}

interface ChatState {
  text: string;
  image: File | null;
  fileName: string | null;
  loading: boolean;
  uploading: boolean;
  messages: ChatMessage[];
}

const initialState: ChatState = {
  text: "",
  image: null,
  fileName: null,
  loading: false,
  uploading: false,
  messages: [],
};


const Chat = () => {
  const [state, setState] = useState<ChatState>(initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const addMessage = (content: string, type: 'user' | 'assistant') => {

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],

    }));
  };

  const sendMessage = async (messages: any) => {
    setState(prev => ({ ...prev, loading: true }));

    // Add user message to chat
    addMessage(state.text, 'user');

    try {
      const response = await fetch('/api/simple', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // ایجاد یک ID موقت برای پیام در حال دریافت
      const tempMessageId = Date.now().toString();
      let accumulatedContent = '';

      // ایجاد یک پیام خالی برای assistant
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: tempMessageId,
          content: '',
          timestamp: new Date(),
          type: 'assistant'
        }]
      }));

      // خواندن و پردازش stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // تبدیل chunk به متن
          const chunk = decoder.decode(value);
          accumulatedContent += chunk;

          // بروزرسانی پیام assistant با محتوای جدید
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === tempMessageId
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          }));
        }
      }

      // پاکسازی state پس از اتمام
      setState(prev => ({
        ...prev,
        text: "",
        loading: false,
        image: null,
        fileName: null,
      }));

    } catch (error) {
      console.error("Error:", error);
      addMessage("Error fetching response.", 'assistant');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setState(prev => ({
        ...prev,
        image: e.target.files![0],
        fileName: e.target.files![0].name,
        uploading: true,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!state.text.trim()) return;

    try {
      setState(prev => ({ ...prev, uploading: false }));

      if (state.image) {
        const reader = new FileReader();
        reader.onload = async () => {
          const imageBase64 = reader.result?.toString() ?? '';
          await sendMessage([imageBase64, state.text]);
        };
        reader.readAsDataURL(state.image);
      } else {
        await sendMessage([state.text]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.");
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start bg-white">
      <div className={styles.column}>
        <WeatherWidget />
        <div className="flex flex-col space-y-4 overflow-y-auto max-h-[70vh] p-4">
          {state.messages.map((message) => (
            <ResponseDisplay
              key={message.id}
              response={message.content}
              loading={false}
              type={message.type}
            />
          ))}

          {/* Show skeleton only when loading */}
          {state.loading && (
            <>
              <Skeleton /> {/* You can show multiple skeletons to indicate longer response */}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <InputForm
        text={state.text}
        setText={(newText: string) => setState(prev => ({ ...prev, text: newText }))}
        handleSubmit={handleSubmit}
        handleImageUpload={handleImageUpload}
        fileName={state.fileName}
        loading={state.loading}
      />
    </div>
  );
};

export default Chat;
