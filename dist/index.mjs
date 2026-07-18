// src/client.ts
var RymiError = class extends Error {
  status;
  code;
  constructor(message, status, code) {
    super(message);
    this.name = "RymiError";
    this.status = status;
    this.code = code;
  }
};
var RymiClient = class {
  apiKey;
  baseURL;
  fetchImpl;
  constructor(options) {
    const key = options?.apiKey || (typeof process !== "undefined" ? process.env.RYMI_API_KEY : void 0);
    if (!key) {
      throw new Error("The Rymi API Key must be set either by passing `apiKey` to the client or setting the `RYMI_API_KEY` environment variable.");
    }
    this.apiKey = key;
    this.baseURL = options?.baseURL || "https://api.rymi.live/v1";
    this.fetchImpl = options?.fetch ?? globalThis.fetch;
    if (this.baseURL.endsWith("/")) {
      this.baseURL = this.baseURL.slice(0, -1);
    }
  }
  async request(method, path, body) {
    const url = `${this.baseURL}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Accept": "application/json",
      "User-Agent": "rymi-node/1.0.0"
    };
    const init = {
      method,
      headers
    };
    if (body) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
    try {
      const response = await this.fetchImpl(url, init);
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();
      if (!response.ok) {
        const message = data && typeof data === "object" && "error" in data ? data.error : typeof data === "string" ? data : response.statusText;
        throw new RymiError(message, response.status, data && typeof data === "object" && "code" in data ? data.code : void 0);
      }
      return data;
    } catch (error) {
      if (error instanceof RymiError) {
        throw error;
      }
      throw new RymiError(`Network Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  get(path) {
    return this.request("GET", path);
  }
  post(path, body) {
    return this.request("POST", path, body);
  }
  put(path, body) {
    return this.request("PUT", path, body);
  }
  patch(path, body) {
    return this.request("PATCH", path, body);
  }
  delete(path) {
    return this.request("DELETE", path);
  }
};

// src/resources/agents.ts
function normalizeAgentPayload(data) {
  const { prompt, ...rest } = data;
  return {
    ...rest,
    ...!rest.system_prompt && prompt ? { system_prompt: prompt } : {}
  };
}
var AgentsResource = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Retrieve a list of all your AI Agents.
   */
  async list(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit !== void 0) searchParams.set("limit", String(params.limit));
    if (params.offset !== void 0) searchParams.set("offset", String(params.offset));
    const query = searchParams.toString();
    return this.client.get(`/agents${query ? `?${query}` : ""}`);
  }
  /**
   * Retrieve a single AI Agent by its unique ID.
   */
  async retrieve(agentId) {
    return this.client.get(`/agents/${agentId}`);
  }
  /**
   * Create a new AI Agent with a complete system prompt and voice settings.
   */
  async create(data) {
    return this.client.post("/agents", normalizeAgentPayload(data));
  }
  /**
   * Update an existing AI Agent's persona or configuration.
   */
  async update(agentId, data) {
    return this.client.put(`/agents/${agentId}`, normalizeAgentPayload(data));
  }
  /**
   * Delete an AI Agent permanently.
   */
  async delete(agentId) {
    return this.client.delete(`/agents/${agentId}`);
  }
  async llmOptions() {
    return this.client.get("/agents/llm-options");
  }
  async generate(data) {
    return this.client.post("/agents/generate", data);
  }
  /**
   * List calls made with a specific agent.
   */
  async listCalls(agentId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit !== void 0) searchParams.set("limit", String(params.limit));
    if (params.offset !== void 0) searchParams.set("offset", String(params.offset));
    if (params.status) searchParams.set("status", params.status);
    const query = searchParams.toString();
    return this.client.get(`/agents/${agentId}/calls${query ? `?${query}` : ""}`);
  }
  /**
   * Duplicate an existing agent. The clone gets " (Copy)" appended to its name.
   */
  async clone(agentId) {
    return this.client.post(`/agents/${agentId}/clone`, {});
  }
  /**
   * Validate an agent's configuration before publishing.
   * Pass agent_id to merge with an existing persisted agent, or supply fields directly.
   */
  async validatePublish(params) {
    return this.client.post("/agents/validate-publish", params);
  }
  /**
   * Publish an agent: validate its persisted config and freeze it into the
   * published snapshot the harness/review pipeline reads as the baseline.
   * Returns `{ published: false, blockers }` (HTTP 200) when blockers remain —
   * inspect `blockers` rather than relying on a thrown error.
   */
  async publish(agentId) {
    return this.client.post(`/agents/${agentId}/publish`, {});
  }
  /**
   * Validate and apply a flat-diff change-set against the AgentConfig field registry.
   * Does NOT persist — callers must follow up with update().
   */
  async applyChanges(params) {
    return this.client.post("/agents/apply-changes", params);
  }
  /**
   * Use AI with Google Search grounding to generate a company description from a website URL.
   */
  async enrichCompany(params) {
    return this.client.post("/agents/enrich-company", params);
  }
  /**
   * Preview the resolved per-language model stack (STT/LLM/TTS), blockers,
   * warnings, and model diffs for a set of supported languages — without
   * persisting anything.
   */
  async previewStack(params) {
    return this.client.post("/agents/stack-preview", params);
  }
  /**
   * List the knowledge sources (RAG context) attached to an agent.
   */
  async listKnowledgeSources(agentId) {
    return this.client.get(`/agents/${agentId}/knowledge-sources`);
  }
  /**
   * Add a knowledge source to an agent from raw text or a URL.
   */
  async addKnowledgeSource(agentId, data) {
    return this.client.post(`/agents/${agentId}/knowledge-sources`, data);
  }
  /**
   * Delete a knowledge source from an agent.
   */
  async deleteKnowledgeSource(agentId, sourceId) {
    return this.client.delete(`/agents/${agentId}/knowledge-sources/${sourceId}`);
  }
  /**
   * List the recorded configuration changes for an agent (most recent first).
   * Optionally pass an ISO timestamp to only return changes since then.
   */
  async listChanges(agentId, params = {}) {
    const query = params.since ? `?since=${encodeURIComponent(params.since)}` : "";
    return this.client.get(`/agents/${agentId}/changes${query}`);
  }
  /**
   * Undo a single recorded configuration change, reverting that field to its
   * previous value. Returns the resulting agent snapshot.
   */
  async undoChange(agentId, changeId) {
    return this.client.post(`/agents/${agentId}/changes/${changeId}/undo`, {});
  }
  /**
   * Run the evaluation suite for an agent. mode="synthetic" (default) uses
   * the offline scorer; mode="live" runs the model-driven runner.
   */
  async runEvals(agentId, params = {}) {
    const query = new URLSearchParams();
    if (params.mode) query.set("mode", params.mode);
    if (params.judge) query.set("judge", "1");
    const qs = query.toString();
    return this.client.post(`/agents/${agentId}/evals/run${qs ? `?${qs}` : ""}`, {});
  }
  /**
   * Run the eval SUITE across many agents at once (agents × seeded scenarios),
   * bounded by the optional concurrency cap. One eval run is persisted per
   * agent; the aggregate EvalSuiteReport is returned. Pass `judge: true` to
   * supplement the heuristics with the opt-in LLM judge (needs a Gemini key).
   */
  async runEvalSuite(params) {
    return this.client.post("/agents/evals/suite", params);
  }
  /**
   * List previous evaluation runs for an agent.
   */
  async listEvalRuns(agentId) {
    return this.client.get(`/agents/${agentId}/evals/runs`);
  }
  /**
   * Retrieve a single evaluation run, including per-scenario scores.
   */
  async getEvalRun(agentId, runId) {
    return this.client.get(`/agents/${agentId}/evals/runs/${runId}`);
  }
};

