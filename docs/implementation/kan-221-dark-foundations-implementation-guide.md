---
title: KAN-221 dark foundations implementation record
doc-type: implementation-guide
status: implemented
last-reviewed: 2026-10-21
owners:
  - frontend
  - design-system
related-issue: KAN-221
related-repository: fradelli/design-system
---

# KAN-221 — Dark tokens, Inter, and Storybook foundations

## Delivery status

- **Scope:** implement the first versioned visual foundation for `@fradelli/ui`, without creating or migrating components.
- **Issue:** `KAN-221 — [Design System] Implement dark tokens, Inter, and Storybook foundations`.
- **Repository:** [fradelli/design-system](https://github.com/fradelli/design-system).
- **Original proposed branch:** `codex/KAN-221-dark-foundations`.
- **Base:** `main`, after [KAN-222 PR #1](https://github.com/fradelli/design-system/pull/1) merged.
- **Implementation:** completed and validated locally.
- **Execution readiness:** completed on `codex/KAN-221-dark-foundations` after KAN-222 merged.
- **Evidence:** KAN-221, ADR 0001, the KAN-222 scaffold, current Sandicts and Kaizen manifests and styles, and the official sources listed in the original plan.
- **Out of scope:** Button/Input/Dialog, `cn`, Radix/shadcn, Phosphor, calendar, GitHub Packages publication, and application installation.

## Outcome

DTCG files are the editable source of visual values. The build generates one `dist/styles.css` with stable CSS variables, a dark-first base, and optional Tailwind 4 aliases. The CSS works without Tailwind, as in the original Kaizen setup, and with Tailwind 4, as in Sandicts.

Storybook documents color, typography, spacing, radius, and focus. Unit tests validate aliases and contrast; Chromium Storybook tests validate rendering and accessibility.

## Architectural record

Values live in `tokens/*.json` using `$type`, `$value`, `$description`, and DTCG aliases. `src/styles/tokens.generated.css` is versioned for review and is never edited manually; `tokens:check` regenerates a temporary copy and fails on any difference. Style Dictionary is a translator, not another source of values.

`tokens/primitives.json` contains raw color, size, weight, and duration values. `tokens/semantic.dark.json` contains consumer-facing names that alias those primitives. Components and applications use semantic tokens; visual names such as `category.blue` do not define domain meaning.

Generated CSS uses the `--fd-*` namespace to avoid collisions with existing consumer tokens such as `--background` and `--primary`, allowing gradual migration. `src/styles/styles.css` maps package tokens to Tailwind 4 utility namespaces through `@theme inline`. Tailwind is an optional peer so consumers can use base variables and styles without installing Tailwind.

The package references `var(--font-inter, "Inter"), ui-sans-serif, system-ui, sans-serif`. Each application loads Inter once at its root and sets `--font-inter`. The package does not depend on `next/font`, `@fontsource/inter`, Google Fonts, or bundled WOFF files.

Storybook runs on React and Vite and has no Sandicts, Kaizen, or Next.js dependency. Accessibility violations fail the configured check; Vitest runs stories in Chromium in CI.

## Implementation sequence and checks

The original sequence established repository hygiene and Node/npm versions, package metadata and lockfile, strict NodeNext TypeScript builds, token sources and generation, CSS, Storybook, accessibility checks, and consumer fixtures. Generated CSS and lockfiles are maintained only by their respective build tools.

For current token changes, follow the repository rules in [AGENTS.md](../../AGENTS.md). Run `npm run tokens:build` after editing DTCG sources, then use `npm run tokens:check` and `npm run ci` before delivery.
