import { RymiClient } from '../client';

export type AccountRole = 'owner' | 'admin' | 'billing';

export interface Account {
    id: string;
    name: string;
    role: AccountRole | null;
}

export interface AccountMember {
    user_id: string;
    email: string | null;
    role: AccountRole;
}

export interface AccountWorkspace {
    id: string;
    name: string;
    calls: number;
    minutes: number;
    credits: number;
    spend_cap_cents_monthly: number | null;
}

class AccountMembersResource {
    constructor(private client: RymiClient) {}

    public async list(id: string): Promise<{ members: AccountMember[] }> {
        return this.client.get(`/accounts/${encodeURIComponent(id)}/members`);
    }

    public async add(id: string, data: { email: string; role: AccountRole }): Promise<{ member: AccountMember }> {
        return this.client.post(`/accounts/${encodeURIComponent(id)}/members`, data);
    }

    /** The answer carries no email. */
    public async update(id: string, userId: string, data: { role: AccountRole }): Promise<{ member: Pick<AccountMember, 'user_id' | 'role'> }> {
        return this.client.patch(`/accounts/${encodeURIComponent(id)}/members/${encodeURIComponent(userId)}`, data);
    }

    public async remove(id: string, userId: string): Promise<{ ok: true }> {
        return this.client.delete(`/accounts/${encodeURIComponent(id)}/members/${encodeURIComponent(userId)}`);
    }
}

export class AccountsResource {
    public members: AccountMembersResource;

    constructor(private client: RymiClient) {
        this.members = new AccountMembersResource(client);
    }

    public async list(): Promise<{ accounts: Account[] }> {
        return this.client.get('/accounts');
    }

    public async get(id: string): Promise<{ account: Account }> {
        return this.client.get(`/accounts/${encodeURIComponent(id)}`);
    }

    public async update(id: string, data: { name: string }): Promise<{ ok: true }> {
        return this.client.patch(`/accounts/${encodeURIComponent(id)}`, data);
    }

    public async workspaces(id: string): Promise<{ workspaces: AccountWorkspace[] }> {
        return this.client.get(`/accounts/${encodeURIComponent(id)}/workspaces`);
    }
}
