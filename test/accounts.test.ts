import { describe, expect, it, vi } from 'vitest';
import { Rymi } from '../src/index';

const ok = (body: unknown) => ({
    ok: true,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => body,
});

describe('accounts', () => {
    it('accounts resource calls the right routes', async () => {
        global.fetch = vi.fn().mockResolvedValue(ok({}));
        const rymi = new Rymi({ apiKey: 'rymi_x' });
        await rymi.accounts.list();
        await rymi.accounts.get('acct 1');
        await rymi.accounts.update('acct 1', { name: 'Sarang' });
        await rymi.accounts.members.list('acct 1');
        await rymi.accounts.members.add('acct 1', { email: 'ada@example.com', role: 'admin' });
        await rymi.accounts.members.update('acct 1', 'user 2', { role: 'billing' });
        await rymi.accounts.members.remove('acct 1', 'user 2');
        await rymi.accounts.workspaces('acct 1');
        const calls = (global.fetch as any).mock.calls.map((c: any[]) => [
            c[0],
            c[1].method,
            c[1].body ? JSON.parse(c[1].body) : undefined,
        ]);
        expect(calls).toEqual([
            ['https://api.rymi.live/v1/accounts', 'GET', undefined],
            ['https://api.rymi.live/v1/accounts/acct%201', 'GET', undefined],
            ['https://api.rymi.live/v1/accounts/acct%201', 'PATCH', { name: 'Sarang' }],
            ['https://api.rymi.live/v1/accounts/acct%201/members', 'GET', undefined],
            ['https://api.rymi.live/v1/accounts/acct%201/members', 'POST', { email: 'ada@example.com', role: 'admin' }],
            ['https://api.rymi.live/v1/accounts/acct%201/members/user%202', 'PATCH', { role: 'billing' }],
            ['https://api.rymi.live/v1/accounts/acct%201/members/user%202', 'DELETE', undefined],
            ['https://api.rymi.live/v1/accounts/acct%201/workspaces', 'GET', undefined],
        ]);
    });

    it('creates a scoped key and reads the key itself', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce(ok({ key: 'rymi_ws_secret' }))
            .mockResolvedValueOnce(ok({ kind: 'workspace', scopes: ['calls:read'], legacy: false }));
        const rymi = new Rymi({ apiKey: 'rymi_x' });
        const created = await rymi.keys.create({ kind: 'workspace', scopes: ['calls:read', 'calls:write'], label: 'Dialler' });
        const self = await rymi.keys.self();
        expect(created.key).toBe('rymi_ws_secret');
        expect(self.scopes).toEqual(['calls:read']);
        const calls = (global.fetch as any).mock.calls.map((c: any[]) => [
            c[0],
            c[1].method,
            c[1].body ? JSON.parse(c[1].body) : undefined,
        ]);
        expect(calls).toEqual([
            ['https://api.rymi.live/v1/auth/api-keys', 'POST', { kind: 'workspace', scopes: ['calls:read', 'calls:write'], label: 'Dialler' }],
            ['https://api.rymi.live/v1/keys/self', 'GET', undefined],
        ]);
    });
});
