import { RymiClient } from '../client';

export interface Workspace {
    id: string;
    name: string;
    role: 'owner' | 'admin' | 'client';
    /** The agency, for a client workspace. */
    parent_id: string | null;
    operating_country: string | null;
    /** Client workspaces only; absent for the client role. */
    spend_cap_cents_monthly?: number | null;
    current?: boolean;
}

export interface CreateWorkspaceParams {
    name: string;
    /** ISO-3166 alpha-2, e.g. "IN". */
    operating_country?: string | null;
    /** An agency workspace you run: makes this a client workspace that the agency pays for. */
    parent?: string;
}

export interface UpdateWorkspaceParams {
    name?: string;
    operating_country?: string | null;
    /** Client workspaces only. Credits per calendar month (1 credit = $0.01); null removes the cap. */
    spend_cap_cents_monthly?: number | null;
}

export interface WorkspaceUsage {
    workspace_id: string;
    /** YYYY-MM, UTC. */
    month: string;
    calls: number;
    minutes: number;
    /** Left out for the client role. */
    credits?: number;
}

export interface WorkspaceMember {
    user_id: string;
    email: string | null;
    role: 'owner' | 'admin' | 'client';
}

export class WorkspacesResource {
    constructor(private client: RymiClient) {}

    public async list(): Promise<{ workspaces: Workspace[] }> {
        return this.client.get('/workspaces');
    }

    public async create(data: CreateWorkspaceParams): Promise<{ workspace: Workspace }> {
        return this.client.post('/workspaces', data);
    }

    public async update(id: string, data: UpdateWorkspaceParams): Promise<{ ok: true }> {
        return this.client.patch(`/workspaces/${encodeURIComponent(id)}`, data);
    }

    /** Calls, minutes and credits for one month (default: this month, UTC). */
    public async usage(id: string, params: { month?: string } = {}): Promise<WorkspaceUsage> {
        const query = params.month ? `?month=${encodeURIComponent(params.month)}` : '';
        return this.client.get(`/workspaces/${encodeURIComponent(id)}/usage${query}`);
    }

    public async listMembers(id: string): Promise<{ members: WorkspaceMember[] }> {
        return this.client.get(`/workspaces/${encodeURIComponent(id)}/members`);
    }

    /** Someone without a Rymi account gets an invite email. Client workspaces take the client role. */
    public async addMember(id: string, data: { email: string; role?: 'admin' | 'client' }): Promise<{ member: WorkspaceMember }> {
        return this.client.post(`/workspaces/${encodeURIComponent(id)}/members`, data);
    }

    public async removeMember(id: string, userId: string): Promise<{ ok: true }> {
        return this.client.delete(`/workspaces/${encodeURIComponent(id)}/members/${encodeURIComponent(userId)}`);
    }
}
