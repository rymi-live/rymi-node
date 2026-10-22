import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

global.fetch = vi.fn();

function mockJson(body: unknown) {
    (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => body,
    });
}

describe('AgentsResource taskCalls', () => {
    beforeEach(() => vi.clearAllMocks());

    it('placeTaskCall() posts to /agents/:id/task-calls and returns call info', async () => {
        mockJson({ call_id: 'call-123', agent_id: 'agent-1', status: 'queued' });
        const rymi = new Rymi({ apiKey: 'rymi_test' });

        const body = {
            to: '+919876543210',
            on_behalf_of: 'Spandan',
            instructions: 'Confirm booking',
            return_fields: [
                { name: 'confirmed', description: 'Did they confirm?', type: 'boolean' as const },
            ],
            opening_line: 'Hi there',
            from_number: '+918000000000',
        };

        const res = await rymi.agents.placeTaskCall('agent-1', body);

        expect(res).toEqual({ call_id: 'call-123', agent_id: 'agent-1', status: 'queued' });
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.rymi.live/v1/agents/agent-1/task-calls',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(body),
            }),
        );
    });
});
