import { RymiClient } from '../client';

export interface NumberRecord {
    id?: string;
    number?: string;
    phone_number?: string;
    provider?: 'plivo' | 'twilio' | 'vonage' | 'telnyx';
    capabilities?: string[];
    price?: string | number;
    monthly_price?: number;
    agent_id?: string | null;
    assigned_agent_id?: string | null;
    created_at?: string;
    /** Carrier inbound-webhook provisioning state (set once an agent is attached). */
    webhook_status?: 'configured' | 'manual_required' | 'failed' | null;
    webhook_url?: string | null;
    webhook_error?: string | null;
    last_inbound_at?: string | null;
}

/** Outcome of carrier inbound-webhook auto-provisioning. */
export interface WebhookProvisionResult {
    status: 'configured' | 'manual_required' | 'failed' | 'no_carrier';
    provider: string | null;
    webhookUrl: string | null;
    verified: boolean;
    error?: string;
}

export class NumbersResource {
    constructor(private client: RymiClient) {}

    /**
     * Retrieve a list of all phone numbers assigned to your Rymi account.
     */
    public async list(params: { limit?: number; offset?: number } = {}): Promise<{ numbers: NumberRecord[]; total: number; offset: number; limit: number }> {
        const searchParams = new URLSearchParams();
        if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
        if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
        const query = searchParams.toString();
        return this.client.get(`/numbers${query ? `?${query}` : ''}`);
    }

    public async register(number: string, params: { agent_id?: string } = {}): Promise<{ status: 'registered'; number: string; agent_id: string | null; webhook: WebhookProvisionResult | null }> {
        return this.client.post('/numbers', { number, ...params });
    }

    public async attach(number: string, agentId: string): Promise<{ status: 'attached'; agent_id: string; number: string; webhook: WebhookProvisionResult | null }> {
        return this.client.post(`/numbers/${encodeURIComponent(number)}/attach`, { agent_id: agentId });
    }

    /** Clear the agent association without deregistering the number. */
    public async detach(number: string): Promise<{ status: 'detached'; number: string }> {
        return this.client.post(`/numbers/${encodeURIComponent(number)}/detach`);
    }

    /** Re-run carrier inbound-webhook auto-provisioning for a number. */
    public async provisionWebhook(number: string): Promise<{ number: string; webhook: WebhookProvisionResult }> {
        return this.client.post(`/numbers/${encodeURIComponent(number)}/webhook`);
    }

    public async remove(number: string): Promise<{ status: 'removed'; number: string }> {
        return this.client.delete(`/numbers/${encodeURIComponent(number)}`);
    }
}