// src/resources/calls.ts
function buildQuery(params) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== void 0 && value !== null) {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
var CallsResource = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Retrieve a list of all previous and active calls.
   */
  async list(params = {}) {
    return this.client.get(`/calls${buildQuery(params)}`);
  }
  /**
   * Retrieve calls currently in progress.
   */
  async active(params = {}) {
    return this.client.get(`/calls/active${buildQuery(params)}`);
  }
  /**
   * Retrieve details, transcripts, and analysis of a single call by its unique ID.
   */
  async retrieve(callId) {
    return this.client.get(`/calls/${callId}`);
  }
  /**
   * Dispatch an outbound phone call securely using your configured carrier.
   */
  async create(data) {
    return this.client.post("/calls", data);
  }
  /**
   * Group call fanout: dial up to 500 PSTN participants into a single call room.
   * Every recipient joins the same call. For independent per-recipient attempts,
   * retries, and reports, use `campaigns` instead.
   */
  async fanout(data) {
    return this.client.post("/calls/fanout", data);
  }
  /**
   * Compatibility alias for {@link fanout}. Creates one call room with multiple
   * PSTN participants. Queue up to 500 outbound PSTN recipients in one request.
   */
  async batch(data) {
    return this.client.post("/calls/batch", data);
  }
  async summary(callId) {
    return this.client.get(`/calls/${callId}/summary`);
  }
  async transcript(callId) {
    return this.client.get(`/calls/${callId}/transcript`);
  }
  async recording(callId) {
    return this.client.get(`/calls/${callId}/recording`);
  }
  async reprocess(callId) {
    return this.client.post(`/calls/${callId}/reprocess`);
  }
  /** Force-end an active call. Irreversible — closes the LiveKit room and triggers post-call processing. */
  async end(callId) {
    return this.client.post(`/calls/${callId}/end`);
  }
  /** Add one or more participants to an in-progress call (warm transfer / conference). */
  async addParticipants(callId, data) {
    return this.client.post(`/calls/${callId}/participants`, data);
  }
  async queueStats() {
    return this.client.get("/calls/queue/stats");
  }
};

