import { RymiClient } from '../client';

export type TelephonyProvider = 'plivo' | 'twilio' | 'vonage' | 'telnyx';

export interface ConnectTelephonyParams {
    provider: TelephonyProvider;
    auth_id?: string;
    auth_token?: string;
    api_key?: string;
    api_secret?: string;
    signature_secret?: string;
    /** Telnyx Ed25519 webhook signing secret (optional). */
    auth_secret?: string;
}

export class TelephonyResource {
    constructor(private client: RymiClient) {}

    public async connect(data: ConnectTelephonyParams): Promise<{ status: 'connected'; provider: TelephonyProvider; account_name: string; message: string }> {
        return this.client.post('/telephony/connect', data);
    }

    public async disconnect(): Promise<{ status: 'disconnected'; message: string }> {
        return this.client.post('/telephony/disconnect');
    }

    public async status(): Promise<{ connected: boolean; provider: TelephonyProvider | null; account_name: string | null; account_country: string | null }> {
        return this.client.get('/telephony/status');
    }

    public async numbers(): Promise<{ numbers: any[] }> {
        return this.client.get('/telephony/numbers');
    }

    public async line(): Promise<{
        has_line: boolean;
        line: {
            id: string;
            country: 'IN' | 'US';
            status: string;
            phone_number: string | null;
            kyc_status: string;
            kyc_rejection_reason: string | null;
            kyc_missing: string[];
            terms_accepted: boolean;
            terms_version: string | null;
            outbound_suspended: boolean;
            suspended_reason: string | null;
            max_concurrent_calls: number | null;
            max_minutes_per_day: number | null;
            rental_paid_through: string | null;
            unpaid_since: string | null;
            release_at: string | null;
        } | null;
    }> {
        return this.client.get('/telephony/line');
    }

    public async requestLine(params: {
        country: 'IN' | 'US';
        handoff?: 'studio' | 'whatsapp' | 'both';
    }): Promise<{
        line_id: string;
        country: 'IN' | 'US';
        status: string;
        studio_url: string;
        whatsapp_handoff_sent: boolean;
    }> {
        return this.client.post('/telephony/line/request', params);
    }

    public async acceptLineTerms(): Promise<{
        ok: boolean;
        line_id: string;
        terms_version: string;
        terms_url: string;
    }> {
        return this.client.post('/telephony/line/accept-terms', {});
    }

    public async submitLineKyc(params: {
        fields?: Record<string, string>;
        document?: { filename: string; mime_type: string; content_base64: string };
        submit?: boolean;
    }): Promise<{
        ok: boolean;
        line_id: string;
        kyc_status: string;
        kyc_missing: string[];
        submitted: boolean;
    }> {
        return this.client.post('/telephony/line/kyc', params);
    }
}
