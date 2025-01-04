export const uploadFile = async (file: File): Promise<string> => {
    // این تابع باید پیاده‌سازی شود
    // می‌توانید از سرویس‌هایی مثل AWS S3، Cloudinary یا Firebase Storage استفاده کنید
    // در اینجا یک نمونه ساده با localStorage نشان داده شده است
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // در محیط واقعی، این داده باید در سرور ذخیره شود
            resolve(base64String);
        };
        reader.readAsDataURL(file);
    });
};
