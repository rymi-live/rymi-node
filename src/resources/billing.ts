import { RymiClient } from '../client';

export interface UsageSummary {
    voice_runtime: {
        remaining_minutes: number;
        status: string;
    };
    studio_ai?: {
        used_units?: number;
        included_units?: number | null;
        quota_percent?: number;
        status?: string;
        overage_enabled?: boolean;
    };
    post_call_intelligence?: {
        status?: string;
        used_units?: number;
    };
}

export class BillingResource {
    constructor(private client: RymiClient) {}

    /**
     * Lane-aware usage summary: remaining voice-runtime minutes, Studio AI unit
     * usage, and post-call intelligence usage. Voice balance is reported in
     * MINUTES (the customer-facing unit), not dollars.
     */
    public async usageSummary(): Promise<UsageSummary> {
        return this.client.get<UsageSummary>('/billing/usage-summary');
    }

    /** Estimate the cost of a call for a custom model stack and duration. */
    public async estimate(data: { stt_model?: string; llm_model?: string; tts_model?: string; duration_seconds?: number } = {}): Promise<Record<string, any>> {
        return this.client.post('/billing/estimate', data);
    }

    /** Configure auto-recharge. Server rejects (400) if enabled && pack_usd <= threshold_usd. */
    public async setAutoRecharge(data: { enabled?: boolean; pack_usd?: number; threshold_usd?: number }): Promise<{ ok: true }> {
        return this.client.put('/billing/auto-recharge', data);
    }

    /** Configure spend-alert preferences. */
    public async setAlerts(data: { thresholds_usd?: number[]; low_balance_pct?: number; email_enabled?: boolean }): Promise<{ ok: true }> {
        return this.client.put('/billing/alerts', data);
    }
}
