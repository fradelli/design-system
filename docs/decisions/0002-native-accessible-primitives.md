# ADR 0002 — Accessible native primitives without a headless dependency

- **Status:** Accepted
- **Date:** 2026-10-04
- **Decision makers:** Sandicts product owner and frontend/design-system
- **Supersedes:** The technical direction for primitives recorded in ADR 0001

## Context

ADR 0001 recorded shadcn/ui over Radix as the initial technical direction. Integration showed that consuming applications would depend on external primitives and styles beyond the shared package. Sandicts decided not to depend on Radix or equivalent headless libraries; the Design System owns visual APIs and their accessible behavior.

## Decision

`@fradelli/ui` implements React primitives using HTML elements and native browser features. The package does not depend on Radix, shadcn, or another headless primitive library. Utility dependencies without headless behavior, such as `class-variance-authority`, remain allowed when the package uses them.

Dialogs use native `<dialog>` and `showModal()`, relying on the browser for focus, Escape, and the top layer. Popover implements positioning, keyboard behavior, Escape dismissal, and outside interaction in the package's visual layer. RadioGroup uses native controls and exposes keyboard group navigation. Label and Separator use HTML without third-party wrappers. Existing `asChild` composition uses a small internal helper without an external dependency.

The Design System owns tokens, published CSS, and accessibility tests. Each component is validated in Storybook and consumer fixtures; product differences are handled through composition and tokens.

## Consequences

- Applications import primitives only from `@fradelli/ui`.
- Native behavior changes require tests in supported browsers and predictable fallbacks in test environments.
- Package CSS supplies transitions and respects reduced motion.
- ADR 0001 remains as a historical record. Its nontechnical decisions about ownership, tokens, boundaries, and versioning remain in force.

## Reversal

A future strategy change requires a new ADR that supersedes this decision and explains the dependencies and ownership of accessible behavior.