// src/resources/dnc.ts
function buildQuery2(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== void 0 && v !== null) sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}
var DncResource = class {
  constructor(client) {
    this.client = client;
  }
  /** List all DNC entries for the tenant. */
  async list(params = {}) {
    return this.client.get(`/dnc${buildQuery2(params)}`);
  }
  /** Add a single number to the Do-Not-Call registry. */
  async add(data) {
    return this.client.post("/dnc", data);
  }
  /** Add up to 1000 numbers in one request. Invalid numbers are skipped and returned in `invalid`. */
  async addBatch(data) {
    return this.client.post("/dnc/batch", data);
  }
  /** Check up to 500 numbers without adding them. Read-only. */
  async check(data) {
    return this.client.post("/dnc/check", data);
  }
  /** Remove a number from the registry (re-enables outbound to it). */
  async remove(phone) {
    return this.client.delete(`/dnc/${encodeURIComponent(phone)}`);
  }
};

// src/resources/numbers.ts
var NumbersResource = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Retrieve a list of all phone numbers assigned to your Rymi account.
   */
  async list(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit !== void 0) searchParams.set("limit", String(params.limit));
    if (params.offset !== void 0) searchParams.set("offset", String(params.offset));
    const query = searchParams.toString();
    return this.client.get(`/numbers${query ? `?${query}` : ""}`);
  }
  async register(number, params = {}) {
    return this.client.post("/numbers", { number, ...params });
  }
  async attach(number, agentId) {
    return this.client.post(`/numbers/${encodeURIComponent(number)}/attach`, { agent_id: agentId });
  }
  /** Clear the agent association without deregistering the number. */
  async detach(number) {
    return this.client.post(`/numbers/${encodeURIComponent(number)}/detach`);
  }
  /** Re-run carrier inbound-webhook auto-provisioning for a number. */
  async provisionWebhook(number) {
    return this.client.post(`/numbers/${encodeURIComponent(number)}/webhook`);
  }
  async remove(number) {
    return this.client.delete(`/numbers/${encodeURIComponent(number)}`);
  }
};

