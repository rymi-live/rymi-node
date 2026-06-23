# @rymi/node

Official Node.js SDK for the [Rymi](https://rymi.live) API. Create and manage AI voice agents (including multi-language agents and full STT/LLM/TTS stack control), attach phone numbers, place and observe calls, manage knowledge sources, track usage, run evaluations, and verify webhooks — from any server-side JavaScript or TypeScript application.

Resources: `agents` · `calls` · `numbers` · `telephony` · `keys` · `billing` · `templates` · `webhooks` · `dnc`.

## Installation

```bash
npm install @rymi/node
```

## Quickstart

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

## Documentation

Full reference: [docs.rymi.live/api/sdk-node](https://docs.rymi.live/api/sdk-node)

## License

MIT
