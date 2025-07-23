"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./chat.module.css";
import WeatherWidget from "@/app/components/weather-widget";
import { ResponseDisplay } from "@/app/components/ResponseDisplay";
import { InputForm } from "@/app/components/InputForm";
import { Skeleton } from "@/app/components/Skeleton";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: "user" | "assistant";
  image?: string | null;
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

  const addMessage = (content: string, type: "user" | "assistant", image: string | null = null) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type,
      image,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const sendMessage = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const messageText = state.text;
    const imageFile = state.image;
    const currentHistory = [...state.messages];

    let imageBase64 = null;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          imageBase64 = reader.result?.toString() ?? null;
          resolve();
        };
      });
    }

    addMessage(messageText, "user", imageBase64);

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: currentHistory,
          newMessage: {
            text: messageText,
            image: imageBase64,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tempMessageId = Date.now().toString();
      let accumulatedContent = "";

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, {
          id: tempMessageId,
          content: "",
          timestamp: new Date(),
          type: "assistant",
        }],
      }));

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          accumulatedContent += chunk;

          setState((prev) => ({
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === tempMessageId ? { ...msg, content: accumulatedContent } : msg
            ),
          }));
        }
      }

      setState((prev) => ({
        ...prev,
        text: "",
        loading: false,
        image: null,
        fileName: null,
      }));
    } catch (error) {
      console.error("Error:", error);
      addMessage("خطا در دریافت پاسخ.", "assistant");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setState((prev) => ({
        ...prev,
        image: e.target.files![0],
        fileName: e.target.files![0].name,
        uploading: true,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!state.text.trim() && !state.image) return;
    await sendMessage();
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
              image={message.image}
            />
          ))}

          {state.loading && <Skeleton />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <InputForm
        text={state.text}
        setText={(newText: string) => setState((prev) => ({ ...prev, text: newText }))}
        handleSubmit={handleSubmit}
        handleImageUpload={handleImageUpload}
        fileName={state.fileName}
        loading={state.loading}
      />
    </div>
  );
};

export default Chat;
