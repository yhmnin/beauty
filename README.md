# Beauty — Aesthetic Intelligence

A voice-driven application for exploring humanity's finest aesthetic achievements across design, architecture, art, and craft. Inspired by the film *Her* and platforms like Cosmos.so.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Create `.env.local` with your OpenAI API key to enable voice conversation and AI-powered chat:

```
OPENAI_API_KEY=sk-your-key-here
```

Without an API key, the text chat and voice features will show an error. The explore interface and content browsing work without any API key.

## Features

### Voice Conversation (Her-style)
- Real-time voice interaction via OpenAI Realtime API (WebRTC)
- Animated voice orb with particle system that responds to audio levels
- Opening cinematic sequence with typography animation
- Automatic voice activity detection
- Function calling for live content search during conversation

### Aesthetic Knowledge Base
- 15 curated creators: Dieter Rams, Tadao Ando, Kenya Hara, Carlo Scarpa, Peter Zumthor, and more
- 10 iconic works: Braun SK4, Church of the Light, Therme Vals, Eames Lounge Chair, etc.
- 5 aesthetic movements: Bauhaus, Mingei, Swiss International Style, Wabi-Sabi, Mid-Century Modern
- 3 historic events: Expo '70 Osaka, Salone del Mobile, Founding of the Bauhaus
- Knowledge graph connecting people, works, movements, and events

### Explore Interface
- Masonry grid layout with category filtering
- Content detail modals with full descriptions
- Category filters: Architecture, Industrial Design, Graphic Design, Ceramics, Book Design, etc.

### AI-Powered Understanding
- RAG pipeline connecting conversation to curated content
- Taste profiling that learns aesthetic preferences over time
- Text-based chat fallback when voice is unavailable
- Vector search ready (CLIP/OpenAI embeddings integration)

### Design System
- Dark-first Cosmos-inspired aesthetic
- Instrument Serif + Geist Sans typography pairing
- Warm amber accent color on deep charcoal
- Large border radius, generous whitespace
- Framer Motion animations throughout

## Cross-Platform

| Platform | Technology | Status |
|----------|-----------|--------|
| Web Browser | Next.js + PWA | Ready |
| iPhone / Android | Capacitor 8 | Config ready |
| macOS / Desktop | Tauri | Config ready |
| Smart TV | PWA via browser | Responsive ready |

### Build for Mobile

```bash
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
```

### Build for Desktop

```bash
npm run build
cd src-tauri && cargo tauri build
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Voice**: OpenAI Realtime API (WebRTC, gpt-4o-realtime-preview)
- **AI**: OpenAI GPT-4o for RAG, text-embedding-3-small for vector search
- **UI**: Tailwind CSS 4, Framer Motion
- **State**: Zustand
- **Database**: PostgreSQL + pgvector (Prisma ORM) — currently using in-memory store
- **Mobile**: Capacitor 8
- **Desktop**: Tauri

## Project Structure

```
src/
  app/                  # Next.js pages and API routes
  components/
    ui/                 # Design system (Button, Card, MasonryGrid, Typography)
    voice/              # VoiceOrb, OpeningSequence, ConversationView
    content/            # ExploreView, HomeView, ProfileView
    layout/             # Navigation, ServiceWorkerRegistrar
  lib/
    voice/              # RealtimeVoiceClient, VoiceVisualizer
    ai/                 # AestheticAgent, TasteProfile, RAG Pipeline
    content/            # AestheticDB, CLIP Search, Knowledge Graph
    platform/           # Platform detection, Service Worker
prisma/
  schema.prisma         # PostgreSQL + pgvector schema
```
