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

export type SecretKeyKind = 'account' | 'workspace';

export interface CreateSecretKeyParams {
    kind: SecretKeyKind;
    scopes: string[];
    label?: string;
}

/** The raw `key` is returned only by `create`. */
export interface CreatedSecretKey {
    id: string;
    key: string;
    key_prefix: string;
    kind: SecretKeyKind;
    scopes: string[];
    label: string | null;
    created_at: string;
}

export interface KeySelf {
    kind: SecretKeyKind;
    account_id: string | null;
    workspace_id: string | null;
    scopes: string[];
    legacy: boolean;
}

export class KeysResource {
    constructor(private client: RymiClient) {}

    /** Create a secret key. The raw `key` is returned only by this call. */
    public async create(data: CreateSecretKeyParams): Promise<CreatedSecretKey> {
        return this.client.post('/auth/api-keys', data);
    }

    /** Kind, scopes, and legacy flag for the key authenticating this client. */
    public async self(): Promise<KeySelf> {
        return this.client.get('/keys/self');
    }

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
