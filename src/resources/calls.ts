import { RymiClient } from '../client';

export interface ListCallsParams {
    limit?: number;
    offset?: number;
    cursor?: string;
    status?: string;
}

export interface CallRecord {
    id: string;
    agent_id: string;
    room_name: string;
    status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'busy' | 'canceled';
    duration_seconds?: number;
    started_at?: string;
    ended_at?: string;
    participants?: Array<{
        id: string;
        role: 'agent' | 'customer' | 'observer';
        transport: 'webrtc' | 'pstn' | 'sip' | 'internal';
        identity: string;
        status: string;
    }>;
    metadata?: Record<string, any>;
    intelligence_status?: string;
    participant_count?: number;
    primary_participant?: Record<string, any> | null;
    total_cost?: number;
    provider_cost?: number;
    provider_cost_breakdown?: Record<string, any>;
    provider_cost_calculated_at?: string | null;
    bill_duration?: number;
}

export interface CallListResponse {
    calls: CallRecord[];
    total: number;
    limit: number;
    offset: number;
    next_cursor?: string | null;
}

export interface CreateCallParams {
    agent_id: string;
    participants: Array<{
        transport: 'webrtc' | 'pstn';
        identity: string;
        from_number?: string;
        metadata?: Record<string, any>;
    }>;
    metadata?: Record<string, any>;
    variables?: Record<string, any>;
    post_call?: Record<string, any>;
}

export interface BatchCallParams {
    agent_id: string;
    to?: string[];
    recipients?: Array<{
        to?: string;
        identity?: string;
        phone?: string;
        phone_number?: string;
        from_number?: string;
        metadata?: Record<string, any>;
    }>;
    from_number?: string;
    batch_id?: string;
    metadata?: Record<string, any>;
    variables?: Record<string, any>;
    post_call?: Record<string, any>;
}

export interface FanoutCallParams {
    agent_id: string;
    to?: string[];
    recipients?: Array<{
        to?: string;
        identity?: string;
        phone?: string;
        phone_number?: string;
        from_number?: string;
        metadata?: Record<string, any>;
    }>;
    from_number?: string;
    /** Preferred tracking id for this fanout. Falls back to batch_id, then auto-generated. */
    fanout_id?: string;
    /** Compatibility alias for fanout_id. */
    batch_id?: string;
    metadata?: Record<string, any>;
    variables?: Record<string, any>;
    post_call?: Record<string, any>;
}

export interface CreateCallResponse {
    id: string;
    room_name: string;
    status: string;
    participants: Array<{
        id: string;
        transport: 'webrtc' | 'pstn';
        identity: string;
        status: string;
        access?: { url: string; token: string };
        telephony_leg_id?: string;
        job_id?: string;
    }>;
    agent?: { id: string; name: string };
}

function buildQuery(params: Record<string, any>) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            searchParams.set(key, String(value));
        }
    }
    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

export class CallsResource {
    constructor(private client: RymiClient) {}

    /**
     * Retrieve a list of all previous and active calls.
     */
    public async list(params: ListCallsParams = {}): Promise<CallListResponse> {
        return this.client.get<CallListResponse>(`/calls${buildQuery(params)}`);
    }

    /**
     * Retrieve calls currently in progress.
     */
    public async active(params: ListCallsParams = {}): Promise<CallListResponse> {
        return this.client.get<CallListResponse>(`/calls/active${buildQuery(params)}`);
    }

    /**
     * Retrieve details, transcripts, and analysis of a single call by its unique ID.
     */
    public async retrieve(callId: string): Promise<CallRecord> {
        return this.client.get<CallRecord>(`/calls/${callId}`);
    }

    /**
     * Dispatch an outbound phone call securely using your configured carrier.
     */
    public async create(data: CreateCallParams): Promise<CreateCallResponse> {
        return this.client.post('/calls', data);
    }

    /**
     * Group call fanout: dial up to 500 PSTN participants into a single call room.
     * Every recipient joins the same call. For independent per-recipient attempts,
     * retries, and reports, use `campaigns` instead.
     */
    public async fanout(data: FanoutCallParams): Promise<CreateCallResponse & { fanout_id: string; batch_id: string; queued: number }> {
        return this.client.post('/calls/fanout', data);
    }

    /**
     * Compatibility alias for {@link fanout}. Creates one call room with multiple
     * PSTN participants. Queue up to 500 outbound PSTN recipients in one request.
     */
    public async batch(data: BatchCallParams): Promise<CreateCallResponse & { batch_id: string; queued: number }> {
        return this.client.post('/calls/batch', data);
    }

    public async summary(callId: string): Promise<Record<string, any>> {
        return this.client.get(`/calls/${callId}/summary`);
    }

    public async transcript(callId: string): Promise<Record<string, any>> {
        return this.client.get(`/calls/${callId}/transcript`);
    }

    public async recording(callId: string): Promise<Record<string, any>> {
        return this.client.get(`/calls/${callId}/recording`);
    }

    public async reprocess(callId: string): Promise<Record<string, any>> {
        return this.client.post(`/calls/${callId}/reprocess`);
    }

    /** Force-end an active call. Irreversible — closes the LiveKit room and triggers post-call processing. */
    public async end(callId: string): Promise<{ status: string; id: string; message: string }> {
        return this.client.post(`/calls/${callId}/end`);
    }

    /** Add one or more participants to an in-progress call (warm transfer / conference). */
    public async addParticipants(
        callId: string,
        data: { participants: CreateCallParams['participants'] }
    ): Promise<CreateCallResponse> {
        return this.client.post(`/calls/${callId}/participants`, data);
    }

    public async queueStats(): Promise<Record<string, number>> {
        return this.client.get('/calls/queue/stats');
    }
}
