import { VoiceChat } from '@/app/components/voicecomponent/VoiceChat';

export default function Home() {
    return (
        <main className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">
                    دستیار صوتی هوشمند
                </h1>
                <VoiceChat />
            </div>
        </main>
    );
}
