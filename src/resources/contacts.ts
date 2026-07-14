import { RymiClient } from '../client';
import type { Contact } from '@rymi/sdk-types';

export interface ListContactsParams {
    limit?: number;
    offset?: number;
}

export interface ContactListResponse {
    contacts: Contact[];
    total: number;
    offset: number;
    limit: number;
}

export interface CreateContactParams {
    phone?: string;
    email?: string;
    name?: string;
    timezone?: string;
    language?: string;
    tags?: string[];
    custom_fields?: Record<string, unknown>;
    consent?: Record<string, boolean>;
    source?: string;
}

export interface CreateContactResponse {
    contact: Contact;
    deduped: boolean;
}

export interface UpdateContactParams {
    phone?: string;
    email?: string | null;
    name?: string | null;
    timezone?: string | null;
    language?: string | null;
    tags?: string[];
    custom_fields?: Record<string, unknown>;
    consent?: Record<string, boolean>;
    source?: string | null;
}

export interface ImportContactsParams {
    contacts?: Array<Record<string, unknown>>;
    csv?: string;
}

export interface ImportContactsResponse {
    created: number;
    merged: number;
    invalid: Array<{ row: number; reason: string }>;
}

export interface SetConsentParams {
    channel: 'voice' | 'sms' | 'whatsapp' | 'telegram';
    granted: boolean;
    source?: string;
    method?: string;
}

export interface SetConsentResponse {
    contact_id: string;
    channel: string;
    consent: { granted: boolean; at: string; source: string; method: string };
}

function buildQuery(params: Record<string, any>) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) sp.set(k, String(v));
    }
    const q = sp.toString();
    return q ? `?${q}` : '';
}

export class ContactsResource {
    constructor(private client: RymiClient) {}

    /** List tenant-level contacts, paginated. */
    public async list(params: ListContactsParams = {}): Promise<ContactListResponse> {
        return this.client.get(`/contacts${buildQuery(params)}`);
    }

    /**
     * Create a tenant-level contact. If a contact with the same
     * (tenant, phone) already exists, the existing row is returned instead
     * of creating a duplicate — check `deduped` in the response.
     */
    public async create(data: CreateContactParams): Promise<CreateContactResponse> {
        return this.client.post('/contacts', data);
    }

    /** Retrieve a single tenant-scoped contact by id. */
    public async get(contactId: string): Promise<{ contact: Contact }> {
        return this.client.get(`/contacts/${contactId}`);
    }

    /** Update an existing tenant-scoped contact. Only provided fields change. */
    public async update(contactId: string, data: UpdateContactParams): Promise<{ contact: Contact }> {
        return this.client.patch(`/contacts/${contactId}`, data);
    }

    /** Delete a tenant-scoped contact. */
    public async delete(contactId: string): Promise<{ status: 'deleted'; id: string }> {
        return this.client.delete(`/contacts/${contactId}`);
    }

    /**
     * Bulk import contacts from JSON rows or CSV text. Each row's phone is
     * normalized to E.164 and upserted on (tenant_id, phone); rows with
     * unparseable phones are skipped and reported in `invalid`.
     */
    public async import(data: ImportContactsParams): Promise<ImportContactsResponse> {
        return this.client.post('/contacts/import', data);
    }

    /** Record a consent grant or revoke for one channel, with evidence. Also
     *  appends an immutable row to the consent_events proof log. */
    public async setConsent(contactId: string, data: SetConsentParams): Promise<SetConsentResponse> {
        return this.client.patch(`/contacts/${contactId}/consent`, data);
    }
}
