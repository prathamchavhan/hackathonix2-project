"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Copy, Loader2, Sparkles, Check, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ChatInterface from "./chat-interface";

export default function Generator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setTitles(data.titles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center" ref={containerRef}>
      <Card className="">
        <Card className="bg-transparent ">
          <CardHeader className="text-center space-y-4 pb-8">

            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>

            <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
              AI Blog Title Generator
            </CardTitle>

            <CardDescription className="text-lg text-gray-200">
              Enter a topic and let AI generate 10 catchy, SEO-optimized blog titles for your next big post.
            </CardDescription>

          </CardHeader>
        </Card>
        <CardContent>
          <form onSubmit={handleGenerate} className="flex flex-col space-y-4">
            <div className="flex gap-2 relative group">
              <Input
                placeholder="e.g., The Future of Artificial Intelligence..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-14 text-lg border-primary/30 focus-visible:ring-primary transition-all duration-300 shadow-inner rounded-xl"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !topic.trim()}
              className="h-14 text-lg font-semibold rounded-xl w-full group overflow-hidden relative"
              onMouseEnter={(e) => {
                if (!loading) {
                  gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2, ease: "power1.out" });
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power1.out" });
                }
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Titles
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="justify-center items-center flex text-destructive mt-4 font-medium">
              Error: {error}
            </div>
          )}
        </CardContent>

        {titles.length > 0 && (
          <div className="w-full">
            <Separator className="my-2 bg-primary/20" />
            <CardFooter className="flex flex-col items-stretch pt-6" ref={resultsRef}>
              <h3 className="text-xl font-bold mb-4 flex items-center text-primary">
                Your Generated Titles
              </h3>
              <div className="space-y-3 w-full">
                {titles.map((title, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 shadow-sm
                      ${selectedTitle === title ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-primary/20 bg-background/60 hover:bg-background'}
                    `}
                  >
                    <span className="font-medium pr-4 select-all text-slate-800">{title}</span>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChatClick(title)}
                        className={`transition-colors ${selectedTitle === title ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                        title="Chat about this title"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(title, index)}
                        className="text-slate-400 hover:text-primary transition-colors hover:bg-primary/5"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardFooter>
          </div>
        )}
      </Card>

      {/* Render Chat Interface when a title is selected */}
      {selectedTitle && (
        <ChatInterface
          topic={topic}
          selectedTitle={selectedTitle}
          onClose={() => setSelectedTitle(null)}
        />
      )}
    </div>
  );
}
