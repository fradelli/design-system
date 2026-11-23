# ADR 0006 — Mira recipes and shared interaction primitives

- **Status:** Accepted
- **Date:** 2026-11-12

## Decision

Use shadcn/ui preset `b1HwjY1BI0` (Mira) and Base UI for new shared primitives. This supersedes the restriction on headless dependencies in ADR 0002 and the single-typeface policy in ADR 0001. Existing native components can be migrated incrementally. Keep existing imports and native form contracts when adapting a recipe.

Applications load IBM Plex Sans and Figtree and supply the CSS font variables. Existing consumers can continue to supply Inter as a fallback. Lucide supplies icons for new recipes. Existing Phosphor icon entry points remain public.

## Consequences

The package owns source code, tokens, keyboard behavior and public subpaths. Consumers own labels, interaction outcomes and routes. Use Storybook, interaction tests and consumer fixtures to review changes. The [shared style guide](../governance/shared-ui-style.md) records the palette and adoption process.
