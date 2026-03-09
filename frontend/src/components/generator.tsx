"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Copy, Loader2, Sparkles, Check, MessageCircle, Plus, Lock, ArrowUp, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import ChatInterface from "./chat-interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomWindow = typeof window !== 'undefined' ? (window as unknown as any) : null;
const SpeechRecognition = CustomWindow ? (CustomWindow.SpeechRecognition || CustomWindow.webkitSpeechRecognition) : null;

export default function Generator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Voice agent effect
  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const transcript = event.results[0][0].transcript;
        setTopic((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("Speech recognition error", event);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Initial fade-in animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  // Animation for generating results
  useEffect(() => {
    if (titles.length > 0 && resultsRef.current) {
      const children = gsap.utils.toArray(resultsRef.current.children);
      gsap.fromTo(
        children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [titles]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setTitles([]);
    setSelectedTitle(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate titles");
      }

      const data = await response.json();
      const newTitles = data.titles || [];
      setTitles(newTitles);

      if (newTitles.length > 0) {
        speakText(`I have generated ${newTitles.length} titles for you.`);
      } else {
        speakText("Sorry, I couldn't generate any titles.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      speakText("Sorry, an error occurred while generating titles.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleChatClick = (title: string) => {
    setSelectedTitle(title);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]" ref={containerRef}>

      <div className="mb-8 space-y-4 text-center mt-12 w-full">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md">
          AI Blog Title Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-200/90 max-w-2xl mx-auto font-medium drop-shadow-sm">
          Enter a topic and let AI generate 10 catchy, SEO-optimized blog titles for your next big post.
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <div className="w-full bg-white rounded-[2rem] p-2 shadow-2xl flex flex-col relative transition-all duration-300">
          <textarea
            placeholder={isListening ? "Listening... Speak now" : "Ask me about title..."}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full min-h-[140px] px-6 py-5 text-slate-800 text-xl font-medium placeholder:text-gray-400 placeholder:font-normal bg-transparent border-none focus:outline-none focus:ring-0 resize-none rounded-t-3xl"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />

          <div className="flex items-center justify-between px-4 pb-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative flex items-center justify-center"
                onClick={() => document.getElementById('file-upload')?.click()}
                title="Insert Docs"
              >
                <Plus className="w-6 h-6 text-gray-500" strokeWidth={2.5} />
                <input type="file" id="file-upload" className="hidden" multiple />
              </button>

              <button
                type="button"
                className={`p-2 rounded-full transition-colors relative flex items-center justify-center ${isListening ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'hover:bg-gray-100 text-gray-500'}`}
                onClick={toggleListening}
                title={isListening ? "Stop Listening" : "Start Voice Typing"}
              >
                {isListening ? (
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <MicOff className="relative inline-flex h-5 w-5" />
                  </span>
                ) : (
                  <Mic className="w-6 h-6" strokeWidth={2.5} />
                )}
              </button>

              <button
                type="button"
                className={`p-2 rounded-full transition-colors relative flex items-center justify-center hover:bg-gray-100 ${voiceEnabled ? 'text-indigo-500' : 'text-gray-400'}`}
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                }}
                title={voiceEnabled ? "Mute Voice Assistant" : "Enable Voice Assistant"}
              >
                {voiceEnabled ? <Volume2 className="w-6 h-6" strokeWidth={2.5} /> : <VolumeX className="w-6 h-6" strokeWidth={2.5} />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Privacy options">
                <Lock className="w-[22px] h-[22px] text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={loading || !topic.trim()}
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center h-10 w-10 
                  ${(loading || !topic.trim()) ? 'bg-gray-100' : 'bg-black hover:bg-gray-800'}`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <ArrowUp className={`w-5 h-5 ${!topic.trim() ? 'text-gray-300' : 'text-white'}`} strokeWidth={3} />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-center mt-6 text-red-300 bg-red-900/30 backdrop-blur-md p-3 rounded-lg border border-red-500/30">
            Error: {error}
          </div>
        )}

        {titles.length > 0 && (
          <div className="mt-12 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl overflow-hidden border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-slate-800">
              <Sparkles className="mr-2 text-indigo-500" />
              Your Generated Titles
            </h3>
            <div className="space-y-3 w-full" ref={resultsRef}>
              {titles.map((title, index) => (
                <div
                  key={index}
                  className={`flex items-start md:items-center justify-between p-4 rounded-xl border transition-all duration-300 shadow-sm
                    ${selectedTitle === title ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'}
                  `}
                >
                  <span className="font-medium pr-4 select-all text-slate-800 leading-relaxed">{title}</span>
                  <div className="flex gap-2 shrink-0 mt-2 md:mt-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleChatClick(title)}
                      className={`transition-colors rounded-full ${selectedTitle === title ? 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                      title="Chat about this title"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(title, index)}
                      className="text-slate-400 hover:text-slate-800 transition-colors hover:bg-slate-100 rounded-full"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render Chat Interface when a title is selected */}
        {selectedTitle && (
          <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <ChatInterface
              topic={topic}
              selectedTitle={selectedTitle}
              onClose={() => setSelectedTitle(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
