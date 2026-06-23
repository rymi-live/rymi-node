import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

global.fetch = vi.fn();
function mockJson(body: any) {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: async () => body,
  });
}

describe('WebhooksResource CRUD', () => {
  beforeEach(() => vi.clearAllMocks());

  it('create() POSTs to /webhooks', async () => {
    mockJson({ status: 'registered' });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const body = { url: 'https://example.com/hook', events: ['call.completed'], secret: 'x'.repeat(20) };
    await rymi.webhooks.create(body);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/webhooks',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) })
    );
  });

  it('update() PATCHes /webhooks/:id', async () => {
    mockJson({ status: 'updated', id: 'wh_1' });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.webhooks.update('wh_1', { events: ['call.failed'] });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/webhooks/wh_1',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ events: ['call.failed'] }) })
    );
  });

  it('delete() DELETEs /webhooks/:id', async () => {
    mockJson({ status: 'deleted', id: 'wh_1' });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.webhooks.delete('wh_1');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/webhooks/wh_1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('still exposes verifySignature', () => {
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    expect(typeof rymi.webhooks.verifySignature).toBe('function');
  });
});
