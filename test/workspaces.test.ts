// packages/node/test/workspaces.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Rymi } from '../src/index';

const ok = (body: unknown) => ({ ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: async () => body });

describe('workspaces', () => {
    beforeEach(() => { global.fetch = vi.fn().mockResolvedValue(ok({ workspaces: [] })); });
    afterEach(() => { delete process.env.RYMI_WORKSPACE; });

    it('sends Rymi-Workspace when the option is set', async () => {
        await new Rymi({ apiKey: 'rymi_x', workspace: 'w2' }).agents.list();
        expect((global.fetch as any).mock.calls[0][1].headers['Rymi-Workspace']).toBe('w2');
    });

    it('falls back to RYMI_WORKSPACE and sends nothing when neither is set', async () => {
        await new Rymi({ apiKey: 'rymi_x' }).agents.list();
        expect((global.fetch as any).mock.calls[0][1].headers['Rymi-Workspace']).toBeUndefined();
        process.env.RYMI_WORKSPACE = 'w3';
        await new Rymi({ apiKey: 'rymi_x' }).agents.list();
        expect((global.fetch as any).mock.calls[1][1].headers['Rymi-Workspace']).toBe('w3');
    });

    it('lists, creates and updates workspaces', async () => {
        const rymi = new Rymi({ apiKey: 'rymi_x' });
        await rymi.workspaces.list();
        await rymi.workspaces.create({ name: 'Sarang', operating_country: 'IN' });
        await rymi.workspaces.update('w2', { name: 'Two' });
        const calls = (global.fetch as any).mock.calls;
        expect([calls[0][0], calls[0][1].method]).toEqual(['https://api.rymi.live/v1/workspaces', 'GET']);
        expect([calls[1][0], calls[1][1].method, JSON.parse(calls[1][1].body)]).toEqual(
            ['https://api.rymi.live/v1/workspaces', 'POST', { name: 'Sarang', operating_country: 'IN' }]);
        expect([calls[2][0], calls[2][1].method]).toEqual(['https://api.rymi.live/v1/workspaces/w2', 'PATCH']);
    });

    it('creates client workspaces, sets caps, reads usage and manages members', async () => {
        const rymi = new Rymi({ apiKey: 'rymi_x' });
        await rymi.workspaces.create({ name: 'Sarang', parent: 'agency-1' });
        await rymi.workspaces.update('c1', { spend_cap_cents_monthly: 2000 });
        await rymi.workspaces.usage('c1', { month: '2026-10' });
        await rymi.workspaces.listMembers('c1');
        await rymi.workspaces.addMember('c1', { email: 'guest@example.com' });
        await rymi.workspaces.removeMember('c1', 'u2');
        const calls = (global.fetch as any).mock.calls.map((c: any[]) => [c[0], c[1].method, c[1].body ? JSON.parse(c[1].body) : undefined]);
        expect(calls).toEqual([
            ['https://api.rymi.live/v1/workspaces', 'POST', { name: 'Sarang', parent: 'agency-1' }],
            ['https://api.rymi.live/v1/workspaces/c1', 'PATCH', { spend_cap_cents_monthly: 2000 }],
            ['https://api.rymi.live/v1/workspaces/c1/usage?month=2026-10', 'GET', undefined],
            ['https://api.rymi.live/v1/workspaces/c1/members', 'GET', undefined],
            ['https://api.rymi.live/v1/workspaces/c1/members', 'POST', { email: 'guest@example.com' }],
            ['https://api.rymi.live/v1/workspaces/c1/members/u2', 'DELETE', undefined],
        ]);
    });
});
