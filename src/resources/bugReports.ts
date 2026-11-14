import { RymiClient } from '../client';

export type BugSeverity = 'low' | 'medium' | 'high' | 'critical';
export type BugArea = 'agents' | 'calls' | 'voice_quality' | 'campaigns' | 'telephony' | 'billing' | 'mcp' | 'api_sdk' | 'studio' | 'other';
export type BugStatus = 'pending_review' | 'approved' | 'rejected' | 'in_progress' | 'fixed' | 'duplicate';

export interface CreateBugReportParams {
    /** 3 to 200 characters. */
    title: string;
    /** What went wrong, 10 to 5000 characters. */
    description: string;
    /** How to make it happen again. */
    steps?: string;
    expected?: string;
    actual?: string;
    /** Default `medium`. */
    severity?: BugSeverity;
    /** Default `other`. */
    area?: BugArea;
    /** A call in this workspace that shows the bug. */
    call_id?: string;
    /** An agent in this workspace the bug is about. */
    agent_id?: string;
    /** Where the report came from. Default `api`. */
    source?: 'mcp' | 'api' | 'studio';
}

export interface BugReport {
    id: string;
    title: string;
    description: string;
    steps: string | null;
    expected: string | null;
    actual: string | null;
    severity: BugSeverity;
    area: BugArea;
    call_id: string | null;
    agent_id: string | null;
    source: 'mcp' | 'api' | 'studio';
    /** Starts at `pending_review`; Rymi reviews every report before work starts. */
    status: BugStatus;
    /** Set when `status` is `duplicate`. */
    duplicate_of: string | null;
    /** A link to the fix once one exists. */
    fix_ref: string | null;
    created_at: string;
    updated_at: string;
}

export interface ListBugReportsParams {
    limit?: number;
    offset?: number;
    status?: BugStatus;
}

export interface BugReportListResponse {
    bug_reports: BugReport[];
    total: number;
    limit: number;
    offset: number;
}

function buildQuery(params: Record<string, any>) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) searchParams.set(key, String(value));
    }
    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

export class BugReportsResource {
    constructor(private client: RymiClient) {}

    /** Report a bug. It is queued as `pending_review` for Rymi to look at. */
    public async create(params: CreateBugReportParams): Promise<{ bug_report: BugReport }> {
        return this.client.post<{ bug_report: BugReport }>('/bug-reports', params);
    }

    /** List this workspace's bug reports, newest first. */
    public async list(params: ListBugReportsParams = {}): Promise<BugReportListResponse> {
        return this.client.get<BugReportListResponse>(`/bug-reports${buildQuery(params)}`);
    }

    /** One bug report, with its review status. */
    public async retrieve(bugReportId: string): Promise<{ bug_report: BugReport }> {
        return this.client.get<{ bug_report: BugReport }>(`/bug-reports/${encodeURIComponent(bugReportId)}`);
    }
}
