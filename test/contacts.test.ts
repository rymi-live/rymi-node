import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

global.fetch = vi.fn();

describe('ContactsResource path encoding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({}),
    });
  });

  it('a traversal id cannot re-target another resource', async () => {
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.contacts.delete('../agents/abc');
    const url = (global.fetch as any).mock.calls[0][0] as string;
    expect(url).toBe('https://api.rymi.live/v1/contacts/..%2Fagents%2Fabc');
    expect(new URL(url).pathname.startsWith('/v1/contacts/')).toBe(true);
  });
});
