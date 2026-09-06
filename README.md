# ECHOSPHERE-VOICED — Voice-First Conversational AI Platform

> **Speak • Listen • Understand • Act** — A reliable voice-first AI agent for elderly users, children, disabled users, and people with low digital literacy. Built for the Agora Hackathon.

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Live Demo:** https://echosphere-ba2l385dc-jatinsinghkainturas-projects.vercel.app

> **Note:** Vercel Deployment Protection is currently enabled. Disable it in Vercel Dashboard -> Settings -> Deployment Protection -> Off for public access, or use `vercel curl` for authenticated requests.

---

## Voice-First for Seniors & Low-Literacy Users

EchoSphere is not a chatbot you have to type to — you can **talk** to it. Try:
- "Hello" / "नमस्ते" -> Echo: "Hello! I'm Echo, your friendly navigator..."
- "Help me navigate" -> "Tell me where you are... where you want to go..."
- "There's a water leak at Gate 4, people are slipping" -> Creates high-priority Jira incident
- "Has the auth fix been merged?" -> Searches GitHub PRs
- "What is the flooding SOP?" -> Retrieves Notion SOP-302

All replies are **short sentences, no markdown, spoken aloud** via browser TTS with BCP-47 locale mapping (hi -> hi-IN).

---

## Features

| Category | Feature | Details |
|----------|---------|---------|
| **Voice** | STT + TTS | Web Speech API + Agora RTC optional, BCP-47 map for 30+ langs, voice auto-pick, chunking, barge-in |
| **Navigator** | Friendly Persona | Greeting/navigate detection -> warm intro in en/hi/es |
| **i18n** | Hindi-Aware | setLanguageBoth() syncs UI + AI/TTS; 40+ languages, Help-me-navigate CTA |
| **AI** | Conversational AI | Gemini 2.5 Flash/Pro + deterministic fallback (works with zero keys) |
| **Tools** | Jira | create_incident (approval-gated) |
| | GitHub | search_pull_requests / get_pull_request |
| | Notion | search_notion + bundled SOP-302 |
| | Workspace | web_search, translate_text |
| **Safety** | Approval Gate | HIGH_IMPACT writes require human approval |
| **Streaming** | SSE | UNDERSTANDING -> THINKING -> CALLING_TOOL -> RESPONDING -> COMPLETED |
| **Memory** | Ephemeral | JSON-file DB (.data/echosphere_db.json, /tmp on Vercel) |

---

## Architecture

```
User (Voice/Text, 40+ langs)
        |
Frontend (Vite + React 19 + Framer Motion)
  - AppLayout (Header + Sidebar + Home)
  - voiceService (BCP-47, STT/TTS, Agora RTC)
  - persona.ts
        |  POST /api/v1/chat (SSE)
Vercel Serverless (Node 22, ESM)
  - lib/ai/gemini.ts (Gemini + persona + autonomous fallback)
  - lib/ai/persona.ts
  - lib/tools/registry.ts (READ/WRITE/HIGH_IMPACT)
     |- jira.ts  |- github.ts  |- notion.ts  |- workspace.ts
  - lib/db/index.ts (JSON -> /tmp on Vercel)
  - api/* thin handlers
        |
External: Gemini <-> Jira <-> GitHub <-> Notion <-> Agora RTC
```

---

## Quick Start

```bash
git clone https://github.com/JATINSINGHKAINTURA/ECHOSPHERE-VOICED.git
cd ECHOSPHERE-VOICED
npm install
cp .env.example .env   # fill keys (see below)
npm run dev    # -> http://localhost:5173
npm run build  # tsc -b && vite build
npx tsx tests/verify-api.ts
npx tsx tests/verify-persona.ts
```

---

## Environment Variables

All integrations degrade gracefully to demo data when keys are empty.

| Variable | Required | Where to get |
|----------|----------|--------------|
| GEMINI_API_KEY | No | https://aistudio.google.com/app/apikey |
| AGORA_APP_ID | No | https://console.agora.io/ |
| AGORA_APP_CERTIFICATE | No | Same console -> Config |
| JIRA_BASE_URL | No | https://YOURDOMAIN.atlassian.net |
| JIRA_EMAIL | No | Atlassian login email |
| JIRA_API_TOKEN | No | https://id.atlassian.com/manage-profile/security/api-tokens |
| JIRA_PROJECT_KEY | No | e.g. ECHO |
| GITHUB_TOKEN | No | https://github.com/settings/tokens (classic, repo scope) |
| NOTION_TOKEN | No | https://www.notion.so/my-integrations + Connect page |
| DATABASE_URL | No | file:.data/echosphere_db.json or postgresql://... |

```bash
vercel env add GEMINI_API_KEY
vercel env add NOTION_TOKEN
# ... etc (Preview + Production + Development)
```

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health + integrations + telemetry |
| POST | /api/v1/chat | Chat SSE ({prompt, conversation_id, language, model, stream}) |
| GET/POST/PUT/DELETE | /api/v1/conversations | CRUD (?id= for single) |
| GET | /api/v1/models | balanced / reasoning / autonomous |
| GET/POST/PATCH | /api/incidents | List / create / update incidents |
| GET/POST | /api/agora/token | RTC token (mock if no keys) |
| POST | /api/actions/approve | {action_id, decision: approve|reject} |
| GET | /api/tools | Catalog (12 tools) |
| GET | /api/integrations/status | Live config status |
| GET | /api/docs | Index + ?format=openapi |

---

## Testing

```
Gate 4 leak -> creates INC-xxx (ECHO-xxx)
Auth PR -> finds PR #142 merged by alex-dev
SOP-302 -> Notion flooding protocol
Greeting -> "Hello! I'm Echo..." (EN) / "नमस्ते! मैं एको हूँ..." (HI)
Navigator -> "where you are right now" guidance
```

---

## Deployment

```bash
vercel --prod
vercel deploy --yes
vercel curl https://<url>/api/health
```

vercel.json: framework vite, buildCommand npm run build, outputDirectory dist, SPA fallback.

---

## Project Structure

```
api/                # Vercel serverless handlers (thin)
api-dev-server.ts   # Vite middleware
lib/
  ai/gemini.ts
  ai/persona.ts
  db/index.ts
  tools/{registry,jira,github,notion,workspace}.ts
  http.ts
src/
  components/{chat,layout,sidebar,language}/
  pages/Home.tsx
  services/{aiService,voiceService,chatService}.ts
  lib/{aiService,voiceLocale,persona}
  hooks/useLanguage.ts
  i18n/ , data/languages.ts
tests/{verify-api.ts, verify-persona.ts}
checkEnv.js
vercel.json
```

---

## Author

**Jatin Singh Kaintura** — [GitHub @JATINSINGHKAINTURA](https://github.com/JATINSINGHKAINTURA)

> Built by inspecting the codebase first, preserving every working feature, and upgrading one phase at a time.

## License

MIT
