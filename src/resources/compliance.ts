import { RymiClient } from '../client';

export interface AttestParams {
    kind: 'dnc_external_scrub' | 'ai_disclosure';
    note?: string;
}

export interface Attestation {
    id: string;
    tenant_id: string;
    kind: string;
    attested_by: string | null;
    note: string | null;
    created_at: string;
}

export interface AttestResponse {
    attestation: Attestation;
}

export interface ListAttestationsResponse {
    attestations: Attestation[];
}

export interface CallingRules {
    /** Callee-local hours; null = any hour. */
    calling_hours: { start_hour: number; end_hour: number } | null;
    dnc_check: boolean;
    require_voice_consent: boolean;
    /** Recording notice default for new agents. */
    recording_notice: boolean;
    /** null = every supported country. */
    destination_countries: string[] | null;
    apply_to_single_calls: boolean;
}

export interface ComplianceSettings {
    operating_country: string | null;
    configured: boolean;
    inherited_from: string | null;
    rules: CallingRules;
    edited: Array<keyof CallingRules>;
    presets: Record<string, CallingRules>;
}

export class ComplianceResource {
    constructor(private client: RymiClient) {}

    /** Record a compliance attestation (append-only). Campaign launch blockers
     *  in `attested` mode read the most recent one of the matching `kind`. */
    public async attest(data: AttestParams): Promise<AttestResponse> {
        return this.client.post('/compliance/attestations', data);
    }

    /** List the tenant's 50 most recent compliance attestations, newest first. */
    public async listAttestations(): Promise<ListAttestationsResponse> {
        return this.client.get('/compliance/attestations');
    }

    /** The workspace's compliance settings, with every country preset. */
    public async getSettings(): Promise<ComplianceSettings> {
        return this.client.get('/compliance/settings');
    }

    /** Choosing operating_country fills every setting you haven't edited from its preset. */
    public async updateSettings(data: { operating_country?: string | null; rules?: Partial<CallingRules> }): Promise<ComplianceSettings> {
        return this.client.put('/compliance/settings', data);
    }

    /** What choosing a country would change, before saving. */
    public async previewSettings(country: string): Promise<{ country: string; changes: Array<{ key: keyof CallingRules; from: unknown; to: unknown }> }> {
        return this.client.get(`/compliance/settings/preview?country=${encodeURIComponent(country)}`);
    }
}
