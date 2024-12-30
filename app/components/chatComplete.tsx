"use client";
import React, { useState } from "react";
import styles from "./chat.module.css";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import WeatherWidget from "@/app/components/weather-widget";
import { ResponseDisplay } from "@/app/components/ResponseDisplay";
import { InputForm } from "@/app/components/InputForm";
import { Skeleton } from "@/app/components/Skeleton"; // افزودن کامپوننت Skeleton

type ChatProps = {
  functionCallHandler?: (toolCall: RequiredActionFunctionToolCall) => Promise<string>;
};

const Chat = ({ functionCallHandler = () => Promise.resolve("") }: ChatProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const sendMessage = async (messages: any) => {
    setLoading(true);
    try {
      const responses = await fetch(`/api/completion/`, {
        method: "POST",
        body: JSON.stringify({ content: messages }),
      });

      const contentType = responses.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await responses.json();
        setResponse(data);
      } else {
        console.error("Unexpected response type:", contentType);
        setResponse("Failed to get valid JSON response.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error fetching response.");
    } finally {
      setLoading(false); // Ensure loading is set to false after the request is complete
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setUploading(true); // نمایش پیام آپلود برای فایل جدید
    }
  };

  const handleSubmits = async () => {
    try {
      if (!text.trim()) return; // If no text entered, return early
      setUploading(false); // Disable uploading state once message starts to send

      if (image) {
        const reader = new FileReader();
        reader.onload = async () => {
          const imageBase64 = reader.result?.toString() ?? '';
          // Now that imageBase64 is ready, send the message
          await sendMessage([imageBase64, text]);
        };
        reader.readAsDataURL(image); // Read image as base64
      } else {
        // If no image, send only the text
        await sendMessage([text]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-white">
      <div className={styles.column}>
        <WeatherWidget />
        {loading ? (
          <Skeleton /> // نمایش Skeleton در هنگام بارگذاری
        ) : (
          <ResponseDisplay response={response} loading={loading} />
        )}
      </div>

      <InputForm
        text={text}
        setText={setText}
        handleSubmit={handleSubmits}
        handleImageUpload={handleImageUpload}
        fileName={fileName}
        loading={uploading} // ارسال وضعیت آپلود به کامپوننت InputForm
      />
    </div>
  );
};

export default Chat;
