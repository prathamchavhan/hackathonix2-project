"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Send, User, Bot, X } from "lucide-react";
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

export default function ChatInterface({ topic, selectedTitle, onClose }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: `Hi! I generated the title: "${selectedTitle}". What would you like to know about it? I can explain its SEO benefits or help you brainstorm an outline!`
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom whenever messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        // Entry animation
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
            );
        }
    }, []);

    const handleClose = () => {
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

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Send the history (excluding the first mock greeting) plus the new user message
            const historyToSent = [...messages.slice(1), userMsg].map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch("http://localhost:8000/chat", {
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
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);

        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I ran into an error getting your response." }]);
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
                    <div className="bg-indigo-100 p-2 rounded-full">
                        <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800">Title Assistant</CardTitle>
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
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about this title..."
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
