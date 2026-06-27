import { RymiClient } from '../client';
import { Agent } from '@rymi/sdk-types';

export interface CreateAgentParams {
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

export interface UpdateAgentParams {
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

export interface AgentListResponse {
    agents: Agent[];
    total: number;
    offset: number;
    limit: number;
}

export interface AgentCallListResponse {
    calls: any[];
    total: number;
    offset: number;
    limit: number;
    agent_id: string;
}

export interface ValidatePublishParams {
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

export interface PublishValidationIssue {
    severity?: string;
    section?: string;
    title?: string;
    detail?: string;
    [key: string]: any;
}

export interface PublishAgentResponse {
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

export interface ChangeEntry {
    key: string;
    value: any;
}

export interface ApplyChangesParams {
    currentConfig: Record<string, any>;
    changes: ChangeEntry[];
    mode: 'create' | 'edit';
    lenient?: boolean;
}

export interface ApplyChangesResponse {
    valid: true;
    config: Record<string, any>;
    applied: ChangeEntry[];
}

export interface EnrichCompanyParams {
    companyName: string;
    websiteUrl: string;
}

export interface EnrichCompanyResponse {
    enriched: boolean;
    companyDescription?: string;
    knowledgeBase?: any[];
    error?: string;
}

export interface PreviewStackParams {
    language?: string | null;
    /** Required, non-empty list of BCP-47 languages to resolve a stack for. */
    supported_languages: string[];
    current_provider_config?: Record<string, any> | null;
}

export interface AgentKnowledgeSource {
    id: string;
    kind?: 'text' | 'url';
    title?: string;
    source_uri?: string | null;
    bytes?: number;
    created_at?: string;
    [key: string]: any;
}

export type AddKnowledgeSourceParams =
    | { kind: 'text'; title: string; text: string }
    | { kind: 'url'; title: string; url: string };

export interface AgentChange {
    change_id: string;
    field_path?: string;
    before_jsonb?: any;
    after_jsonb?: any;
    changed_by?: string;
    created_at?: string;
    undone_at?: string | null;
    [key: string]: any;
}

function normalizeAgentPayload<T extends CreateAgentParams | UpdateAgentParams>(data: T): Omit<T, 'prompt'> & { system_prompt?: string } {
    const { prompt, ...rest } = data as any;
    return {
        ...rest,
        ...(!rest.system_prompt && prompt ? { system_prompt: prompt } : {})
    };
}

export class AgentsResource {
    constructor(private client: RymiClient) {}

    /**
     * Retrieve a list of all your AI Agents.
     */
    public async list(params: { limit?: number; offset?: number } = {}): Promise<AgentListResponse> {
        const searchParams = new URLSearchParams();
        if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
        if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
        const query = searchParams.toString();
        return this.client.get<AgentListResponse>(`/agents${query ? `?${query}` : ''}`);
    }

    /**
     * Retrieve a single AI Agent by its unique ID.
     */
    public async retrieve(agentId: string): Promise<Agent> {
        return this.client.get<Agent>(`/agents/${agentId}`);
    }

    /**
     * Create a new AI Agent with a complete system prompt and voice settings.
     */
    public async create(data: CreateAgentParams): Promise<{ status: 'created'; id: string }> {
        return this.client.post<{ status: 'created'; id: string }>('/agents', normalizeAgentPayload(data));
    }

    /**
     * Update an existing AI Agent's persona or configuration.
     */
    public async update(agentId: string, data: UpdateAgentParams): Promise<{ status: 'updated' }> {
        return this.client.put<{ status: 'updated' }>(`/agents/${agentId}`, normalizeAgentPayload(data));
    }

    /**
     * Delete an AI Agent permanently.
     */
    public async delete(agentId: string): Promise<{ status: 'deleted'; id: string }> {
        return this.client.delete<{ status: 'deleted'; id: string }>(`/agents/${agentId}`);
    }

    public async llmOptions(): Promise<{ models: any[]; voices: any[] }> {
        return this.client.get('/agents/llm-options');
    }

    public async generate(data: { prompt: string; options?: Record<string, any> }): Promise<Record<string, any>> {
        return this.client.post('/agents/generate', data);
    }

    /**
     * List calls made with a specific agent.
     */
    public async listCalls(agentId: string, params: { limit?: number; offset?: number; status?: string } = {}): Promise<AgentCallListResponse> {
        const searchParams = new URLSearchParams();
        if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
        if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
        if (params.status) searchParams.set('status', params.status);
        const query = searchParams.toString();
        return this.client.get<AgentCallListResponse>(`/agents/${agentId}/calls${query ? `?${query}` : ''}`);
    }

    /**
     * Duplicate an existing agent. The clone gets " (Copy)" appended to its name.
     */
    public async clone(agentId: string): Promise<{ status: 'created'; id: string }> {
        return this.client.post<{ status: 'created'; id: string }>(`/agents/${agentId}/clone`, {});
    }

