import { AiOutlineSend, AiOutlinePaperClip } from "react-icons/ai";

export const InputForm = ({
    text,
    setText,
    handleSubmit,
    handleImageUpload,
    fileName,
    loading,
}: {
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: () => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileName: string | null;
    loading: boolean;
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // جلوگیری از رفتن به خط بعد
            handleSubmit();
        }
    };

    return (
        <div className="w-full bg-white max-w-5xl rounded-lg p-6 fixed bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white rounded-lg shadow-lg">
                <input
                    type="text"
                    placeholder="سوال خود را اینجا بپرسید..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown} // اضافه کردن رویداد برای دکمه Enter
                    className="w-full p-3 pr-20 pl-16 rounded-lg text-sm placeholder-gray-400 focus:ring focus:ring-gray-200"
                    dir="rtl"
                />

                {/* آپلود فایل */}
                <div className="relative">
                    <label className="cursor-pointer">
                        <AiOutlinePaperClip className="w-6 h-6 text-gray-500 hover:text-green-500" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>

                    {/* نمایش نام فایل آپلودشده */}
                    {fileName && (
                        <p className="mt-1 text-xs text-gray-600">{fileName}</p>
                    )}

                    {/* نمایش وضعیت بارگذاری */}
                    {loading && (
                        <p className="mt-1 text-xs text-green-500 animate-pulse">
                            در حال آپلود...
                        </p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="text-green-500 hover:text-green-600"
                >
                    <AiOutlineSend className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
