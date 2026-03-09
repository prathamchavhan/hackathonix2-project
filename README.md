<div align="center">

```
╔═══════════════════════════════════════════╗
║                                           ║
║      ✦  AI BLOG TITLE GENERATOR  ✦       ║
║                                           ║
╚═══════════════════════════════════════════╝
```

**Generate captivating blog titles in seconds — powered by AI.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-hackathonix2--project.vercel.app-black?style=for-the-badge)](https://hackathonix2-project.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✦ What It Does

> Type a topic. Get scroll-stopping blog titles — instantly.

Powered by the Claude AI, this app generates creative, SEO-friendly, and engaging blog titles tailored to any subject. Built as part of **Hackathonix 2**.

---

## ✦ Features

```
  ◈  AI-powered title generation
  ◈  Interactive chat interface
  ◈  Serverless API routes
  ◈  Lightning-fast response times
  ◈  Clean, minimal UI
```

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI | Claude API by Anthropic |
| Styling | CSS |
| Deployment | Vercel |

---

## ✦ Project Structure

```
hackathonix2-project/
│
├── frontend/
│   └── src/
│       └── app/
│           ├── page.tsx          ← Main UI
│           ├── layout.tsx        ← Root layout
│           └── api/
│               ├── chat/
│               │   └── route.ts  ← Chat endpoint
│               └── generate/
│                   └── route.ts  ← Title generation endpoint
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
ANTHROPIC_API_KEY=your_api_key_here
```

**4. Run locally**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start generating. ✦

---

## ✦ Deploy on Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://hackathonix2-project.vercel.app/)
3. Set **Root Directory** → `frontend`
4. Add `ANTHROPIC_API_KEY` in **Settings → Environment Variables**
5. Hit Deploy 🚀

---

## ✦ API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/generate` | `POST` | Generate titles from a topic |
| `/api/chat` | `POST` | Chat-based title suggestions |

---

<div align="center">

```
─────────────────────────────────────
    Built with ❤  for  Hackathonix 2
─────────────────────────────────────
```

</div>
