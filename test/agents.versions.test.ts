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

describe('AgentsResource versions', () => {
    beforeEach(() => vi.clearAllMocks());

    it('publish() posts the environment and label', async () => {
        mockJson({ published: true, version_id: 'ver-1', version: 4, environment: 'staging', snapshot_id: 'hash' });
        const rymi = new Rymi({ apiKey: 'rymi_test' });
        const res = await rymi.agents.publish('agent-1', { environment: 'staging', label: 'Softer opener' });
        expect(res.version_id).toBe('ver-1');
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.rymi.live/v1/agents/agent-1/publish',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ environment: 'staging', label: 'Softer opener' }),
            }),
        );
    });

    it('listVersions() and pointEnvironment() hit the version routes', async () => {
        mockJson({ versions: [], production_version_id: null, staging_version_id: null });
        mockJson({ environment: 'production', version_id: 'ver-1', version: 1 });
        const rymi = new Rymi({ apiKey: 'rymi_test' });
        await rymi.agents.listVersions('agent-1');
        await rymi.agents.pointEnvironment('agent-1', 'production', 'ver-1');
        expect(global.fetch).toHaveBeenNthCalledWith(
            1,
            'https://api.rymi.live/v1/agents/agent-1/versions',
            expect.objectContaining({ method: 'GET' }),
        );
        expect(global.fetch).toHaveBeenNthCalledWith(
            2,
            'https://api.rymi.live/v1/agents/agent-1/environments/production',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ version_id: 'ver-1' }),
            }),
        );
    });
});