// src/resources/webhooks.ts
import * as crypto from "crypto";
function buildQuery3(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== void 0 && v !== null) sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}
var WebhooksResource = class {
  constructor(client) {
    this.client = client;
  }
  /** List registered webhook endpoints. The signing secret is never returned. */
  async list(params = {}) {
    return this.client.get(`/webhooks${buildQuery3(params)}`);
  }
  /** Register a webhook. `url` must be public https. `secret` must be 16–256 chars. */
  async create(data) {
    return this.client.post("/webhooks", data);
  }
  /** Update a webhook. Only provided fields change. Pass `secret` to rotate it. */
  async update(id, data) {
    return this.client.patch(`/webhooks/${id}`, data);
  }
  /** Delete a webhook endpoint. */
  async delete(id) {
    return this.client.delete(`/webhooks/${id}`);
  }
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
  verifySignature(payload, signatureHeader, timestampHeader, webhookSecret, toleranceMillis = 3e5) {
    const timestamp = parseInt(timestampHeader, 10);
    if (isNaN(timestamp)) {
      throw new Error("Invalid Rymi-Timestamp header");
    }
    const now = Date.now();
    if (now - timestamp > toleranceMillis) {
      throw new Error("Webhook timestamp is too old. Possible replay attack.");
    }
    const signaturePayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(signaturePayload, "utf8").digest("hex");
    try {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(signatureHeader),
        Buffer.from(expectedSignature)
      );
      if (!isValid) {
        throw new Error("Invalid Webhook Signature. The secret might be incorrect.");
      }
      return true;
    } catch (err) {
      throw new Error("Invalid Webhook Signature. The secret might be incorrect.");
    }
  }
};

// src/resources/keys.ts
var KeysResource = class {
  constructor(client) {
    this.client = client;
  }
  async listPublishable() {
    return this.client.get("/keys/publishable");
  }
  async createPublishable(data) {
    return this.client.post("/keys/publishable", data);
  }
  async revokePublishable(id) {
    return this.client.delete(`/keys/publishable/${id}`);
  }
};

// src/resources/telephony.ts
var TelephonyResource = class {
  constructor(client) {
    this.client = client;
  }
  async connect(data) {
    return this.client.post("/telephony/connect", data);
  }
  async disconnect() {
    return this.client.post("/telephony/disconnect");
  }
  async status() {
    return this.client.get("/telephony/status");
  }
  async numbers() {
    return this.client.get("/telephony/numbers");
  }
};

// src/resources/billing.ts
var BillingResource = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Lane-aware usage summary: remaining voice-runtime minutes, Studio AI unit
   * usage, and post-call intelligence usage. Voice balance is reported in
   * MINUTES (the customer-facing unit), not dollars.
   */
  async usageSummary() {
    return this.client.get("/billing/usage-summary");
  }
  /** Estimate the cost of a call for a custom model stack and duration. */
  async estimate(data = {}) {
    return this.client.post("/billing/estimate", data);
  }
  /** Configure auto-recharge. Server rejects (400) if enabled && pack_usd <= threshold_usd. */
  async setAutoRecharge(data) {
    return this.client.put("/billing/auto-recharge", data);
  }
  /** Configure spend-alert preferences. */
  async setAlerts(data) {
    return this.client.put("/billing/alerts", data);
  }
};

// src/resources/templates.ts
var TemplatesResource = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * List published agent templates available to the current tenant. Use a
   * template's `defaults` as the starting config for create_agent.
   */
  async list() {
    return this.client.get("/agent-templates");
  }
};

