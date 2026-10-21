# ADR 0004 — Consistent composition across surfaces

- **Status:** Accepted by the user for implementation; publication pending
- **Date:** 2026-10-19
- **Decision:** Supersedes ADR 0003's preservation of padding and slots; retains its material decisions and ADR 0001's boundaries.

## Context

Catalog review found unindented direct titles, overlapping alerts, compressed pending states, and inconsistent typography. Material and composition must vary independently.

## Decision

Card has a single owner for padding: its root. The default uses 24px padding and a 16px gap; `sm` uses 16px padding and a 12px gap. Slots do not duplicate insets. Glass and solid share geometry, radius, and text roles. There is no competing GlassCard family.

Complete typography roles define size, line height, and weight: display 32/40, section 24/32, panel/card 20/28, editorial 16/24, and interface/label 14/20. Consumers provide the font. Tokens generate CSS; explicit utilities remain available for legitimate contexts.

The catalog is organized into Foundations, Components by family, and integration Patterns. Story folders match the navigation. Every relevant state must be verifiable with compiled CSS and variable content.

Overlays keep their public APIs and fix visibility, anchoring, boundaries, and focus. Popover separates observation effects from pure calculations. `asChild` composition resolves utility conflicts while preserving handlers and refs.

## Compatibility

This is a breaking minor change in `0.x`. Review Card overrides, fixed Button heights, and AlertAction placement using the migration guide. Applications are not updated automatically. Fixes and package tests do not replace validation on real screens before publication.
