// packages/node/src/resources/workspaces.ts
import { RymiClient } from '../client';

export interface Workspace {
    id: string;
    name: string;
    role: 'owner' | 'admin' | 'client';
    parent_id: string | null;
    operating_country: string | null;
    current?: boolean;
}

export interface CreateWorkspaceParams {
    name: string;
    /** ISO-3166 alpha-2, e.g. "IN". */
    operating_country?: string | null;
}

export class WorkspacesResource {
    constructor(private client: RymiClient) {}

    public async list(): Promise<{ workspaces: Workspace[] }> {
        return this.client.get('/workspaces');
    }

    public async create(data: CreateWorkspaceParams): Promise<{ workspace: Workspace }> {
        return this.client.post('/workspaces', data);
    }

    public async update(id: string, data: { name?: string; operating_country?: string | null }): Promise<{ ok: true }> {
        return this.client.patch(`/workspaces/${encodeURIComponent(id)}`, data);
    }
}
