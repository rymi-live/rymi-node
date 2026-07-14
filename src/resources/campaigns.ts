import { RymiClient } from '../client';
import type {
    Campaign,
    CampaignStatus,
    CampaignType,
    CampaignMember,
    CampaignAttempt,
    CampaignReport,
    CampaignGoal,
    CampaignCompliancePolicy
} from '@rymi/sdk-types';

function buildQuery(params: Record<string, any>) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) sp.set(k, String(v));
    }
    const q = sp.toString();
    return q ? `?${q}` : '';
}

// ─── list/create/update params + responses ─────────────────────────────────

export interface ListCampaignsParams {
    limit?: number;
    offset?: number;
    status?: CampaignStatus;
    type?: CampaignType;
    agent_id?: string;
}

export interface CampaignListResponse {
    campaigns: Campaign[];
    total: number;
    offset: number;
    limit: number;
}

export interface CreateCampaignParams {
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

export interface UpdateCampaignParams {
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

export interface LaunchBlocker {
    code: string;
    ok: boolean;
    detail?: string;
}

export interface LaunchCampaignResponse {
    campaign: Campaign;
    blockers: LaunchBlocker[];
}

/**
 * GET /campaigns/:id/report response. Extends the shared CampaignReport with
 * the report-endpoint-only derived fields (top failure reasons + cost per
 * success) that the API adds on top of the persisted shape.
 */
export interface CampaignReportResponse extends CampaignReport {
    distributions: CampaignReport['distributions'] & {
        top_failure_reasons: Array<{ reason: string; count: number }>;
        cost_per_success_credits: number;
    };
}

// ─── members ────────────────────────────────────────────────────────────────

export interface ListCampaignMembersParams {
    limit?: number;
    offset?: number;
    status?: string;
}

export interface CampaignMemberListResponse {
    members: CampaignMember[];
    total: number;
    offset: number;
    limit: number;
}

export interface AddCampaignMembersParams {
    contact_ids: string[];
    variables_override?: Record<string, string>;
}

export interface ImportCampaignMembersParams {
    contacts?: Array<Record<string, unknown>>;
    csv?: string;
}

export interface ImportCampaignMembersResponse {
    created: number;
    merged: number;
    /** Members attached to the campaign in this import. */
    attached: number;
    invalid: Array<{ row: number; reason: string }>;
}

export interface UpdateCampaignMemberParams {
    status?: string;
    variables_override?: Record<string, string>;
    next_attempt_at?: string;
}

class CampaignMembersResource {
    constructor(private client: RymiClient) {}

    /** List a campaign's members, paginated. */
    public async list(campaignId: string, params: ListCampaignMembersParams = {}): Promise<CampaignMemberListResponse> {
        return this.client.get(`/campaigns/${campaignId}/members${buildQuery(params)}`);
    }

    /** Attach existing contacts to a campaign as members. */
    public async add(campaignId: string, data: AddCampaignMembersParams): Promise<{ members: CampaignMember[] }> {
        return this.client.post(`/campaigns/${campaignId}/members`, data);
    }

    /** Import inline contact rows (JSON or CSV): creates/merges contacts and attaches members in one call. */
    public async import(campaignId: string, data: ImportCampaignMembersParams): Promise<ImportCampaignMembersResponse> {
        return this.client.post(`/campaigns/${campaignId}/members/import`, data);
    }

    /** Update a campaign member (status, variables, next attempt time). */
    public async update(campaignId: string, memberId: string, data: UpdateCampaignMemberParams): Promise<{ member: CampaignMember }> {
        return this.client.patch(`/campaigns/${campaignId}/members/${memberId}`, data);
    }

