import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

// Mock the global fetch
global.fetch = vi.fn();

describe('Rymi Client', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw an error if no API key is provided', () => {
        expect(() => new Rymi()).toThrow('The Rymi API Key must be set');
    });

    it('should initialize with an explicit API key', () => {
        const client = new Rymi({ apiKey: 'rymi_test_123' });
        expect(client).toBeInstanceOf(Rymi);
        expect(client.agents).toBeDefined();
        expect(client.calls).toBeDefined();
    });

    it('should format requests correctly with Authorization headers', async () => {
        const mockResponse = { agents: [{ id: 'agent_1' }], total: 1, offset: 0, limit: 50 };
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => mockResponse
        });

        const rymi = new Rymi({ apiKey: 'rymi_test_secure' });
        const agents = await rymi.agents.list();

        expect(agents).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.rymi.live/v1/agents',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer rymi_test_secure',
                    'Accept': 'application/json'
                })
            })
        );
    });

    it('should properly serialize POST body payloads', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ id: 'new_agent' })
        });

        const rymi = new Rymi({ apiKey: 'rymi_test_secure' });
        await rymi.agents.create({ name: 'Test', prompt: 'Hello' });

        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.rymi.live/v1/agents',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ name: 'Test', system_prompt: 'Hello' }),
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                })
            })
        );
    });
});
