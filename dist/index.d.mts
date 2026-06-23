import { Agent } from '@rymi/sdk-types';
export * from '@rymi/sdk-types';

interface ClientOptions {
    /**
     * The Rymi secret API key (`rymi_...`)
     */
    apiKey?: string;
    /**
     * The base URL for the API. Defaults to `https://api.rymi.live/v1`
     */
    baseURL?: string;
}
declare class RymiError extends Error {
    status?: number;
    code?: string;
    constructor(message: string, status?: number, code?: string);
}
declare class RymiClient {
    private apiKey;
    private baseURL;
    constructor(options?: ClientOptions);
    private request;
    get<T>(path: string): Promise<T>;
    post<T>(path: string, body?: any): Promise<T>;
    put<T>(path: string, body?: any): Promise<T>;
    patch<T>(path: string, body?: any): Promise<T>;
    delete<T>(path: string): Promise<T>;
}

interface CreateAgentParams {
    name: string;
    /** @deprecated Use system_prompt. This alias is mapped before the request is sent. */
    prompt?: string;
    system_prompt?: string;
    voice?: string;
    persona?: any;
    playbook?: any;
    advanced?: any;
    features?: any;
    post_call?: any;
    llm_provider?: 'gemini' | 'openai' | 'anthropic' | 'sarvam';
    llm_model?: string;
    llm_fallback_provider?: string | null;
    llm_fallback_model?: string | null;
    stt_provider?: string;
    stt_model?: string;
    stt_fallback_provider?: string | null;
    stt_fallback_model?: string | null;
    tts_provider?: string;
    tts_model?: string;
    tts_fallback_provider?: string | null;
    tts_fallback_model?: string | null;
    /** Self-hosted endpoint URLs (https:// or wss://). Enterprise only. */
    custom_llm_url?: string | null;
    custom_voice_url?: string | null;
    custom_voice_mode?: 'rymi' | 'openai-compat';
    custom_transcriber_url?: string | null;
    agent_role?: 'operator' | 'specialist' | 'executive' | 'concierge';
    language?: string | null;
    /** All BCP-47 languages the agent should handle, e.g. ["hi-IN","en-US"] for a bilingual agent. */
    supported_languages?: string[];
    provider_config?: any;
}
interface UpdateAgentParams {
    name?: string;
    /** @deprecated Use system_prompt. This alias is mapped before the request is sent. */
    prompt?: string;
    system_prompt?: string;
    voice?: string;
    persona?: any;
    playbook?: any;
    advanced?: any;
    features?: any;
    post_call?: any;
    llm_provider?: 'gemini' | 'openai' | 'anthropic' | 'sarvam';
    llm_model?: string;
    llm_fallback_provider?: string | null;
    llm_fallback_model?: string | null;
    stt_provider?: string;
    stt_model?: string;
    stt_fallback_provider?: string | null;
    stt_fallback_model?: string | null;
    tts_provider?: string;
    tts_model?: string;
    tts_fallback_provider?: string | null;
    tts_fallback_model?: string | null;
    /** Self-hosted endpoint URLs (https:// or wss://). Enterprise only. */
    custom_llm_url?: string | null;
    custom_voice_url?: string | null;
    custom_voice_mode?: 'rymi' | 'openai-compat';
    custom_transcriber_url?: string | null;
    agent_role?: 'operator' | 'specialist' | 'executive' | 'concierge';
    language?: string | null;
    /** All BCP-47 languages the agent should handle, e.g. ["hi-IN","en-US"] for a bilingual agent. */
    supported_languages?: string[];
    chat_summary?: string | null;
    provider_config?: any;
}
interface AgentListResponse {
    agents: Agent[];
    total: number;
    offset: number;
    limit: number;
}
interface AgentCallListResponse {
    calls: any[];
    total: number;
    offset: number;
    limit: number;
    agent_id: string;
}
interface ValidatePublishParams {
    agent_id?: string;
    name?: string;
    voice?: string;
    persona?: any;
    playbook?: any;
    advanced?: any;
    features?: any;
    post_call?: any;
    [key: string]: any;
}
interface PublishValidationIssue {
    severity?: string;
    section?: string;
    title?: string;
    detail?: string;
    [key: string]: any;
}
interface PublishAgentResponse {
    published: boolean;
    agent_id?: string;
    /** Present when published — the frozen snapshot id and timestamp. */
    snapshot_id?: string | null;
    published_at?: string | null;
    /** Present when published: false because of unresolved blockers. */
    reason?: string;
    blockers?: PublishValidationIssue[];
    warnings?: PublishValidationIssue[];
    error?: string;
    details?: string;
}
interface ChangeEntry {
    key: string;
    value: any;
}
interface ApplyChangesParams {
    currentConfig: Record<string, any>;
    changes: ChangeEntry[];
    mode: 'create' | 'edit';
    lenient?: boolean;
}
interface ApplyChangesResponse {
    valid: true;
    config: Record<string, any>;
    applied: ChangeEntry[];
}
interface EnrichCompanyParams {
    companyName: string;
    websiteUrl: string;
}
interface EnrichCompanyResponse {
    enriched: boolean;
    companyDescription?: string;
    knowledgeBase?: any[];
    error?: string;
}
interface PreviewStackParams {
    /** Cost/capability role. `concierge` is not supported by this endpoint. */
    agent_role?: 'operator' | 'specialist' | 'executive';
    role?: 'operator' | 'specialist' | 'executive';
    language?: string | null;
    /** Required, non-empty list of BCP-47 languages to resolve a stack for. */
    supported_languages: string[];
    current_provider_config?: Record<string, any> | null;
}
interface AgentKnowledgeSource {
    id: string;
    kind?: 'text' | 'url';
    title?: string;
    source_uri?: string | null;
    bytes?: number;
    created_at?: string;
    [key: string]: any;
}
type AddKnowledgeSourceParams = {
    kind: 'text';
    title: string;
    text: string;
} | {
    kind: 'url';
    title: string;
    url: string;
};
interface AgentChange {
    change_id: string;
    field_path?: string;
    before_jsonb?: any;
    after_jsonb?: any;
    changed_by?: string;
    created_at?: string;
    undone_at?: string | null;
    [key: string]: any;
}
declare class AgentsResource {
    private client;
    constructor(client: RymiClient);
    /**
     * Retrieve a list of all your AI Agents.
     */
    list(params?: {
        limit?: number;
        offset?: number;
    }): Promise<AgentListResponse>;
    /**
     * Retrieve a single AI Agent by its unique ID.
     */
    retrieve(agentId: string): Promise<Agent>;
    /**
     * Create a new AI Agent with a complete system prompt and voice settings.
     */
    create(data: CreateAgentParams): Promise<{
        status: 'created';
        id: string;
    }>;
    /**
     * Update an existing AI Agent's persona or configuration.
     */
    update(agentId: string, data: UpdateAgentParams): Promise<{
        status: 'updated';
    }>;
    /**
     * Delete an AI Agent permanently.
     */
    delete(agentId: string): Promise<{
        status: 'deleted';
        id: string;
    }>;
    llmOptions(): Promise<{
        models: any[];
        voices: any[];
    }>;
    generate(data: {
        prompt: string;
        options?: Record<string, any>;
    }): Promise<Record<string, any>>;
    /**
     * List calls made with a specific agent.
     */
    listCalls(agentId: string, params?: {
        limit?: number;
        offset?: number;
        status?: string;
    }): Promise<AgentCallListResponse>;
    /**
     * Duplicate an existing agent. The clone gets " (Copy)" appended to its name.
     */
    clone(agentId: string): Promise<{
        status: 'created';
        id: string;
    }>;
    /**
     * Validate an agent's configuration before publishing.
     * Pass agent_id to merge with an existing persisted agent, or supply fields directly.
     */
    validatePublish(params: ValidatePublishParams): Promise<Record<string, any>>;
    /**
     * Publish an agent: validate its persisted config and freeze it into the
     * published snapshot the harness/review pipeline reads as the baseline.
     * Returns `{ published: false, blockers }` (HTTP 200) when blockers remain —
     * inspect `blockers` rather than relying on a thrown error.
     */
    publish(agentId: string): Promise<PublishAgentResponse>;
    /**
     * Validate and apply a flat-diff change-set against the AgentConfig field registry.
     * Does NOT persist — callers must follow up with update().
     */
    applyChanges(params: ApplyChangesParams): Promise<ApplyChangesResponse>;
    /**
     * Use AI with Google Search grounding to generate a company description from a website URL.
     */
    enrichCompany(params: EnrichCompanyParams): Promise<EnrichCompanyResponse>;
    /**
     * Preview the resolved per-language model stack (STT/LLM/TTS), blockers,
     * warnings, model diffs, and any required role upgrades for a set of
     * supported languages — without persisting anything. Note: the concierge
     * (realtime) role is not supported by this endpoint.
     */
    previewStack(params: PreviewStackParams): Promise<Record<string, any>>;
    /**
     * List the knowledge sources (RAG context) attached to an agent.
     */
    listKnowledgeSources(agentId: string): Promise<{
        sources: AgentKnowledgeSource[];
    }>;
    /**
     * Add a knowledge source to an agent from raw text or a URL.
     */
    addKnowledgeSource(agentId: string, data: AddKnowledgeSourceParams): Promise<Record<string, any>>;
    /**
     * Delete a knowledge source from an agent.
     */
    deleteKnowledgeSource(agentId: string, sourceId: string): Promise<Record<string, any>>;
    /**
     * List the recorded configuration changes for an agent (most recent first).
     * Optionally pass an ISO timestamp to only return changes since then.
     */
    listChanges(agentId: string, params?: {
        since?: string;
    }): Promise<{
        changes: AgentChange[];
    }>;
    /**
     * Undo a single recorded configuration change, reverting that field to its
     * previous value. Returns the resulting agent snapshot.
     */
    undoChange(agentId: string, changeId: string): Promise<{
        ok: boolean;
        changeId: string;
        agentSnapshot: Agent;
    }>;
    /**
     * Run the evaluation suite for an agent. mode="synthetic" (default) uses
     * the offline scorer; mode="live" runs the model-driven runner.
     */
    runEvals(agentId: string, params?: {
        mode?: 'synthetic' | 'live';
    }): Promise<Record<string, any>>;
    /**
     * List previous evaluation runs for an agent.
     */
    listEvalRuns(agentId: string): Promise<Record<string, any>>;
    /**
     * Retrieve a single evaluation run, including per-scenario scores.
     */
    getEvalRun(agentId: string, runId: string): Promise<Record<string, any>>;
}

