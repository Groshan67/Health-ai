import { VoiceChat } from '@/app/components/voicecomponent/VoiceChat';
import WeatherWidget from "@/app/components/weather-widget";

export default function Home() {
    return (
        <main className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-center mb-8">
                    <WeatherWidget />
                </h1>
                <div className="w-full">
                    <VoiceChat />
                </div>
            </div>
        </main>
    );
}