// src/resources/campaigns.ts
function buildQuery4(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== void 0 && v !== null) sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}
var CampaignMembersResource = class {
  constructor(client) {
    this.client = client;
  }
  /** List a campaign's members, paginated. */
  async list(campaignId, params = {}) {
    return this.client.get(`/campaigns/${campaignId}/members${buildQuery4(params)}`);
  }
  /** Attach existing contacts to a campaign as members. */
  async add(campaignId, data) {
    return this.client.post(`/campaigns/${campaignId}/members`, data);
  }
  /** Import inline contact rows (JSON or CSV): creates/merges contacts and attaches members in one call. */
  async import(campaignId, data) {
    return this.client.post(`/campaigns/${campaignId}/members/import`, data);
  }
  /** Update a campaign member (status, variables, next attempt time). */
  async update(campaignId, memberId, data) {
    return this.client.patch(`/campaigns/${campaignId}/members/${memberId}`, data);
  }
  /** Remove a member from a campaign. */
  async remove(campaignId, memberId) {
    return this.client.delete(`/campaigns/${campaignId}/members/${memberId}`);
  }
};
var CampaignRoutesResource = class {
  constructor(client) {
    this.client = client;
  }
  /** List a campaign's inbound routing rules. */
  async list(campaignId, params = {}) {
    return this.client.get(`/campaigns/${campaignId}/routes${buildQuery4(params)}`);
  }
  /** Bind an owned phone number to this campaign for inbound routing. Only one active route per number is allowed. */
  async create(campaignId, data) {
    return this.client.post(`/campaigns/${campaignId}/routes`, data);
  }
  /** Update an inbound route's schedule or active flag. */
  async update(campaignId, routeId, data) {
    return this.client.patch(`/campaigns/${campaignId}/routes/${routeId}`, data);
  }
  /** Delete an inbound route. */
  async delete(campaignId, routeId) {
    return this.client.delete(`/campaigns/${campaignId}/routes/${routeId}`);
  }
};
var CampaignsResource = class {
  constructor(client) {
    this.client = client;
    this.members = new CampaignMembersResource(client);
    this.routes = new CampaignRoutesResource(client);
  }
  members;
  routes;
  /** List campaigns for the authenticated tenant, paginated. */
  async list(params = {}) {
    return this.client.get(`/campaigns${buildQuery4(params)}`);
  }
  /** Create a new campaign in draft status against a published agent. */
  async create(data) {
    return this.client.post("/campaigns", data);
  }
  /** Retrieve a single campaign by id. */
  async get(campaignId) {
    return this.client.get(`/campaigns/${campaignId}`);
  }
  /** Update campaign policy/goal fields. Status and lifecycle fields are not writable here. */
  async update(campaignId, data) {
    return this.client.patch(`/campaigns/${campaignId}`, data);
  }
  /**
   * Launch a campaign: validates launch blockers, then stamps
   * `launched_at` + `agent_snapshot_id`, flips members to `ready`, and
   * transitions status to `running`.
   */
  async launch(campaignId) {
    return this.client.post(`/campaigns/${campaignId}/launch`);
  }
  /** Evaluate launch blockers without launching (dry run). Safe from any status. */
  async launchBlockers(campaignId) {
    return this.client.get(`/campaigns/${campaignId}/launch-blockers`);
  }
  /** Pause a running campaign. In-flight calls finish naturally. */
  async pause(campaignId) {
    return this.client.post(`/campaigns/${campaignId}/pause`);
  }
  /** Resume a paused campaign. */
  async resume(campaignId) {
    return this.client.post(`/campaigns/${campaignId}/resume`);
  }
  /** Archive a campaign. Terminal — the scheduler never selects work for it again. */
  async archive(campaignId) {
    return this.client.post(`/campaigns/${campaignId}/archive`);
  }
  /** Read the campaign report: `stat_*` summary counters + outcome/sentiment/hourly/snapshot distributions. */
  async report(campaignId) {
    return this.client.get(`/campaigns/${campaignId}/report`);
  }
  /** List a campaign's dial attempts, paginated. */
  async attempts(campaignId, params = {}) {
    return this.client.get(`/campaigns/${campaignId}/attempts${buildQuery4(params)}`);
  }
  /** List a campaign's sweep-claim batches, paginated. */
  async batches(campaignId, params = {}) {
    return this.client.get(`/campaigns/${campaignId}/batches${buildQuery4(params)}`);
  }
  /** List a campaign's follow-up jobs, paginated. */
  async followups(campaignId, params = {}) {
    return this.client.get(`/campaigns/${campaignId}/followups${buildQuery4(params)}`);
  }
  /** Run the improve engine: detectors gate an LLM proposal writer, persisting new `campaign_suggestions`. */
  async improve(campaignId) {
    return this.client.post(`/campaigns/${campaignId}/improve`);
  }
  /** List a campaign's improvement suggestions, paginated. */
  async suggestions(campaignId, params = {}) {
    return this.client.get(`/campaigns/${campaignId}/suggestions${buildQuery4(params)}`);
  }
  /** Accept a suggestion: agent-editing suggestions create an agent-changes draft; campaign-policy suggestions patch the campaign. */
  async acceptSuggestion(campaignId, suggestionId) {
    return this.client.post(`/campaigns/${campaignId}/suggestions/${suggestionId}/accept`);
  }
  /** Dismiss a suggestion without applying it. */
  async dismissSuggestion(campaignId, suggestionId) {
    return this.client.post(`/campaigns/${campaignId}/suggestions/${suggestionId}/dismiss`);
  }
};

