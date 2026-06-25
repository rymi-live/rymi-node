<div align="center">

# @rymi/node

### The official Node.js SDK for [**Rymi**](https://rymi.live) — ship production AI voice agents in minutes.

Create and manage voice agents, attach phone numbers, place and observe calls, wire up knowledge sources, track usage, run evals, and verify webhooks — all from server-side JavaScript or TypeScript.

[![npm version](https://img.shields.io/npm/v/@rymi/node?color=6366f1&label=npm&logo=npm)](https://www.npmjs.com/package/@rymi/node)
[![npm downloads](https://img.shields.io/npm/dm/@rymi/node?color=8b5cf6&logo=npm)](https://www.npmjs.com/package/@rymi/node)
[![types](https://img.shields.io/npm/types/@rymi/node?color=22d3ee&logo=typescript)](https://www.npmjs.com/package/@rymi/node)
[![license](https://img.shields.io/badge/license-MIT-22d3ee)](./LICENSE)

[**Documentation**](https://docs.rymi.live/api/sdk-node) · [**API Reference**](https://docs.rymi.live) · [**Dashboard**](https://rymi.live) · [**Python SDK**](https://pypi.org/project/rymi/) · [**MCP Server**](https://www.npmjs.com/package/@rymi/mcp)

</div>

---

## ✨ Why Rymi

|   | |
|---|---|
| 🎙️ **Voice agents** | Full STT → LLM → TTS stack control, per-channel fallbacks, and multi-language / bilingual support out of the box. |
| ☎️ **Telephony** | Attach numbers, place outbound calls over PSTN, and observe live calls in real time. |
| 📚 **Knowledge** | Ground agents in your own docs and data with managed knowledge sources. |
| 📊 **Usage & evals** | Track minutes and spend, then run evaluations to keep quality high. |
| 🔒 **Typed & safe** | First-class TypeScript types and built-in webhook signature verification. |

## 📦 Installation

```bash
npm install @rymi/node
# or
pnpm add @rymi/node
# or
yarn add @rymi/node
```

## 🚀 Quickstart

```typescript
import { Rymi } from '@rymi/node';

const rymi = new Rymi({ apiKey: process.env.RYMI_API_KEY });

// Create a voice agent
const agent = await rymi.agents.create({
    name: 'Support',
    system_prompt: 'You are a helpful support agent for Acme Corp.',
    voice: 'Aoede',
});

// Start an outbound call
const call = await rymi.calls.create({
    agent_id: agent.id,
    participants: [{ transport: 'pstn', identity: '+15551234567', from_number: '+15559876543' }],
});
```

> **Tip:** Set `RYMI_API_KEY` in your environment and the client picks it up automatically — never hard-code secret keys or ship them to the browser.

## 🧩 Resources

The client exposes one namespace per resource group:

| Namespace | What it does |
|-----------|--------------|
| `agents` | Create, update, clone, and configure voice agents |
| `calls` | Place, list, and observe calls; fetch transcripts and recordings |
| `numbers` | Register and attach phone numbers |
| `telephony` | Inspect carrier status and provisioned numbers |
| `keys` | Manage publishable keys |
| `billing` | Usage summaries and balance |
| `templates` | Prebuilt agent templates |
| `webhooks` | Create webhooks and verify incoming signatures |
| `dnc` | Do-not-call list management |

## 📖 Documentation

Full reference and guides: [**docs.rymi.live/api/sdk-node**](https://docs.rymi.live/api/sdk-node)

## 📄 License

[MIT](./LICENSE) © Rymi
