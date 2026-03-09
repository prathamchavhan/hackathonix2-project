<div align="center">

```
╔═══════════════════════════════════════════╗
║                                           ║
║      ✦  AI BLOG & TITLE Generator Assistant  ✦       ║
║                                           ║
╚═══════════════════════════════════════════╝
```

**Generate captivating blog titles with your voice — powered by AI.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-hackathonix2--project.vercel.app-black?style=for-the-badge)](https://hackathonix2-project.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Groq](https://img.shields.io/badge/Groq_API-black?style=for-the-badge&logo=groq)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✦ What It Does

> Speak a topic. Get scroll-stopping blog titles — instantly.

A hackathon project built for **Hackathonix 2**. Just speak into your mic or type a topic, and the app uses the **Groq API** to generate creative, SEO-friendly blog titles in milliseconds.

No fluff. Just results.

---

## ✦ Features

```
  ◈  🎙  Voice assistant — speak your topic, no typing needed
  ◈  🤖  AI-powered blog title generation via Groq API
  ◈  💬  Interactive chat interface for title suggestions
  ◈  ⚡  Ultra-fast inference — Groq runs at 500+ tokens/sec
  ◈  🔊  Text-to-speech — AI reads titles back to you
  ◈  🛡  Serverless Next.js API routes
  ◈  🔷  Built with TypeScript for type-safe reliability
  ◈  🎨  Clean, distraction-free UI
```

---

## ✦ Voice Assistant

The built-in voice assistant lets you go **completely hands-free**:

```
  1.  Click the mic button  🎙
  2.  Speak your blog topic
  3.  AI generates titles instantly
  4.  Titles are read back to you via text-to-speech
```

Powered by the **Web Speech API** (speech recognition + synthesis) — no extra setup needed, works right in the browser.

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (TSX) |
| AI Inference | Groq API |
| LLM Model | LLaMA 3 via Groq |
| Voice Input | Web Speech API (SpeechRecognition) |
| Voice Output | Web Speech API (SpeechSynthesis) |
| Styling | CSS |
| Deployment | Vercel |

---

## ✦ Why Groq?

Groq's LPU (Language Processing Unit) delivers inference speeds far beyond traditional GPUs — making title generation feel **instant**, not delayed. Perfect for a real-time voice-powered tool like this.

---

## ✦ Project Structure

```
hackathonix2-project/
│
├── frontend/
│   └── src/
│       └── app/
│           ├── page.tsx          ← Main UI + Voice Assistant
│           ├── layout.tsx        ← Root layout
│           └── api/
│               ├── chat/
│               │   └── route.ts  ← Chat endpoint (Groq)
│               └── generate/
│                   └── route.ts  ← Title generation (Groq)
│
└── README.md
```

---

## ✦ Getting Started

**1. Clone the repo**
```bash
git clone https://github.com/prathamchavhan/hackathonix2-project.git
cd hackathonix2-project/frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Add your API key**

Create a `.env.local` file inside `frontend/`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

> Get your free Groq API key at [console.groq.com](https://console.groq.com)

**4. Run locally**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start generating. ✦

> 💡 Allow microphone access in your browser to use the voice assistant.

---

## ✦ Deploy on Vercel

1. Push to GitHub
2. Import project at [vercel.com]([https://vercel.com)](https://hackathonix2-project.vercel.app/)
3. Set **Root Directory** → `frontend`
4. Add `GROQ_API_KEY` in **Settings → Environment Variables**
5. Hit Deploy 🚀

---

## ✦ API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/generate` | `POST` | Generate blog titles from a topic |
| `/api/chat` | `POST` | Chat-based title brainstorming |

**Example request:**
```json
POST /api/generate
{
  "topic": "productivity hacks for developers"
}
```

**Example response:**
```json
{
  "titles": [
    "10 Productivity Hacks Every Developer Swears By",
    "Stop Wasting Time: The Developer's Guide to Deep Work",
    "How I Doubled My Output Without Writing More Code"
  ]
}
```

---

## ✦ Built At

```
  ╔══════════════════════════╗
  ║   Hackathonix 2  ·  2025 ║
  ╚══════════════════════════╝
```

---

<div align="center">

```
─────────────────────────────────────
    Built with ❤  for  Hackathonix 2
─────────────────────────────────────
```

⭐ Star this repo if you found it useful!

</div>

