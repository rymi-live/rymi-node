import { RymiClient } from '../client';

export interface PublishableKeyRecord {
    id: string;
    key_prefix: string;
    agent_id: string;
    label: string;
    allowed_channels: Array<'web' | 'phone'>;
    audience: 'sdk' | 'landing_demo';
    default_from_number: string | null;
    created_at: string;
}

export interface CreatePublishableKeyParams {
    agent_id: string;
    label: string;
    allowed_channels?: Array<'web' | 'phone'>;
    audience?: 'sdk' | 'landing_demo';
    default_from_number?: string | null;
}

export class KeysResource {
    constructor(private client: RymiClient) {}

    public async listPublishable(): Promise<{ keys: PublishableKeyRecord[] }> {
        return this.client.get('/keys/publishable');
    }

    public async createPublishable(data: CreatePublishableKeyParams): Promise<CreatePublishableKeyParams & { key: string }> {
        return this.client.post('/keys/publishable', data);
    }

    public async revokePublishable(id: string): Promise<{ success: true }> {
        return this.client.delete(`/keys/publishable/${id}`);
    }
}