    /** Remove a member from a campaign. */
    public async remove(campaignId: string, memberId: string): Promise<{ status: 'deleted'; id: string }> {
        return this.client.delete(`/campaigns/${campaignId}/members/${memberId}`);
    }
}

// ─── inbound routes ─────────────────────────────────────────────────────────

export interface CampaignRoute {
    id: string;
    tenant_id: string;
    campaign_id: string;
    phone_number: string;
    schedule: Record<string, unknown>;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ListCampaignRoutesParams {
    limit?: number;
    offset?: number;
}

export interface CampaignRouteListResponse {
    routes: CampaignRoute[];
    total: number;
    offset: number;
    limit: number;
}

export interface CreateCampaignRouteParams {
    phone_number: string;
    schedule?: Record<string, unknown>;
    active?: boolean;
}

export interface UpdateCampaignRouteParams {
    schedule?: Record<string, unknown>;
    active?: boolean;
}

class CampaignRoutesResource {
    constructor(private client: RymiClient) {}

    /** List a campaign's inbound routing rules. */
    public async list(campaignId: string, params: ListCampaignRoutesParams = {}): Promise<CampaignRouteListResponse> {
        return this.client.get(`/campaigns/${campaignId}/routes${buildQuery(params)}`);
    }

    /** Bind an owned phone number to this campaign for inbound routing. Only one active route per number is allowed. */
    public async create(campaignId: string, data: CreateCampaignRouteParams): Promise<{ route: CampaignRoute }> {
        return this.client.post(`/campaigns/${campaignId}/routes`, data);
    }

    /** Update an inbound route's schedule or active flag. */
    public async update(campaignId: string, routeId: string, data: UpdateCampaignRouteParams): Promise<{ route: CampaignRoute }> {
        return this.client.patch(`/campaigns/${campaignId}/routes/${routeId}`, data);
    }

    /** Delete an inbound route. */
    public async delete(campaignId: string, routeId: string): Promise<{ status: 'deleted'; id: string }> {
        return this.client.delete(`/campaigns/${campaignId}/routes/${routeId}`);
    }
}

// ─── attempts / batches / followups (read-only) ────────────────────────────

export interface ListCampaignAttemptsParams {
    limit?: number;
    offset?: number;
    status?: string;
}

export interface CampaignAttemptListResponse {
    attempts: CampaignAttempt[];
    total: number;
    offset: number;
    limit: number;
}

export interface ListCampaignBatchesParams {
    limit?: number;
    offset?: number;
}

export interface CampaignBatch {
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

export interface CampaignBatchListResponse {
    batches: CampaignBatch[];
    total: number;
    offset: number;
    limit: number;
}

export interface ListCampaignFollowupsParams {
    limit?: number;
    offset?: number;
    status?: string;
}

export interface CampaignFollowupJob {
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

export interface CampaignFollowupListResponse {
    followups: CampaignFollowupJob[];
    total: number;
    offset: number;
    limit: number;
}

// ─── improve / suggestions ──────────────────────────────────────────────────

export interface CampaignSuggestion {
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

export interface ImproveCampaignResponse {
    suggestions: CampaignSuggestion[];
}

export interface ListCampaignSuggestionsParams {
    limit?: number;
    offset?: number;
    status?: string;
}

export interface CampaignSuggestionListResponse {
    suggestions: CampaignSuggestion[];
    total: number;
    offset: number;
    limit: number;
}

// ─── CampaignsResource ───────────────────────────────────────────────────────

export class CampaignsResource {
    public members: CampaignMembersResource;
    public routes: CampaignRoutesResource;

    constructor(private client: RymiClient) {
        this.members = new CampaignMembersResource(client);
        this.routes = new CampaignRoutesResource(client);
    }

    /** List campaigns for the authenticated tenant, paginated. */
    public async list(params: ListCampaignsParams = {}): Promise<CampaignListResponse> {
        return this.client.get(`/campaigns${buildQuery(params)}`);
    }

    /** Create a new campaign in draft status against a published agent. */
    public async create(data: CreateCampaignParams): Promise<{ campaign: Campaign }> {
        return this.client.post('/campaigns', data);
    }

    /** Retrieve a single campaign by id. */
    public async get(campaignId: string): Promise<{ campaign: Campaign }> {
        return this.client.get(`/campaigns/${campaignId}`);
    }

