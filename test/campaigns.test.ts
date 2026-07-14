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

const BASE = 'https://api.rymi.live/v1';

describe('CampaignsResource', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list() GETs /campaigns with query params', async () => {
    mockJson({ campaigns: [], total: 0, offset: 0, limit: 50 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.list({ status: 'running', limit: 10 });
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns?status=running&limit=10`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('list() GETs /campaigns with no query params', async () => {
    mockJson({ campaigns: [], total: 0, offset: 0, limit: 50 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.list();
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('create() POSTs to /campaigns', async () => {
    mockJson({ campaign: { id: 'camp_1' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const body = { agent_id: 'agent_1', type: 'outbound' as const, name: 'Q3 renewals' };
    await rymi.campaigns.create(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) })
    );
  });

  it('get() GETs /campaigns/:id', async () => {
    mockJson({ campaign: { id: 'camp_1' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.get('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('update() PATCHes /campaigns/:id', async () => {
    mockJson({ campaign: { id: 'camp_1' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const body = { name: 'Q3 renewals v2' };
    await rymi.campaigns.update('camp_1', body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1`,
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify(body) })
    );
  });

  it('launch() posts to /campaigns/:id/launch', async () => {
    mockJson({ campaign: { id: 'camp_1', status: 'running' }, blockers: [] });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.launch('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/launch`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('launchBlockers() GETs the dry-run endpoint (never launches)', async () => {
    mockJson({ blockers: [], launchable: true });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.launchBlockers('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/launch-blockers`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('pause() posts to /campaigns/:id/pause', async () => {
    mockJson({ campaign: { id: 'camp_1', status: 'paused' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.pause('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/pause`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('resume() posts to /campaigns/:id/resume', async () => {
    mockJson({ campaign: { id: 'camp_1', status: 'running' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.resume('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/resume`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('archive() posts to /campaigns/:id/archive', async () => {
    mockJson({ campaign: { id: 'camp_1', status: 'archived' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.archive('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/archive`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('report() GETs /campaigns/:id/report', async () => {
    mockJson({ summary: {}, distributions: {} });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.report('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/report`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('attempts() GETs /campaigns/:id/attempts with query params', async () => {
    mockJson({ attempts: [], total: 0, offset: 0, limit: 50 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.attempts('camp_1', { status: 'completed' });
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/attempts?status=completed`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('batches() GETs /campaigns/:id/batches', async () => {
    mockJson({ batches: [], total: 0, offset: 0, limit: 50 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.batches('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/batches`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('followups() GETs /campaigns/:id/followups', async () => {
    mockJson({ followups: [], total: 0, offset: 0, limit: 50 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.followups('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/followups`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('improve() posts to /campaigns/:id/improve', async () => {
    mockJson({ suggestions: [] });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.improve('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/improve`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('suggestions() GETs /campaigns/:id/suggestions', async () => {
    mockJson({ suggestions: [], total: 0, offset: 0, limit: 50 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.suggestions('camp_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/suggestions`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('acceptSuggestion() posts to /campaigns/:id/suggestions/:sid/accept', async () => {
    mockJson({ suggestion: { id: 'sug_1', status: 'accepted' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.acceptSuggestion('camp_1', 'sug_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/suggestions/sug_1/accept`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('dismissSuggestion() posts to /campaigns/:id/suggestions/:sid/dismiss', async () => {
    mockJson({ suggestion: { id: 'sug_1', status: 'dismissed' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.campaigns.dismissSuggestion('camp_1', 'sug_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/campaigns/camp_1/suggestions/sug_1/dismiss`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  describe('members', () => {
    it('members.list() GETs /campaigns/:id/members', async () => {
      mockJson({ members: [], total: 0, offset: 0, limit: 50 });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      await rymi.campaigns.members.list('camp_1', { status: 'ready' });
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/members?status=ready`,
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('members.add() posts to /campaigns/:id/members', async () => {
      mockJson({ members: [] });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      const body = { contact_ids: ['contact_1', 'contact_2'] };
      await rymi.campaigns.members.add('camp_1', body);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/members`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify(body) })
      );
    });

    it('members.import() posts to /campaigns/:id/members/import', async () => {
      mockJson({ created: 1, merged: 0, invalid: [], members_added: 1 });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      const body = { contacts: [{ phone: '+15551234567' }] };
      await rymi.campaigns.members.import('camp_1', body);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/members/import`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify(body) })
      );
    });

    it('members.update() PATCHes /campaigns/:id/members/:member_id', async () => {
      mockJson({ member: { id: 'mem_1' } });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      const body = { status: 'suppressed' };
      await rymi.campaigns.members.update('camp_1', 'mem_1', body);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/members/mem_1`,
        expect.objectContaining({ method: 'PATCH', body: JSON.stringify(body) })
      );
    });

    it('members.remove() DELETEs /campaigns/:id/members/:member_id', async () => {
      mockJson({ status: 'deleted', id: 'mem_1' });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      await rymi.campaigns.members.remove('camp_1', 'mem_1');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/members/mem_1`,
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('routes', () => {
    it('routes.list() GETs /campaigns/:id/routes', async () => {
      mockJson({ routes: [], total: 0, offset: 0, limit: 50 });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      await rymi.campaigns.routes.list('camp_1');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/routes`,
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('routes.create() posts to /campaigns/:id/routes', async () => {
      mockJson({ route: { id: 'route_1' } });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      const body = { phone_number: '+15551234567' };
      await rymi.campaigns.routes.create('camp_1', body);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/routes`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify(body) })
      );
    });

    it('routes.update() PATCHes /campaigns/:id/routes/:route_id', async () => {
      mockJson({ route: { id: 'route_1' } });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      const body = { active: false };
      await rymi.campaigns.routes.update('camp_1', 'route_1', body);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/routes/route_1`,
        expect.objectContaining({ method: 'PATCH', body: JSON.stringify(body) })
      );
    });

    it('routes.delete() DELETEs /campaigns/:id/routes/:route_id', async () => {
      mockJson({ status: 'deleted', id: 'route_1' });
      const rymi = new Rymi({ apiKey: 'rymi_test' });
      await rymi.campaigns.routes.delete('camp_1', 'route_1');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE}/campaigns/camp_1/routes/route_1`,
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});

describe('ContactsResource', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list() GETs /contacts', async () => {
    mockJson({ contacts: [], total: 0, offset: 0, limit: 50 });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.contacts.list({ limit: 25 });
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/contacts?limit=25`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('create() POSTs to /contacts', async () => {
    mockJson({ contact: { id: 'contact_1' }, deduped: false });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const body = { phone: '+15551234567', name: 'Jane Doe' };
    await rymi.contacts.create(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/contacts`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) })
    );
  });

  it('get() GETs /contacts/:id', async () => {
    mockJson({ contact: { id: 'contact_1' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.contacts.get('contact_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/contacts/contact_1`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('update() PATCHes /contacts/:id', async () => {
    mockJson({ contact: { id: 'contact_1' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const body = { name: 'Jane Smith' };
    await rymi.contacts.update('contact_1', body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/contacts/contact_1`,
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify(body) })
    );
  });

  it('delete() DELETEs /contacts/:id', async () => {
    mockJson({ status: 'deleted', id: 'contact_1' });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.contacts.delete('contact_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/contacts/contact_1`,
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('import() posts to /contacts/import', async () => {
    mockJson({ created: 2, merged: 1, invalid: [] });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    const body = { contacts: [{ phone: '+15551234567' }, { phone: '+15557654321' }] };
    await rymi.contacts.import(body);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/contacts/import`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) })
    );
  });

  it('setConsent() PATCHes /contacts/:id/consent', async () => {
    mockJson({ contact_id: 'ct1', channel: 'voice', consent: { granted: true } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.contacts.setConsent('ct1', { channel: 'voice', granted: true, source: 'web_form', method: 'checkbox' });
    expect(global.fetch).toHaveBeenCalledWith(`${BASE}/contacts/ct1/consent`, expect.objectContaining({ method: 'PATCH' }));
  });
});

describe('ComplianceResource', () => {
  beforeEach(() => vi.clearAllMocks());

  it('attest() POSTs /compliance/attestations', async () => {
    mockJson({ attestation: { id: 'att1' } });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.compliance.attest({ kind: 'dnc_external_scrub', note: 'vendor X' });
    expect(global.fetch).toHaveBeenCalledWith(`${BASE}/compliance/attestations`, expect.objectContaining({ method: 'POST' }));
  });

  it('listAttestations() GETs /compliance/attestations', async () => {
    mockJson({ attestations: [] });
    const rymi = new Rymi({ apiKey: 'rymi_test' });
    await rymi.compliance.listAttestations();
    expect(global.fetch).toHaveBeenCalledWith(`${BASE}/compliance/attestations`, expect.objectContaining({ method: 'GET' }));
  });
});