// src/resources/contacts.ts
function buildQuery5(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== void 0 && v !== null) sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}
var ContactsResource = class {
  constructor(client) {
    this.client = client;
  }
  /** List tenant-level contacts, paginated. */
  async list(params = {}) {
    return this.client.get(`/contacts${buildQuery5(params)}`);
  }
  /**
   * Create a tenant-level contact. If a contact with the same
   * (tenant, phone) already exists, the existing row is returned instead
   * of creating a duplicate — check `deduped` in the response.
   */
  async create(data) {
    return this.client.post("/contacts", data);
  }
  /** Retrieve a single tenant-scoped contact by id. */
  async get(contactId) {
    return this.client.get(`/contacts/${contactId}`);
  }
  /** Update an existing tenant-scoped contact. Only provided fields change. */
  async update(contactId, data) {
    return this.client.patch(`/contacts/${contactId}`, data);
  }
  /** Delete a tenant-scoped contact. */
  async delete(contactId) {
    return this.client.delete(`/contacts/${contactId}`);
  }
  /**
   * Bulk import contacts from JSON rows or CSV text. Each row's phone is
   * normalized to E.164 and upserted on (tenant_id, phone); rows with
   * unparseable phones are skipped and reported in `invalid`.
   */
  async import(data) {
    return this.client.post("/contacts/import", data);
  }
  /** Record a consent grant or revoke for one channel, with evidence. Also
   *  appends an immutable row to the consent_events proof log. */
  async setConsent(contactId, data) {
    return this.client.patch(`/contacts/${contactId}/consent`, data);
  }
};

// src/resources/compliance.ts
var ComplianceResource = class {
  constructor(client) {
    this.client = client;
  }
  /** Record a compliance attestation (append-only). Campaign launch blockers
   *  in `attested` mode read the most recent one of the matching `kind`. */
  async attest(data) {
    return this.client.post("/compliance/attestations", data);
  }
  /** List the tenant's 50 most recent compliance attestations, newest first. */
  async listAttestations() {
    return this.client.get("/compliance/attestations");
  }
};

// src/index.ts
export * from "@rymi/sdk-types";
var Rymi = class {
  client;
  agents;
  calls;
  dnc;
  numbers;
  webhooks;
  keys;
  telephony;
  billing;
  templates;
  campaigns;
  contacts;
  compliance;
  constructor(options) {
    this.client = new RymiClient(options);
    this.agents = new AgentsResource(this.client);
    this.calls = new CallsResource(this.client);
    this.dnc = new DncResource(this.client);
    this.numbers = new NumbersResource(this.client);
    this.webhooks = new WebhooksResource(this.client);
    this.keys = new KeysResource(this.client);
    this.telephony = new TelephonyResource(this.client);
    this.billing = new BillingResource(this.client);
    this.templates = new TemplatesResource(this.client);
    this.campaigns = new CampaignsResource(this.client);
    this.contacts = new ContactsResource(this.client);
    this.compliance = new ComplianceResource(this.client);
  }
};
var index_default = Rymi;
export {
  AgentsResource,
  BillingResource,
  CallsResource,
  CampaignsResource,
  ComplianceResource,
  ContactsResource,
  DncResource,
  KeysResource,
  NumbersResource,
  Rymi,
  RymiClient,
  RymiError,
  TelephonyResource,
  TemplatesResource,
  WebhooksResource,
  index_default as default
};
//# sourceMappingURL=index.mjs.map