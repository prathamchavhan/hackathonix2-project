import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

// Initialize the Groq client. It will automatically use process.env.GROQ_API_KEY
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic || !topic.trim()) {
            return NextResponse.json({ detail: "Topic cannot be empty" }, { status: 400 });
        }

        const prompt = `Generate 10 catchy, SEO-optimized blog titles for the topic: '${topic}'.\nReturn ONLY a raw JSON format output containing a single object with a key 'titles' which contains an array of the 10 title strings. Do not include any extra text, markdown formatting like \`\`\`json, or explanations. Just the JSON object.`;

        const chatCompletion = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert SEO copywriter. You only reply with strictly formatted JSON."
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            response_format: { type: "json_object" },
        });

        const content = chatCompletion.choices[0]?.message?.content;
        let result;

        if (content) {
            try {
                result = JSON.parse(content);
            } catch {
                console.error("Failed to parse Groq response:", content);
                throw new Error("Invalid JSON from AI");
            }
        } else {
            throw new Error("Empty response from AI");
        }

        // Ensure it has the correct form
        if (!result.titles) {
            const values = Object.values(result);
            result = { titles: Array.isArray(values[0]) && values[0].length > 0 ? values[0] : [] };
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Generate API Error:", error);
        return NextResponse.json({ detail: "Failed to generate titles" }, { status: 500 });
    }
}
