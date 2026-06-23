import { RymiClient } from '../client';

export interface DncEntry {
    id?: string;
    phone: string;
    reason?: string;
    created_at?: string;
}

export interface DncListResponse {
    dnc_entries: DncEntry[];
    total: number;
    offset: number;
    limit: number;
}

export interface DncCheckResult {
    phone_number: string;
    normalized: string | null;
    blocked: boolean;
    valid: boolean;
}

function buildQuery(params: Record<string, any>) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) sp.set(k, String(v));
    }
    const q = sp.toString();
    return q ? `?${q}` : '';
}

/**
 * Do-Not-Call registry. Numbers are normalized to E.164 server-side on both
 * write and read, so any input format is accepted.
 */
export class DncResource {
    constructor(private client: RymiClient) {}

    /** List all DNC entries for the tenant. */
    public async list(params: { limit?: number; offset?: number } = {}): Promise<DncListResponse> {
        return this.client.get<DncListResponse>(`/dnc${buildQuery(params)}`);
    }

    /** Add a single number to the Do-Not-Call registry. */
    public async add(data: { phone_number: string; reason?: string }): Promise<{ status: 'blocklisted'; phone_number: string }> {
        return this.client.post('/dnc', data);
    }

    /** Add up to 1000 numbers in one request. Invalid numbers are skipped and returned in `invalid`. */
    public async addBatch(data: { phone_numbers: string[]; reason?: string }): Promise<{ status: 'blocklisted'; count: number; invalid_count: number; invalid: string[] }> {
        return this.client.post('/dnc/batch', data);
    }

    /** Check up to 500 numbers without adding them. Read-only. */
    public async check(data: { phone_numbers: string[] }): Promise<{ results: DncCheckResult[]; blocked_count: number; total_checked: number }> {
        return this.client.post('/dnc/check', data);
    }

    /** Remove a number from the registry (re-enables outbound to it). */
    public async remove(phone: string): Promise<{ status: 'removed'; phone: string }> {
        return this.client.delete(`/dnc/${encodeURIComponent(phone)}`);
    }
}
