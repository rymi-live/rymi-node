import { Agent, CampaignAttempt, Campaign, CampaignMember, CampaignReport, CampaignStatus, CampaignType, CampaignGoal, CampaignCompliancePolicy, Contact } from '@rymi/sdk-types';
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
    /**
     * Custom fetch implementation. Lets embedders route requests without a
     * network socket (e.g. Fastify app.inject). Defaults to global fetch.
     */
    fetch?: typeof globalThis.fetch;
}
declare class RymiError extends Error {
    status?: number;
    code?: string;
    constructor(message: string, status?: number, code?: string);
}
declare class RymiClient {
    private apiKey;
    private baseURL;
    private fetchImpl;
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
     * warnings, and model diffs for a set of supported languages — without
     * persisting anything.
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
        judge?: boolean;
    }): Promise<Record<string, any>>;
    /**
     * Run the eval SUITE across many agents at once (agents × seeded scenarios),
     * bounded by the optional concurrency cap. One eval run is persisted per
     * agent; the aggregate EvalSuiteReport is returned. Pass `judge: true` to
     * supplement the heuristics with the opt-in LLM judge (needs a Gemini key).
     */
    runEvalSuite(params: {
        agentIds: string[];
        scenarioIds?: string[];
        concurrency?: number;
        judge?: boolean;
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
interface FanoutCallParams {
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
     * Group call fanout: dial up to 500 PSTN participants into a single call room.
     * Every recipient joins the same call. For independent per-recipient attempts,
     * retries, and reports, use `campaigns` instead.
     */
    fanout(data: FanoutCallParams): Promise<CreateCallResponse & {
        fanout_id: string;
        batch_id: string;
        queued: number;
    }>;
    /**
     * Compatibility alias for {@link fanout}. Creates one call room with multiple
     * PSTN participants. Queue up to 500 outbound PSTN recipients in one request.
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
interface WebhookProvisionResult {
    status: 'configured' | 'manual_required' | 'failed' | 'no_carrier';
    provider: string | null;
    webhookUrl: string | null;
    verified: boolean;
    error?: string;
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
        webhook: WebhookProvisionResult | null;
    }>;
    attach(number: string, agentId: string): Promise<{
        status: 'attached';
        agent_id: string;
        number: string;
        webhook: WebhookProvisionResult | null;
    }>;
    /** Clear the agent association without deregistering the number. */
    detach(number: string): Promise<{
        status: 'detached';
        number: string;
    }>;
    /** Re-run carrier inbound-webhook auto-provisioning for a number. */
    provisionWebhook(number: string): Promise<{
        number: string;
        webhook: WebhookProvisionResult;
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

type TelephonyProvider = 'plivo' | 'twilio' | 'vonage' | 'telnyx';
interface ConnectTelephonyParams {
    provider: TelephonyProvider;
    auth_id?: string;
    auth_token?: string;
    api_key?: string;
    api_secret?: string;
    signature_secret?: string;
    /** Telnyx Ed25519 webhook signing secret (optional). */
    auth_secret?: string;
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
    /** Estimate the cost of a call for a custom model stack and duration. */
    estimate(data?: {
        stt_model?: string;
        llm_model?: string;
        tts_model?: string;
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

interface ListCampaignsParams {
    limit?: number;
    offset?: number;
    status?: CampaignStatus;
    type?: CampaignType;
    agent_id?: string;
}
interface CampaignListResponse {
    campaigns: Campaign[];
    total: number;
    offset: number;
    limit: number;
}
interface CreateCampaignParams {
    agent_id: string;
    type: CampaignType;
    name: string;
    goal?: CampaignGoal;
    schedule_policy?: Record<string, unknown>;
    retry_policy?: Record<string, unknown>;
    concurrency_policy?: Record<string, unknown>;
    automation_policy?: Record<string, unknown>;
    reporting_policy?: Record<string, unknown>;
    compliance_policy?: CampaignCompliancePolicy;
    metadata?: Record<string, unknown>;
}
interface UpdateCampaignParams {
    name?: string;
    goal?: CampaignGoal;
    schedule_policy?: Record<string, unknown>;
    retry_policy?: Record<string, unknown>;
    concurrency_policy?: Record<string, unknown>;
    automation_policy?: Record<string, unknown>;
    reporting_policy?: Record<string, unknown>;
    compliance_policy?: CampaignCompliancePolicy;
    post_call_config_override?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
interface LaunchBlocker {
    code: string;
    ok: boolean;
    detail?: string;
}
interface LaunchCampaignResponse {
    campaign: Campaign;
    blockers: LaunchBlocker[];
}
/**
 * GET /campaigns/:id/report response. Extends the shared CampaignReport with
 * the report-endpoint-only derived fields (top failure reasons + cost per
 * success) that the API adds on top of the persisted shape.
 */
interface CampaignReportResponse extends CampaignReport {
    distributions: CampaignReport['distributions'] & {
        top_failure_reasons: Array<{
            reason: string;
            count: number;
        }>;
        cost_per_success_credits: number;
    };
}
interface ListCampaignMembersParams {
    limit?: number;
    offset?: number;
    status?: string;
}
interface CampaignMemberListResponse {
    members: CampaignMember[];
    total: number;
    offset: number;
    limit: number;
}
interface AddCampaignMembersParams {
    contact_ids: string[];
    variables_override?: Record<string, string>;
}
interface ImportCampaignMembersParams {
    contacts?: Array<Record<string, unknown>>;
    csv?: string;
}
interface ImportCampaignMembersResponse {
    created: number;
    merged: number;
    /** Members attached to the campaign in this import. */
    attached: number;
    invalid: Array<{
        row: number;
        reason: string;
    }>;
}
interface UpdateCampaignMemberParams {
    status?: string;
    variables_override?: Record<string, string>;
    next_attempt_at?: string;
}
declare class CampaignMembersResource {
    private client;
    constructor(client: RymiClient);
    /** List a campaign's members, paginated. */
    list(campaignId: string, params?: ListCampaignMembersParams): Promise<CampaignMemberListResponse>;
    /** Attach existing contacts to a campaign as members. */
    add(campaignId: string, data: AddCampaignMembersParams): Promise<{
        members: CampaignMember[];
    }>;
    /** Import inline contact rows (JSON or CSV): creates/merges contacts and attaches members in one call. */
    import(campaignId: string, data: ImportCampaignMembersParams): Promise<ImportCampaignMembersResponse>;
    /** Update a campaign member (status, variables, next attempt time). */
    update(campaignId: string, memberId: string, data: UpdateCampaignMemberParams): Promise<{
        member: CampaignMember;
    }>;
    /** Remove a member from a campaign. */
    remove(campaignId: string, memberId: string): Promise<{
        status: 'deleted';
        id: string;
    }>;
}
interface CampaignRoute {
    id: string;
    tenant_id: string;
    campaign_id: string;
    phone_number: string;
    schedule: Record<string, unknown>;
    active: boolean;
    created_at: string;
    updated_at: string;
}
interface ListCampaignRoutesParams {
    limit?: number;
    offset?: number;
}
interface CampaignRouteListResponse {
    routes: CampaignRoute[];
    total: number;
    offset: number;
    limit: number;
}
interface CreateCampaignRouteParams {
    phone_number: string;
    schedule?: Record<string, unknown>;
    active?: boolean;
}
interface UpdateCampaignRouteParams {
    schedule?: Record<string, unknown>;
    active?: boolean;
}
declare class CampaignRoutesResource {
    private client;
    constructor(client: RymiClient);
    /** List a campaign's inbound routing rules. */
    list(campaignId: string, params?: ListCampaignRoutesParams): Promise<CampaignRouteListResponse>;
    /** Bind an owned phone number to this campaign for inbound routing. Only one active route per number is allowed. */
    create(campaignId: string, data: CreateCampaignRouteParams): Promise<{
        route: CampaignRoute;
    }>;
    /** Update an inbound route's schedule or active flag. */
    update(campaignId: string, routeId: string, data: UpdateCampaignRouteParams): Promise<{
        route: CampaignRoute;
    }>;
    /** Delete an inbound route. */
    delete(campaignId: string, routeId: string): Promise<{
        status: 'deleted';
        id: string;
    }>;
}
interface ListCampaignAttemptsParams {
    limit?: number;
    offset?: number;
    status?: string;
}
interface CampaignAttemptListResponse {
    attempts: CampaignAttempt[];
    total: number;
    offset: number;
    limit: number;
}
interface ListCampaignBatchesParams {
    limit?: number;
    offset?: number;
}
interface CampaignBatch {
    id: string;
    tenant_id: string;
    campaign_id: string;
    batch_key: string;
    status: string;
    selected_count: number;
    queued_count: number;
    completed_count: number;
    failed_count: number;
    started_at?: string | null;
    completed_at?: string | null;
    created_at: string;
}
interface CampaignBatchListResponse {
    batches: CampaignBatch[];
    total: number;
    offset: number;
    limit: number;
}
interface ListCampaignFollowupsParams {
    limit?: number;
    offset?: number;
    status?: string;
}
interface CampaignFollowupJob {
    id: string;
    tenant_id: string;
    campaign_id: string;
    campaign_attempt_id?: string | null;
    campaign_member_id?: string | null;
    kind: string;
    status: string;
    scheduled_at: string;
    consent_checked: boolean;
    capability_checked: boolean;
    idempotency_key: string;
    payload: Record<string, unknown>;
    result?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}
interface CampaignFollowupListResponse {
    followups: CampaignFollowupJob[];
    total: number;
    offset: number;
    limit: number;
}
interface CampaignSuggestion {
    id: string;
    tenant_id: string;
    campaign_id: string;
    category: string;
    evidence: Record<string, unknown>;
    proposal: Record<string, unknown>;
    status: 'proposed' | 'accepted' | 'dismissed';
    created_by_model?: string | null;
    created_at: string;
    updated_at: string;
}
interface ImproveCampaignResponse {
    suggestions: CampaignSuggestion[];
}
interface ListCampaignSuggestionsParams {
    limit?: number;
    offset?: number;
    status?: string;
}
interface CampaignSuggestionListResponse {
    suggestions: CampaignSuggestion[];
    total: number;
    offset: number;
    limit: number;
}
declare class CampaignsResource {
    private client;
    members: CampaignMembersResource;
    routes: CampaignRoutesResource;
    constructor(client: RymiClient);
    /** List campaigns for the authenticated tenant, paginated. */
    list(params?: ListCampaignsParams): Promise<CampaignListResponse>;
    /** Create a new campaign in draft status against a published agent. */
    create(data: CreateCampaignParams): Promise<{
        campaign: Campaign;
    }>;
    /** Retrieve a single campaign by id. */
    get(campaignId: string): Promise<{
        campaign: Campaign;
    }>;
    /** Update campaign policy/goal fields. Status and lifecycle fields are not writable here. */
    update(campaignId: string, data: UpdateCampaignParams): Promise<{
        campaign: Campaign;
    }>;
    /**
     * Launch a campaign: validates launch blockers, then stamps
     * `launched_at` + `agent_snapshot_id`, flips members to `ready`, and
     * transitions status to `running`.
     */
    launch(campaignId: string): Promise<LaunchCampaignResponse>;
    /** Evaluate launch blockers without launching (dry run). Safe from any status. */
    launchBlockers(campaignId: string): Promise<{
        blockers: LaunchBlocker[];
        launchable: boolean;
    }>;
    /** Pause a running campaign. In-flight calls finish naturally. */
    pause(campaignId: string): Promise<{
        campaign: Campaign;
    }>;
    /** Resume a paused campaign. */
    resume(campaignId: string): Promise<{
        campaign: Campaign;
    }>;
    /** Archive a campaign. Terminal — the scheduler never selects work for it again. */
    archive(campaignId: string): Promise<{
        campaign: Campaign;
    }>;
    /** Read the campaign report: `stat_*` summary counters + outcome/sentiment/hourly/snapshot distributions. */
    report(campaignId: string): Promise<CampaignReportResponse>;
    /** List a campaign's dial attempts, paginated. */
    attempts(campaignId: string, params?: ListCampaignAttemptsParams): Promise<CampaignAttemptListResponse>;
    /** List a campaign's sweep-claim batches, paginated. */
    batches(campaignId: string, params?: ListCampaignBatchesParams): Promise<CampaignBatchListResponse>;
    /** List a campaign's follow-up jobs, paginated. */
    followups(campaignId: string, params?: ListCampaignFollowupsParams): Promise<CampaignFollowupListResponse>;
    /** Run the improve engine: detectors gate an LLM proposal writer, persisting new `campaign_suggestions`. */
    improve(campaignId: string): Promise<ImproveCampaignResponse>;
    /** List a campaign's improvement suggestions, paginated. */
    suggestions(campaignId: string, params?: ListCampaignSuggestionsParams): Promise<CampaignSuggestionListResponse>;
    /** Accept a suggestion: agent-editing suggestions create an agent-changes draft; campaign-policy suggestions patch the campaign. */
    acceptSuggestion(campaignId: string, suggestionId: string): Promise<{
        suggestion: CampaignSuggestion;
    }>;
    /** Dismiss a suggestion without applying it. */
    dismissSuggestion(campaignId: string, suggestionId: string): Promise<{
        suggestion: CampaignSuggestion;
    }>;
}

interface ListContactsParams {
    limit?: number;
    offset?: number;
}
interface ContactListResponse {
    contacts: Contact[];
    total: number;
    offset: number;
    limit: number;
}
interface CreateContactParams {
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
interface CreateContactResponse {
    contact: Contact;
    deduped: boolean;
}
interface UpdateContactParams {
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
interface ImportContactsParams {
    contacts?: Array<Record<string, unknown>>;
    csv?: string;
}
interface ImportContactsResponse {
    created: number;
    merged: number;
    invalid: Array<{
        row: number;
        reason: string;
    }>;
}
interface SetConsentParams {
    channel: 'voice' | 'sms' | 'whatsapp' | 'telegram';
    granted: boolean;
    source?: string;
    method?: string;
}
interface SetConsentResponse {
    contact_id: string;
    channel: string;
    consent: {
        granted: boolean;
        at: string;
        source: string;
        method: string;
    };
}
declare class ContactsResource {
    private client;
    constructor(client: RymiClient);
    /** List tenant-level contacts, paginated. */
    list(params?: ListContactsParams): Promise<ContactListResponse>;
    /**
     * Create a tenant-level contact. If a contact with the same
     * (tenant, phone) already exists, the existing row is returned instead
     * of creating a duplicate — check `deduped` in the response.
     */
    create(data: CreateContactParams): Promise<CreateContactResponse>;
    /** Retrieve a single tenant-scoped contact by id. */
    get(contactId: string): Promise<{
        contact: Contact;
    }>;
    /** Update an existing tenant-scoped contact. Only provided fields change. */
    update(contactId: string, data: UpdateContactParams): Promise<{
        contact: Contact;
    }>;
    /** Delete a tenant-scoped contact. */
    delete(contactId: string): Promise<{
        status: 'deleted';
        id: string;
    }>;
    /**
     * Bulk import contacts from JSON rows or CSV text. Each row's phone is
     * normalized to E.164 and upserted on (tenant_id, phone); rows with
     * unparseable phones are skipped and reported in `invalid`.
     */
    import(data: ImportContactsParams): Promise<ImportContactsResponse>;
    /** Record a consent grant or revoke for one channel, with evidence. Also
     *  appends an immutable row to the consent_events proof log. */
    setConsent(contactId: string, data: SetConsentParams): Promise<SetConsentResponse>;
}

interface AttestParams {
    kind: 'dnc_external_scrub' | 'ai_disclosure';
    note?: string;
}
interface Attestation {
    id: string;
    tenant_id: string;
    kind: string;
    attested_by: string | null;
    note: string | null;
    created_at: string;
}
interface AttestResponse {
    attestation: Attestation;
}
interface ListAttestationsResponse {
    attestations: Attestation[];
}
declare class ComplianceResource {
    private client;
    constructor(client: RymiClient);
    /** Record a compliance attestation (append-only). Campaign launch blockers
     *  in `attested` mode read the most recent one of the matching `kind`. */
    attest(data: AttestParams): Promise<AttestResponse>;
    /** List the tenant's 50 most recent compliance attestations, newest first. */
    listAttestations(): Promise<ListAttestationsResponse>;
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
    campaigns: CampaignsResource;
    contacts: ContactsResource;
    compliance: ComplianceResource;
    constructor(options?: ClientOptions);
}

export { type AddCampaignMembersParams, type AddKnowledgeSourceParams, type AgentCallListResponse, type AgentChange, type AgentKnowledgeSource, type AgentListResponse, type AgentTemplateSummary, AgentsResource, type ApplyChangesParams, type ApplyChangesResponse, type AttestParams, type AttestResponse, type Attestation, type BatchCallParams, BillingResource, type CallListResponse, type CallRecord, CallsResource, type CampaignAttemptListResponse, type CampaignBatch, type CampaignBatchListResponse, type CampaignFollowupJob, type CampaignFollowupListResponse, type CampaignListResponse, type CampaignMemberListResponse, type CampaignReportResponse, type CampaignRoute, type CampaignRouteListResponse, type CampaignSuggestion, type CampaignSuggestionListResponse, CampaignsResource, type ChangeEntry, type ClientOptions, ComplianceResource, type ConnectTelephonyParams, type ContactListResponse, ContactsResource, type CreateAgentParams, type CreateCallParams, type CreateCallResponse, type CreateCampaignParams, type CreateCampaignRouteParams, type CreateContactParams, type CreateContactResponse, type CreatePublishableKeyParams, type DncCheckResult, type DncEntry, type DncListResponse, DncResource, type EnrichCompanyParams, type EnrichCompanyResponse, type FanoutCallParams, type ImportCampaignMembersParams, type ImportCampaignMembersResponse, type ImportContactsParams, type ImportContactsResponse, type ImproveCampaignResponse, KeysResource, type LaunchBlocker, type LaunchCampaignResponse, type ListAttestationsResponse, type ListCallsParams, type ListCampaignAttemptsParams, type ListCampaignBatchesParams, type ListCampaignFollowupsParams, type ListCampaignMembersParams, type ListCampaignRoutesParams, type ListCampaignSuggestionsParams, type ListCampaignsParams, type ListContactsParams, type NumberRecord, NumbersResource, type PreviewStackParams, type PublishAgentResponse, type PublishValidationIssue, type PublishableKeyRecord, Rymi, RymiClient, RymiError, type SetConsentParams, type SetConsentResponse, type TelephonyProvider, TelephonyResource, TemplatesResource, type UpdateAgentParams, type UpdateCampaignMemberParams, type UpdateCampaignParams, type UpdateCampaignRouteParams, type UpdateContactParams, type UsageSummary, type ValidatePublishParams, type WebhookProvisionResult, type WebhookRecord, WebhooksResource, Rymi as default };
