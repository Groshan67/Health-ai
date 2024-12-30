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
    handleSubmit: (text: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileName: string | null;
    loading: boolean;
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(text);
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
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 pr-20 pl-16 rounded-lg text-sm placeholder-gray-400 focus:ring focus:ring-gray-200"
                    dir="rtl"
                />

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

                    {fileName && (
                        <p className="mt-1 text-xs text-gray-600">{fileName}</p>
                    )}

                    {loading && (
                        <p className="mt-1 text-xs text-green-500 animate-pulse">
                            در حال آپلود...
                        </p>
                    )}
                </div>

                <button
                    onClick={() => handleSubmit(text)}
                    className="text-green-500 hover:text-green-600"
                    disabled={loading || !text.trim()}
                >
                    <AiOutlineSend className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
