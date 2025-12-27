'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I\'m SwasthyaSense AI. I can help you understand hospital predictions, AQI impacts, and resource planning. How can I assist you today?',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    context: 'Hospital resource management dashboard'
                }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.message || data.error || 'Sorry, I couldn\'t process that request.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                role: 'assistant',
                content: 'I apologize, but I encountered a connection error. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-16 w-16 rounded-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-2xl transition-all duration-300 hover:scale-110"
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <div className="relative">
                            <Bot className="h-6 w-6" />
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="h-3 w-3 text-yellow-400" />
                            </motion.div>
                        </div>
                    )}
                </Button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-24 right-6 z-50 w-96"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Card className="border-2 border-black dark:border-white bg-white dark:bg-black shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b-2 border-black dark:border-white bg-black dark:bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white dark:text-black">SwasthyaSense AI</h3>
                                        <p className="text-xs text-gray-300 dark:text-gray-700">Powered by Gemini</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="p-2 rounded-lg bg-black dark:bg-white flex-shrink-0">
                                                <Bot className="h-4 w-4 text-white dark:text-black" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[75%] p-3 rounded-2xl ${msg.role === 'user'
                                                    ? 'bg-black dark:bg-white text-white dark:text-black'
                                                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-black dark:border-white'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            <p className="text-xs opacity-50 mt-1">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="p-2 rounded-lg bg-black dark:bg-white flex-shrink-0">
                                                <User className="h-4 w-4 text-white dark:text-black" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-3"
                                    >
                                        <div className="p-2 rounded-lg bg-black dark:bg-white">
                                            <Bot className="h-4 w-4 text-white dark:text-black" />
                                        </div>
                                        <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-2xl border border-black dark:border-white">
                                            <div className="flex gap-1">
                                                <motion.div
                                                    className="w-2 h-2 bg-black dark:bg-white rounded-full"
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-black dark:bg-white rounded-full"
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-black dark:bg-white rounded-full"
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t-2 border-black dark:border-white bg-white dark:bg-black">
                                <div className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Ask me anything..."
                                        className="flex-1 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        disabled={isLoading || !input.trim()}
                                        className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
