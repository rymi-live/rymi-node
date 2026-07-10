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
}