interface ListCallsParams {
    limit?: number;
    offset?: number;
    cursor?: string;
    status?: string;
}
interface CallRecord {
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
interface CallListResponse {
    calls: CallRecord[];
    total: number;
    limit: number;
    offset: number;
    next_cursor?: string | null;
}
interface CreateCallParams {
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
interface BatchCallParams {
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
interface CreateCallResponse {
    id: string;
    room_name: string;
    status: string;
    participants: Array<{
        id: string;
        transport: 'webrtc' | 'pstn';
        identity: string;
        status: string;
        access?: {
            url: string;
            token: string;
        };
        telephony_leg_id?: string;
        job_id?: string;
    }>;
    agent?: {
        id: string;
        name: string;
    };
}
declare class CallsResource {
    private client;
    constructor(client: RymiClient);
    /**
     * Retrieve a list of all previous and active calls.
     */
    list(params?: ListCallsParams): Promise<CallListResponse>;
    /**
     * Retrieve calls currently in progress.
     */
    active(params?: ListCallsParams): Promise<CallListResponse>;
    /**
     * Retrieve details, transcripts, and analysis of a single call by its unique ID.
     */
    retrieve(callId: string): Promise<CallRecord>;
    /**
     * Dispatch an outbound phone call securely using your configured carrier.
     */
    create(data: CreateCallParams): Promise<CreateCallResponse>;
    /**
     * Queue up to 500 outbound PSTN recipients in one request.
     */
    batch(data: BatchCallParams): Promise<CreateCallResponse & {
        batch_id: string;
        queued: number;
    }>;
    summary(callId: string): Promise<Record<string, any>>;
    transcript(callId: string): Promise<Record<string, any>>;
    recording(callId: string): Promise<Record<string, any>>;
    reprocess(callId: string): Promise<Record<string, any>>;
    /** Force-end an active call. Irreversible — closes the LiveKit room and triggers post-call processing. */
    end(callId: string): Promise<{
        status: string;
        id: string;
        message: string;
    }>;
    /** Add one or more participants to an in-progress call (warm transfer / conference). */
    addParticipants(callId: string, data: {
        participants: CreateCallParams['participants'];
    }): Promise<CreateCallResponse>;
    queueStats(): Promise<Record<string, number>>;
}

interface DncEntry {
    id?: string;
    phone: string;
    reason?: string;
    created_at?: string;
}
interface DncListResponse {
    dnc_entries: DncEntry[];
    total: number;
    offset: number;
    limit: number;
}
interface DncCheckResult {
    phone_number: string;
    normalized: string | null;
    blocked: boolean;
    valid: boolean;
}
/**
 * Do-Not-Call registry. Numbers are normalized to E.164 server-side on both
 * write and read, so any input format is accepted.
 */
declare class DncResource {
    private client;
    constructor(client: RymiClient);
    /** List all DNC entries for the tenant. */
    list(params?: {
        limit?: number;
        offset?: number;
    }): Promise<DncListResponse>;
    /** Add a single number to the Do-Not-Call registry. */
    add(data: {
        phone_number: string;
        reason?: string;
    }): Promise<{
        status: 'blocklisted';
        phone_number: string;
    }>;
    /** Add up to 1000 numbers in one request. Invalid numbers are skipped and returned in `invalid`. */
    addBatch(data: {
        phone_numbers: string[];
        reason?: string;
    }): Promise<{
        status: 'blocklisted';
        count: number;
        invalid_count: number;
        invalid: string[];
    }>;
    /** Check up to 500 numbers without adding them. Read-only. */
    check(data: {
        phone_numbers: string[];
    }): Promise<{
        results: DncCheckResult[];
        blocked_count: number;
        total_checked: number;
    }>;
    /** Remove a number from the registry (re-enables outbound to it). */
    remove(phone: string): Promise<{
        status: 'removed';
        phone: string;
    }>;
}

interface NumberRecord {
    id?: string;
    number?: string;
    phone_number?: string;
    provider?: 'plivo' | 'twilio' | 'vonage';
    capabilities?: string[];
    price?: string | number;
    monthly_price?: number;
    agent_id?: string | null;
    assigned_agent_id?: string | null;
    created_at?: string;
}
declare class NumbersResource {
    private client;
    constructor(client: RymiClient);
    /**
     * Retrieve a list of all phone numbers assigned to your Rymi account.
     */
    list(params?: {
        limit?: number;
        offset?: number;
    }): Promise<{
        numbers: NumberRecord[];
        total: number;
        offset: number;
        limit: number;
    }>;
    register(number: string, params?: {
        agent_id?: string;
    }): Promise<{
        status: 'registered';
        number: string;
        agent_id: string | null;
    }>;
    attach(number: string, agentId: string): Promise<{
        status: 'attached';
        agent_id: string;
        number: string;
    }>;
    remove(number: string): Promise<{
        status: 'removed';
        number: string;
    }>;
}

interface WebhookRecord {
    id: string;
    url: string;
    events: string[];
    alert_email?: string | null;
    created_at?: string;
}
declare class WebhooksResource {
    private client;
    constructor(client: RymiClient);
    /** List registered webhook endpoints. The signing secret is never returned. */
    list(params?: {
        limit?: number;
        offset?: number;
    }): Promise<{
        webhooks: WebhookRecord[];
        total: number;
        offset: number;
        limit: number;
    }>;
    /** Register a webhook. `url` must be public https. `secret` must be 16–256 chars. */
    create(data: {
        url: string;
        events: string[];
        secret: string;
        alert_email?: string;
    }): Promise<{
        status: 'registered';
    }>;
    /** Update a webhook. Only provided fields change. Pass `secret` to rotate it. */
    update(id: string, data: {
        url?: string;
        events?: string[];
        secret?: string;
        alert_email?: string | null;
    }): Promise<{
        status: 'updated';
        id: string;
    }>;
    /** Delete a webhook endpoint. */
    delete(id: string): Promise<{
        status: 'deleted';
        id: string;
    }>;
    /**
     * Verifies that a webhook received by your backend was genuinely dispatched by Rymi.
     *
     * Rymi endpoints secure webhooks by computing an HMAC-SHA256 signature
     * of the raw JSON body concatenated with the timestamp, using your Webhook Secret.
     *
     * @param payload The raw stringified JSON body of the webhook hook request.
     * @param signatureHeader The value of the `X-Rymi-Signature` header from the request.
     * @param timestampHeader The value of the `X-Rymi-Timestamp` header from the request.
     * @param webhookSecret Your project's unique Webhook Signing Secret (starts with `whsec_`)
     * @param toleranceMillis Allowed time difference in milliseconds to prevent replay attacks (default 5 mins)
     *
     * @throws {Error} if the signature is invalid or if the timestamp exceeds the tolerance.
     */
    verifySignature(payload: string, signatureHeader: string, timestampHeader: string, webhookSecret: string, toleranceMillis?: number): boolean;
}

interface PublishableKeyRecord {
    id: string;
    key_prefix: string;
    agent_id: string;
    label: string;
    allowed_channels: Array<'web' | 'phone'>;
    audience: 'sdk' | 'landing_demo';
    default_from_number: string | null;
    created_at: string;
}
interface CreatePublishableKeyParams {
    agent_id: string;
    label: string;
    allowed_channels?: Array<'web' | 'phone'>;
    audience?: 'sdk' | 'landing_demo';
    default_from_number?: string | null;
}
declare class KeysResource {
    private client;
    constructor(client: RymiClient);
    listPublishable(): Promise<{
        keys: PublishableKeyRecord[];
    }>;
    createPublishable(data: CreatePublishableKeyParams): Promise<CreatePublishableKeyParams & {
        key: string;
    }>;
    revokePublishable(id: string): Promise<{
        success: true;
    }>;
}

type TelephonyProvider = 'plivo' | 'twilio' | 'vonage';
interface ConnectTelephonyParams {
    provider: TelephonyProvider;
    auth_id?: string;
    auth_token?: string;
    api_key?: string;
    api_secret?: string;
    signature_secret?: string;
}
declare class TelephonyResource {
    private client;
    constructor(client: RymiClient);
    connect(data: ConnectTelephonyParams): Promise<{
        status: 'connected';
        provider: TelephonyProvider;
        account_name: string;
        message: string;
    }>;
    disconnect(): Promise<{
        status: 'disconnected';
        message: string;
    }>;
    status(): Promise<{
        connected: boolean;
        provider: TelephonyProvider | null;
        account_name: string | null;
        account_country: string | null;
    }>;
    numbers(): Promise<{
        numbers: any[];
    }>;
}

interface UsageSummary {
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
declare class BillingResource {
    private client;
    constructor(client: RymiClient);
    /**
     * Lane-aware usage summary: remaining voice-runtime minutes, Studio AI unit
     * usage, and post-call intelligence usage. Voice balance is reported in
     * MINUTES (the customer-facing unit), not dollars.
     */
    usageSummary(): Promise<UsageSummary>;
    /** Estimate the cost of a call for a given tier and duration. */
    estimate(data?: {
        tier?: 'operator' | 'specialist' | 'executive' | 'concierge';
        duration_seconds?: number;
    }): Promise<Record<string, any>>;
    /** Configure auto-recharge. Server rejects (400) if enabled && pack_usd <= threshold_usd. */
    setAutoRecharge(data: {
        enabled?: boolean;
        pack_usd?: number;
        threshold_usd?: number;
    }): Promise<{
        ok: true;
    }>;
    /** Configure spend-alert preferences. */
    setAlerts(data: {
        thresholds_usd?: number[];
        low_balance_pct?: number;
        email_enabled?: boolean;
    }): Promise<{
        ok: true;
    }>;
}

interface AgentTemplateSummary {
    id?: string;
    slug?: string;
    label?: string;
    description?: string;
    icon?: string;
    color?: string;
    defaults?: Record<string, any>;
    [key: string]: any;
}
declare class TemplatesResource {
    private client;
    constructor(client: RymiClient);
    /**
     * List published agent templates available to the current tenant. Use a
     * template's `defaults` as the starting config for create_agent.
     */
    list(): Promise<{
        templates: AgentTemplateSummary[];
        source?: string;
    }>;
}

declare class Rymi {
    private client;
    agents: AgentsResource;
    calls: CallsResource;
    dnc: DncResource;
    numbers: NumbersResource;
    webhooks: WebhooksResource;
    keys: KeysResource;
    telephony: TelephonyResource;
    billing: BillingResource;
    templates: TemplatesResource;
    constructor(options?: ClientOptions);
}

export { type AddKnowledgeSourceParams, type AgentCallListResponse, type AgentChange, type AgentKnowledgeSource, type AgentListResponse, type AgentTemplateSummary, AgentsResource, type ApplyChangesParams, type ApplyChangesResponse, type BatchCallParams, BillingResource, type CallListResponse, type CallRecord, CallsResource, type ChangeEntry, type ClientOptions, type ConnectTelephonyParams, type CreateAgentParams, type CreateCallParams, type CreateCallResponse, type CreatePublishableKeyParams, type DncCheckResult, type DncEntry, type DncListResponse, DncResource, type EnrichCompanyParams, type EnrichCompanyResponse, KeysResource, type ListCallsParams, type NumberRecord, NumbersResource, type PreviewStackParams, type PublishAgentResponse, type PublishValidationIssue, type PublishableKeyRecord, Rymi, RymiClient, RymiError, type TelephonyProvider, TelephonyResource, TemplatesResource, type UpdateAgentParams, type UsageSummary, type ValidatePublishParams, type WebhookRecord, WebhooksResource, Rymi as default };
