import { AiOutlinePaperClip } from "react-icons/ai";

export const FileUpload = ({ handleImageUpload }: { handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <label className="cursor-pointer relative">
        <AiOutlinePaperClip className="w-6 h-6 text-gray-500 hover:text-green-500" />
        <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
        />
    </label>
);


