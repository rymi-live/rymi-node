import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

global.fetch = vi.fn();
function mockJson(body: any) {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: async () => body,
  });
}

describe('DncResource', () => {
  beforeEach(() => vi.clearAllMocks());

  it('add() POSTs phone_number to /dnc', async () => {
    mockJson({ status: 'blocklisted', phone_number: '+15555550123' });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.dnc.add({ phone_number: '+15555550123', reason: 'opt-out' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/dnc',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ phone_number: '+15555550123', reason: 'opt-out' }) })
    );
  });

  it('list() GETs /dnc with query', async () => {
    mockJson({ dnc_entries: [], total: 0, offset: 0, limit: 50 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.dnc.list({ limit: 50 });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/dnc?limit=50',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('remove() DELETEs url-encoded phone', async () => {
    mockJson({ status: 'removed', phone: '+15555550123' });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.dnc.remove('+15555550123');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/dnc/%2B15555550123',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
