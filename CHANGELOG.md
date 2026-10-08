# @rymi/node

## Unreleased

## 2.5.0

- `withWorkspace(id)` returns a client that sends `Rymi-Workspace` on every request.
- Compliance settings: `compliance.getSettings`, `updateSettings`, and `previewSettings`.
- `billing.setCountry` sets the billing country. Locked after the first paid invoice (`409` `billing_country_locked`).

## 2.4.0

- `workspaces.create({ name, parent })` makes a client workspace of an agency workspace you
  run; the agency pays for its calls. `workspaces.update(id, { spend_cap_cents_monthly })`
  caps a client's monthly spend in credits.
- New `workspaces.usage(id, { month })` (calls, minutes and credits for a month) and
  `listMembers`, `addMember`, `removeMember`.

## 2.3.0

- New `workspace` client option (or the `RYMI_WORKSPACE` environment variable): every
  request acts in that workspace by sending the `Rymi-Workspace` header. Without it, a
  request acts in the key's own workspace, as before.
- New `workspaces` resource: `list()` (marks the current one), `create({ name,
  operating_country })` and `update(id, { name, operating_country })`.

## 2.2.0

- New `campaigns.intake` resource for a campaign's lead-intake URL: `get(id)`,
  `set(id, { assume_voice_consent, default_country })` (returns `url` once, on create),
  `rotate(id)` (new URL; the old one stops accepting leads) and `disable(id)`.

## 2.1.0

- New share-link methods on `agents`: `getShareLink(agentId)`,
  `setShareLink(agentId, settings)` (create or update: `enabled`, `minutes_limit`,
  `max_call_seconds`, `max_concurrent`, `calls_per_ip_hour`) and
  `regenerateShareLink(agentId)` (new URL; the old one stops working).
- `agents.create()` / `agents.update()` accept `tools` (the full bindings array;
  build it from a fresh `retrieve()`), and `Agent` now types `tools`.
- New `toolSecrets` resource: `list()`, `set(name, { value, host })`, `delete(name)`
  for API-tool header secrets referenced as `{{secrets.NAME}}`.

## 2.0.0

- Removed the four-tier role pricing from cost estimation. `billing.estimate()`
  now takes `{ stt_model, llm_model, tts_model, duration_seconds }` instead of a
  `tier`, matching the two-track pricing model (managed SKUs vs custom agents at
  component cost + $0.02/min). The old `tier` argument was already ignored by the
  server.
- Removed the `role` parameter from `agents.previewStack()` / `PreviewStackParams`.
  The stack-preview endpoint resolves stacks from languages and provider config;
  the `role` argument was unused.
