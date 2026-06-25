import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

global.fetch = vi.fn();
function mockJson(body: any) {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: async () => body,
  });
}

describe('BillingResource controls', () => {
  beforeEach(() => vi.clearAllMocks());

  it('estimate() POSTs to /billing/estimate', async () => {
    mockJson({ estimated_minutes: 5 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.billing.estimate({ llm_model: 'gemini-2.5-flash', duration_seconds: 300 });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/billing/estimate',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ llm_model: 'gemini-2.5-flash', duration_seconds: 300 }) })
    );
  });

  it('setAutoRecharge() PUTs to /billing/auto-recharge', async () => {
    mockJson({ ok: true });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.billing.setAutoRecharge({ enabled: true, pack_usd: 20, threshold_usd: 5 });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/billing/auto-recharge',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ enabled: true, pack_usd: 20, threshold_usd: 5 }) })
    );
  });

  it('setAlerts() PUTs to /billing/alerts', async () => {
    mockJson({ ok: true });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.billing.setAlerts({ thresholds_usd: [10, 25], email_enabled: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/billing/alerts',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ thresholds_usd: [10, 25], email_enabled: true }) })
    );
  });
});
