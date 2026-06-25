"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AgentsResource: () => AgentsResource,
  BillingResource: () => BillingResource,
  CallsResource: () => CallsResource,
  DncResource: () => DncResource,
  KeysResource: () => KeysResource,
  NumbersResource: () => NumbersResource,
  Rymi: () => Rymi,
  RymiClient: () => RymiClient,
  RymiError: () => RymiError,
  TelephonyResource: () => TelephonyResource,
  TemplatesResource: () => TemplatesResource,
  WebhooksResource: () => WebhooksResource,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

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
  constructor(options) {
    const key = options?.apiKey || (typeof process !== "undefined" ? process.env.RYMI_API_KEY : void 0);
    if (!key) {
      throw new Error("The Rymi API Key must be set either by passing `apiKey` to the client or setting the `RYMI_API_KEY` environment variable.");
    }
    this.apiKey = key;
    this.baseURL = options?.baseURL || "https://api.rymi.live/v1";
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
      const response = await fetch(url, init);
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
    const query = params.mode ? `?mode=${params.mode}` : "";
    return this.client.post(`/agents/${agentId}/evals/run${query}`, {});
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
   * Queue up to 500 outbound PSTN recipients in one request.
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
  async remove(number) {
    return this.client.delete(`/numbers/${encodeURIComponent(number)}`);
  }
};

// src/resources/webhooks.ts
var crypto = __toESM(require("crypto"));
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

// src/index.ts
__reExport(index_exports, require("@rymi/sdk-types"), module.exports);
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
  }
};
var index_default = Rymi;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentsResource,
  BillingResource,
  CallsResource,
  DncResource,
  KeysResource,
  NumbersResource,
  Rymi,
  RymiClient,
  RymiError,
  TelephonyResource,
  TemplatesResource,
  WebhooksResource,
  ...require("@rymi/sdk-types")
});
//# sourceMappingURL=index.js.map