# @rymi/node

## 2.0.0

- Removed the four-tier role pricing from cost estimation. `billing.estimate()`
  now takes `{ stt_model, llm_model, tts_model, duration_seconds }` instead of a
  `tier`, matching the two-track pricing model (managed SKUs vs custom agents at
  component cost + $0.02/min). The old `tier` argument was already ignored by the
  server.
- Removed the `role` parameter from `agents.previewStack()` / `PreviewStackParams`.
  The stack-preview endpoint resolves stacks from languages and provider config;
  the `role` argument was unused.