    /** Update campaign policy/goal fields. Status and lifecycle fields are not writable here. */
    public async update(campaignId: string, data: UpdateCampaignParams): Promise<{ campaign: Campaign }> {
        return this.client.patch(`/campaigns/${campaignId}`, data);
    }

    /**
     * Launch a campaign: validates launch blockers, then stamps
     * `launched_at` + `agent_snapshot_id`, flips members to `ready`, and
     * transitions status to `running`.
     */
    public async launch(campaignId: string): Promise<LaunchCampaignResponse> {
        return this.client.post(`/campaigns/${campaignId}/launch`);
    }

    /** Evaluate launch blockers without launching (dry run). Safe from any status. */
    public async launchBlockers(campaignId: string): Promise<{ blockers: LaunchBlocker[]; launchable: boolean }> {
        return this.client.get(`/campaigns/${campaignId}/launch-blockers`);
    }

    /** Pause a running campaign. In-flight calls finish naturally. */
    public async pause(campaignId: string): Promise<{ campaign: Campaign }> {
        return this.client.post(`/campaigns/${campaignId}/pause`);
    }

    /** Resume a paused campaign. */
    public async resume(campaignId: string): Promise<{ campaign: Campaign }> {
        return this.client.post(`/campaigns/${campaignId}/resume`);
    }

    /** Archive a campaign. Terminal — the scheduler never selects work for it again. */
    public async archive(campaignId: string): Promise<{ campaign: Campaign }> {
        return this.client.post(`/campaigns/${campaignId}/archive`);
    }

    /** Read the campaign report: `stat_*` summary counters + outcome/sentiment/hourly/snapshot distributions. */
    public async report(campaignId: string): Promise<CampaignReportResponse> {
        return this.client.get(`/campaigns/${campaignId}/report`);
    }

    /** List a campaign's dial attempts, paginated. */
    public async attempts(campaignId: string, params: ListCampaignAttemptsParams = {}): Promise<CampaignAttemptListResponse> {
        return this.client.get(`/campaigns/${campaignId}/attempts${buildQuery(params)}`);
    }

    /** List a campaign's sweep-claim batches, paginated. */
    public async batches(campaignId: string, params: ListCampaignBatchesParams = {}): Promise<CampaignBatchListResponse> {
        return this.client.get(`/campaigns/${campaignId}/batches${buildQuery(params)}`);
    }

    /** List a campaign's follow-up jobs, paginated. */
    public async followups(campaignId: string, params: ListCampaignFollowupsParams = {}): Promise<CampaignFollowupListResponse> {
        return this.client.get(`/campaigns/${campaignId}/followups${buildQuery(params)}`);
    }

    /** Run the improve engine: detectors gate an LLM proposal writer, persisting new `campaign_suggestions`. */
    public async improve(campaignId: string): Promise<ImproveCampaignResponse> {
        return this.client.post(`/campaigns/${campaignId}/improve`);
    }

    /** List a campaign's improvement suggestions, paginated. */
    public async suggestions(campaignId: string, params: ListCampaignSuggestionsParams = {}): Promise<CampaignSuggestionListResponse> {
        return this.client.get(`/campaigns/${campaignId}/suggestions${buildQuery(params)}`);
    }

    /** Accept a suggestion: agent-editing suggestions create an agent-changes draft; campaign-policy suggestions patch the campaign. */
    public async acceptSuggestion(campaignId: string, suggestionId: string): Promise<{ suggestion: CampaignSuggestion }> {
        return this.client.post(`/campaigns/${campaignId}/suggestions/${suggestionId}/accept`);
    }

    /** Dismiss a suggestion without applying it. */
    public async dismissSuggestion(campaignId: string, suggestionId: string): Promise<{ suggestion: CampaignSuggestion }> {
        return this.client.post(`/campaigns/${campaignId}/suggestions/${suggestionId}/dismiss`);
    }
}
