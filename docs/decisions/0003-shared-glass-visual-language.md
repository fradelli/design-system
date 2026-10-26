# ADR 0003 — Shared glass visual language

- **Status:** Accepted for implementation; consumer validation and publication pending
- **Date:** 2026-10-19
- **Decision:** Extends ADR 0001 for consumers and visual treatment while preserving its architectural boundaries

## Context

The personal portfolio adopted the `@fradelli/ui` palette and primitives, then added local glass surfaces and typographic hierarchy. The user approved this appearance as a reference for the portfolio, Kaizen, and Sandicts. Copying CSS into each product would create competing sources of truth.

The consulted remote base publishes `0.4.0`. This change builds on that version without changing published versions or editing the previous ADR.

## Decision

The package shares glass surfaces and typographic roles while preserving existing opaque tokens and colors. Card uses glass by default and offers `surface="solid"` for density, contrast, and compositions that should not nest blur. Sizes, slots, padding, and semantics remain; CardTitle adopts the card-title role. SheetTitle uses the same role, and Input receives the 60% elevated background already used by the portfolio.

The public classes `fd-surface-glass`, `fd-surface-glass-elevated`, `fd-text-card`, `fd-text-section`, and `fd-text-body` support compositions that do not need a new component. Surfaces do not set padding, radius, border width, or interaction. There is no competing public GlassCard family.

Visual tokens use DTCG dimensions and aliases where applicable. Derived CSS values such as `color-mix` and shadows with derived colors are DTCG string tokens intended for CSS, not structured DTCG colors. Style Dictionary resolves their references deterministically.

The implementation provides an opaque fallback when unsupported, reduced-transparency preference, forced-colors support, and an explicit opt-out through `html[data-fd-transparency="reduce"]`. The standard backdrop-filter declaration follows its prefixed form to preserve compiled CSS. Reduced motion remains independent.

The package does not load fonts; consumers provide Inter. Hero titles, stars, gravity, imagery, domain, and screen layout remain local. Controls that already have suitable contrast and states keep their treatment; blur is not applied indiscriminately to badges, tables, or overlays.

## Compatibility and admission

Token and Card primitive changes do not introduce a composed domain pattern. The ADR 0001 admission criteria continue to govern future compositions.

The default changes to Card, CardTitle, SheetTitle, and Input are material and form a breaking minor change in `0.x`, documented by a Changeset and migration guide. The final version depends on the release queue. This decision does not publish a package.

Validate the artifact in all three consumers and complete visual review before release. Each application updates its exact version through its own PR. Sandicts must review its visual policy and generators; Kaizen must review local overrides. Publishing does not migrate consumers automatically.

## Risks and rollback

Glass can reduce contrast over light backgrounds and increase compositing cost. Use one layer per panel, opaque backgrounds where needed, review states without relying on color alone, and compare performance on real screens.

Roll back consumer code, styles, manifest, and lockfile together. Published versions are immutable. Missing visual or consumption evidence blocks publication; it is not implicit approval.
