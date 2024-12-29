"use client";

import axios from "axios";
import React, { useState } from "react";
import styles from "./page.module.css";

import WeatherWidget from "../../components/weather-widget";
import { ResponseDisplay } from "@/app/components/ResponseDisplay";
import { InputForm } from "@/app/components/InputForm";
import { Skeleton } from "@/app/components/Skeleton"; // افزودن کامپوننت Skeleton

export default function Home() {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [fileName, setFileName] = useState<string | null>(null); // ذخیره نام فایل
    const [uploading, setUploading] = useState(false); // مدیریت وضعیت آپلود

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setFileName(e.target.files[0].name);
            setUploading(true); // نمایش پیام آپلود برای فایل جدید
        }
    };

    const handleSubmit = async () => {
        if (!text && !image) {
            alert("لطفاً متنی وارد کرده یا یک تصویر پیوست کنید.");
            return;
        }

        setLoading(true);
        setUploading(false); // وقتی ارسال شروع شد، پیام آپلود غیرفعال می‌شود

        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const imageBase64 = image ? reader.result?.toString() : null;
                console.log("imageBase64", imageBase64);
                const { data } = await axios.post(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        model: "gpt-4o",
                        messages: [
                            {
                                role: "system",
                                content:
                                    "You are a highly experienced specialist doctor tasked with diagnosing patients based on the information they provide. The patient will share the following details: age, gender, medical history, and key symptoms. They may also upload medical images such as blood test results, ECGs, echocardiograms, X-rays, or ultrasounds.Your task is to carefully analyze the provided information and images to determine the patient's potential illness and offer appropriate recommendations. If necessary, suggest that the patient consult a specific specialist or undergo additional tests.",
                            },
                            {
                                role: "user",
                                content: [
                                    { type: "text", text },
                                    ...(imageBase64
                                        ? [{ type: "image_url", image_url: { url: imageBase64 } }]
                                        : []),
                                ],
                            },
                        ],
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                        },
                    }
                );

                setResponse(data);
                setLoading(false);
            };

            if (image) reader.readAsDataURL(image);
            else reader.onload();
        } catch (error: any) {
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
                handleSubmit={handleSubmit}
                handleImageUpload={handleImageUpload}
                fileName={fileName}
                loading={uploading} // ارسال وضعیت آپلود به کامپوننت InputForm
            />
        </div>
    );
}
