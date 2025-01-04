import { useState, useRef } from 'react';

interface AudioRecorderProps {
    onAudioRecorded: (audio: Blob) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                onAudioRecorded(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="audio-recorder">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`record-button ${isRecording ? 'recording' : ''}`}
            >
                {isRecording ? 'توقف ضبط' : 'شروع ضبط'}
            </button>
        </div>
    );
};