    /**
     * Validate an agent's configuration before publishing.
     * Pass agent_id to merge with an existing persisted agent, or supply fields directly.
     */
    public async validatePublish(params: ValidatePublishParams): Promise<Record<string, any>> {
        return this.client.post('/agents/validate-publish', params);
    }

    /**
     * Publish an agent: validate its persisted config and freeze it into the
     * published snapshot the harness/review pipeline reads as the baseline.
     * Returns `{ published: false, blockers }` (HTTP 200) when blockers remain —
     * inspect `blockers` rather than relying on a thrown error.
     */
    public async publish(agentId: string): Promise<PublishAgentResponse> {
        return this.client.post<PublishAgentResponse>(`/agents/${agentId}/publish`, {});
    }

    /**
     * Validate and apply a flat-diff change-set against the AgentConfig field registry.
     * Does NOT persist — callers must follow up with update().
     */
    public async applyChanges(params: ApplyChangesParams): Promise<ApplyChangesResponse> {
        return this.client.post('/agents/apply-changes', params);
    }

    /**
     * Use AI with Google Search grounding to generate a company description from a website URL.
     */
    public async enrichCompany(params: EnrichCompanyParams): Promise<EnrichCompanyResponse> {
        return this.client.post('/agents/enrich-company', params);
    }

    /**
     * Preview the resolved per-language model stack (STT/LLM/TTS), blockers,
     * warnings, and model diffs for a set of supported languages — without
     * persisting anything.
     */
    public async previewStack(params: PreviewStackParams): Promise<Record<string, any>> {
        return this.client.post('/agents/stack-preview', params);
    }

    /**
     * List the knowledge sources (RAG context) attached to an agent.
     */
    public async listKnowledgeSources(agentId: string): Promise<{ sources: AgentKnowledgeSource[] }> {
        return this.client.get(`/agents/${agentId}/knowledge-sources`);
    }

    /**
     * Add a knowledge source to an agent from raw text or a URL.
     */
    public async addKnowledgeSource(agentId: string, data: AddKnowledgeSourceParams): Promise<Record<string, any>> {
        return this.client.post(`/agents/${agentId}/knowledge-sources`, data);
    }

    /**
     * Delete a knowledge source from an agent.
     */
    public async deleteKnowledgeSource(agentId: string, sourceId: string): Promise<Record<string, any>> {
        return this.client.delete(`/agents/${agentId}/knowledge-sources/${sourceId}`);
    }

    /**
     * List the recorded configuration changes for an agent (most recent first).
     * Optionally pass an ISO timestamp to only return changes since then.
     */
    public async listChanges(agentId: string, params: { since?: string } = {}): Promise<{ changes: AgentChange[] }> {
        const query = params.since ? `?since=${encodeURIComponent(params.since)}` : '';
        return this.client.get(`/agents/${agentId}/changes${query}`);
    }

    /**
     * Undo a single recorded configuration change, reverting that field to its
     * previous value. Returns the resulting agent snapshot.
     */
    public async undoChange(agentId: string, changeId: string): Promise<{ ok: boolean; changeId: string; agentSnapshot: Agent }> {
        return this.client.post(`/agents/${agentId}/changes/${changeId}/undo`, {});
    }

    /**
     * Run the evaluation suite for an agent. mode="synthetic" (default) uses
     * the offline scorer; mode="live" runs the model-driven runner.
     */
    public async runEvals(
        agentId: string,
        params: { mode?: 'synthetic' | 'live'; judge?: boolean } = {},
    ): Promise<Record<string, any>> {
        const query = new URLSearchParams();
        if (params.mode) query.set('mode', params.mode);
        if (params.judge) query.set('judge', '1');
        const qs = query.toString();
        return this.client.post(`/agents/${agentId}/evals/run${qs ? `?${qs}` : ''}`, {});
    }

    /**
     * Run the eval SUITE across many agents at once (agents × seeded scenarios),
     * bounded by the optional concurrency cap. One eval run is persisted per
     * agent; the aggregate EvalSuiteReport is returned. Pass `judge: true` to
     * supplement the heuristics with the opt-in LLM judge (needs a Gemini key).
     */
    public async runEvalSuite(params: {
        agentIds: string[];
        scenarioIds?: string[];
        concurrency?: number;
        judge?: boolean;
    }): Promise<Record<string, any>> {
        return this.client.post('/agents/evals/suite', params);
    }

    /**
     * List previous evaluation runs for an agent.
     */
    public async listEvalRuns(agentId: string): Promise<Record<string, any>> {
        return this.client.get(`/agents/${agentId}/evals/runs`);
    }

    /**
     * Retrieve a single evaluation run, including per-scenario scores.
     */
    public async getEvalRun(agentId: string, runId: string): Promise<Record<string, any>> {
        return this.client.get(`/agents/${agentId}/evals/runs/${runId}`);
    }
}
