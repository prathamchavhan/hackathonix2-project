import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { topic, title, messages } = await req.json();

        if (!title || !title.trim()) {
            return NextResponse.json({ detail: "Title cannot be empty" }, { status: 400 });
        }

        const systemPrompt = `You are an expert SEO copywriter and blog strategist. The user is writing a blog post about '${topic}' and is considering using the title '${title}'. Your job is to answer their questions about this title, explain why it's good for SEO, or help them outline the post.`;

        const apiMessages: { role: "system" | "user" | "assistant"; content: string }[] = [{ role: "system", content: systemPrompt }];

        // Append chat history
        if (messages && Array.isArray(messages)) {
            for (const msg of messages) {
                apiMessages.push({ role: msg.role, content: msg.content });
            }
        }

        const chatCompletion = await client.chat.completions.create({
            messages: apiMessages,
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
        });

        const replyContent = chatCompletion.choices[0]?.message?.content;

        return NextResponse.json({ reply: replyContent });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ detail: "Failed to chat with AI" }, { status: 500 });
    }
}
