import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatSession } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';

interface ChatStore {
    currentSession: ChatSession | null;
    sessions: ChatSession[];
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    createNewSession: () => void;
    switchSession: (sessionId: string) => void;
}

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            currentSession: null,
            sessions: [],

            addMessage: (message) => {
                set((state) => {
                    if (!state.currentSession) {
                        const newSession = {
                            id: uuidv4(),
                            messages: [],
                        };
                        state.sessions.push(newSession);
                        state.currentSession = newSession;
                    }

                    const newMessage: ChatMessage = {
                        id: uuidv4(),
                        ...message,
                        timestamp: new Date(),
                    };

                    state.currentSession.messages.push(newMessage);

                    return {
                        currentSession: state.currentSession,
                        sessions: [...state.sessions],
                    };
                });
            },

            createNewSession: () => {
                set((state) => ({
                    currentSession: {
                        id: uuidv4(),
                        messages: [],
                    },
                    sessions: [...state.sessions, state.currentSession],
                }));
            },

            switchSession: (sessionId) => {
                set((state) => ({
                    currentSession: state.sessions.find((s) => s.id === sessionId) || null,
                }));
            },
        }),
        {
            name: 'chat-store',
        }
    )
);
