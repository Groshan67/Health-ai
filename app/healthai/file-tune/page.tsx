"use client";


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
        setUploading(false);

        try {
            // اگر تصویر وجود دارد، آن را به base64 تبدیل می‌کنیم
            if (image) {
                const reader = new FileReader();
                reader.onload = async () => {
                    await sendRequest(reader.result?.toString());
                };
                reader.readAsDataURL(image);
            } else {
                // اگر فقط متن داریم، مستقیماً درخواست را ارسال می‌کنیم
                await sendRequest(null);
            }
        } catch (error: any) {
            console.error("Error:", error);
            alert("خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.");
            setLoading(false);
        }
    };

    // تابع کمکی برای ارسال درخواست
    const sendRequest = async (imageBase64: string | null) => {
        try {
            const res = await fetch(`/api/completion/`, {
                method: "POST",
                body: JSON.stringify({ text, imageBase64 })
            });
            const data = await res.json();
            setResponse(data);
        } finally {
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
                    <ResponseDisplay type={'user'} image="" response={response} loading={loading} />
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
