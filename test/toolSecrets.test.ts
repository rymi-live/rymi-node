import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

global.fetch = vi.fn();
function mockJson(body: any) {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: async () => body,
  });
}

describe('ToolSecretsResource', () => {
  beforeEach(() => vi.clearAllMocks());

  it('set() PUTs value + host to /tool-secrets/:name', async () => {
    mockJson({ data: { name: 'RES_KEY' } });
    await new Rymi({ apiKey: 'rymi_test' }).toolSecrets.set('RES_KEY', { value: 'v', host: 'api.example.com' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/tool-secrets/RES_KEY',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ value: 'v', host: 'api.example.com' }) })
    );
  });

  it('list() GETs /tool-secrets', async () => {
    mockJson({ data: [] });
    await new Rymi({ apiKey: 'rymi_test' }).toolSecrets.list();
    expect(global.fetch).toHaveBeenCalledWith('https://api.rymi.live/v1/tool-secrets', expect.objectContaining({ method: 'GET' }));
  });
});
