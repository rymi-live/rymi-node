import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi } from '../src/index';

global.fetch = vi.fn();
function mockJson(body: any) {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: async () => body,
  });
}

describe('BugReportsResource', () => {
  beforeEach(() => vi.clearAllMocks());

  it('create() POSTs the report to /bug-reports', async () => {
    mockJson({ bug_report: { id: 'b1', status: 'pending_review' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const res = await rymi.bugReports.create({ title: 'Voice cuts out', description: 'The agent stops mid-sentence.', severity: 'high' });
    expect(res.bug_report.status).toBe('pending_review');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.rymi.live/v1/bug-reports',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ title: 'Voice cuts out', description: 'The agent stops mid-sentence.', severity: 'high' }) })
    );
  });

  it('list() GETs /bug-reports with query and retrieve() GETs one', async () => {
    mockJson({ bug_reports: [], total: 0, limit: 5, offset: 0 });
    mockJson({ bug_report: { id: 'b1' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.bugReports.list({ limit: 5, status: 'fixed' });
    await rymi.bugReports.retrieve('b1');
    expect(global.fetch).toHaveBeenNthCalledWith(1, 'https://api.rymi.live/v1/bug-reports?limit=5&status=fixed', expect.objectContaining({ method: 'GET' }));
    expect(global.fetch).toHaveBeenNthCalledWith(2, 'https://api.rymi.live/v1/bug-reports/b1', expect.objectContaining({ method: 'GET' }));
  });
});
