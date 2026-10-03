# @rymi/node

## Unreleased

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
