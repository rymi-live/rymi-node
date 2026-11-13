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

    /** Set the billing country. Locked after the first paid invoice (409 billing_country_locked). */
    public async setCountry(billingCountry: string): Promise<{ ok: true; billing_country: string }> {
        return this.client.put('/billing/country', { billing_country: billingCountry });
    }

    /** List available monthly plans (Starter, Scale, Business). Returns 404 when RYMI_PLANS is off. */
    public async listPlans(): Promise<Record<string, any>> {
        return this.client.get('/billing/plans');
    }

    /** Get the account's current plan and credit state. */
    public async getPlan(): Promise<Record<string, any>> {
        return this.client.get('/billing/plan');
    }

    /** Turn off auto-renewal on the current monthly plan so it expires to Pay As You Go. */
    public async cancelPlan(): Promise<Record<string, any>> {
        return this.client.post('/billing/plan/cancel', {});
    }

    /** Schedule a downgrade to a cheaper plan (free, starter, or scale) at the next renewal. */
    public async downgradePlan(data: { plan_id: 'free' | 'starter' | 'scale' }): Promise<Record<string, any>> {
        return this.client.post('/billing/plan/downgrade', data);
    }
}
