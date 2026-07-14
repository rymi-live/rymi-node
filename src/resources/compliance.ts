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
}
