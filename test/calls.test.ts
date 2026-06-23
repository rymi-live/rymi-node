import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

global.fetch = vi.fn();

function mockJson(body: any) {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => body,
  });
}

describe('CallsResource action methods', () => {
  beforeEach(() => vi.clearAllMocks());

  it('end() POSTs to /calls/:id/end', async () => {
    mockJson({ status: 'ended', id: 'call_1', message: 'Call has been terminated.' });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const res = await rymi.calls.end('call_1');
    expect(res).toEqual({ status: 'ended', id: 'call_1', message: 'Call has been terminated.' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/calls/call_1/end',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('addParticipants() POSTs participants to /calls/:id/participants', async () => {
    mockJson({ id: 'call_1', room_name: 'r', status: 'connecting', participants: [] });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const body = { participants: [{ transport: 'pstn' as const, identity: '+15555550123' }] };
    await rymi.calls.addParticipants('call_1', body);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/calls/call_1/participants',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) })
    );
  });
});
