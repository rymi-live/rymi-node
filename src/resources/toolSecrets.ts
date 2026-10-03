import { RymiClient } from '../client';

/** A stored API-tool secret. Values are write-only — never returned. */
export interface ToolSecretRecord {
    name: string;
    /** The only host this secret is ever sent to. */
    host: string | null;
}

/**
 * Tenant secrets referenced from call_webhook headers as `{{secrets.NAME}}`.
 * Each secret is pinned to one host and only interpolated into requests to it.
 */
export class ToolSecretsResource {
    constructor(private client: RymiClient) {}

    public async list(): Promise<{ data: ToolSecretRecord[] }> {
        return this.client.get('/tool-secrets');
    }

    /** Create or replace. `name` is UPPER_SNAKE_CASE; `host` is a public hostname. */
    public async set(name: string, data: { value: string; host: string }): Promise<{ data: { name: string } }> {
        return this.client.put(`/tool-secrets/${encodeURIComponent(name)}`, data);
    }

    public async delete(name: string): Promise<{ data: { name: string } }> {
        return this.client.delete(`/tool-secrets/${encodeURIComponent(name)}`);
    }
}
