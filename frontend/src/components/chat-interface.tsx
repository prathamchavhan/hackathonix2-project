/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { Send, User, Bot, X, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type Message = {
    role: "user" | "assistant";
    content: string;
};

interface ChatInterfaceProps {
    topic: string;
    selectedTitle: string;
    onClose: () => void;
}

// Custom typings for the Web Speech API since standard DOM typings can be flaky with Next.js strict mode
interface IWindow extends Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
}
const CustomWindow = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
const SpeechRecognition = CustomWindow ? (CustomWindow.SpeechRecognition || CustomWindow.webkitSpeechRecognition) : null;

export default function ChatInterface({ topic, selectedTitle, onClose }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: `Hi! I generated the title: "${selectedTitle}". What would you like to know about it? I can explain its SEO benefits or help you brainstorm an outline!`
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // Voice Agent States
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true); // Auto-read enabled by default

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<unknown>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            (recognitionRef.current as any).continuous = false;
            (recognitionRef.current as any).interimResults = false;

            (recognitionRef.current as any).onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev ? `${prev} ${transcript}` : transcript);
                setIsListening(false);
            };

            (recognitionRef.current as any).onerror = (event: any) => {
                console.error("Speech recognition error", event);
                setIsListening(false);
            };

            (recognitionRef.current as any).onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Cleanup SpeechSynthesis on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Entry animation
    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
            );
        }
    }, []);

    const handleClose = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();

        if (containerRef.current) {
            gsap.to(containerRef.current, {
                opacity: 0,
                y: 20,
                scale: 0.95,
                duration: 0.3,
                ease: "power2.in",
                onComplete: onClose
            });
        } else {
            onClose();
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in your browser. Please try Chrome.");
            return;
        }

        if (isListening) {
            (recognitionRef.current as any).stop();
        } else {
            // Cancel any ongoing speech synthesis so it doesn't transcribe itself
            if (window.speechSynthesis) window.speechSynthesis.cancel();

            (recognitionRef.current as any).start();
            setIsListening(true);
        }
    };

    const speakText = useCallback((text: string) => {
        if (!voiceEnabled || !window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [voiceEnabled]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        // Cancel speech if user sends something new
        if (window.speechSynthesis) window.speechSynthesis.cancel();

        const userMsg: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const historyToSent = [...messages.slice(1), userMsg].map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic,
                    title: selectedTitle,
                    messages: historyToSent
                })
            });

            if (!res.ok) throw new Error("Failed to get response");

            const data = await res.json();
            const reply = data.reply;

            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
            speakText(reply);

        } catch {
            const errorMsg = "Sorry, I ran into an error getting your response.";
            setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
            speakText(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            ref={containerRef}
            className="w-full mt-6 border-2 border-indigo-200 shadow-xl bg-white overflow-hidden flex flex-col h-[500px]"
        >
            <CardHeader className="bg-indigo-50/50 py-3 px-4 flex flex-row items-center justify-between border-b space-y-0">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 p-2 rounded-full relative">
                        <Bot className="w-5 h-5 text-indigo-600" />
                        {isSpeaking && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                        )}
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Title Assistant
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 rounded-full hover:bg-indigo-200/50"
                                onClick={() => {
                                    setVoiceEnabled(!voiceEnabled);
                                    if (voiceEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                                }}
                                title={voiceEnabled ? "Mute Bot Voice" : "Enable Bot Voice"}
                            >
                                {voiceEnabled ? <Volume2 className="h-3 w-3 text-indigo-600" /> : <VolumeX className="h-3 w-3 text-slate-400" />}
                            </Button>
                        </CardTitle>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs block">
                            Discussing: {selectedTitle}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-slate-200/50">
                    <X className="w-5 h-5 text-slate-500" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        <div className={`p-2 rounded-full shrink-0 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-indigo-100 text-indigo-700"
                            }`}>
                            {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm shadow-sm ${message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                            }`}>
                            {message.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full shrink-0 bg-indigo-100 text-indigo-700">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </CardContent>

            <Separator />

            <CardFooter className="p-3 bg-white">
                <form onSubmit={handleSend} className="flex w-full gap-2 items-center">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={`rounded-full shrink-0 border-transparent shadow-none transition-colors ${isListening ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        onClick={toggleListening}
                        title={isListening ? "Stop listening" : "Start speaking"}
                    >
                        {isListening ? (
                            <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <MicOff className="relative inline-flex h-4 w-4" />
                            </span>
                        ) : (
                            <Mic className="h-4 w-4" />
                        )}
                    </Button>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Ask about this title..."}
                        className="flex-1 rounded-full bg-slate-100/50 border-transparent focus-visible:ring-indigo-300 shadow-none px-4"
                        autoFocus
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || loading}
                        className="rounded-full shadow-md shrink-0 bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
