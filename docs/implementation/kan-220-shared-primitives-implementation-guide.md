---
title: KAN-220 shared primitives implementation record
doc-type: implementation-guide
status: implemented
last-reviewed: 2026-10-21
owners:
  - frontend
  - design-system
related-issue: KAN-220
related-repository: fradelli/design-system
---

# KAN-220 — Shared primitives and package portability

> **Historical record:** This guide records the original implementation plan. Its Radix/shadcn direction was superseded by [ADR 0002 — Accessible native primitives without a headless dependency](../decisions/0002-native-accessible-primitives.md). Follow ADR 0002 for current work; the dependency discussion is retained here only as historical context.

## Delivery status

- **Issue:** `KAN-220 — [Design System] Migrate and test shared UI primitives`.
- **Repository:** [fradelli/design-system](https://github.com/fradelli/design-system).
- **Original proposed branch:** `codex/KAN-220-shared-primitives`.
- **Base:** `main`, after KAN-222 and KAN-221 merged.
- **Implementation:** completed and validated locally.
- **Execution readiness:** completed on `codex/KAN-220-shared-primitives`, stacked on KAN-221.
- **Contract sources:** production components in Sandicts, ADR 0001, and the component admission checklist.
- **Out of scope:** adoption in Sandicts or Kaizen, calendar, shell, navigation, pages, `PageState`, `PendingButton`, `StatusBadge`, and all domain semantics.

## Outcome

The package exposes `cn`, `Alert`, `Badge`, `Button`, `Card`, `Field`, `Input`, `Label`, `Separator`, `Sheet`, and `Skeleton` through explicit subpaths. APIs were based on components validated in Sandicts, using visual names and no imports of routes, authentication, i18n, providers, schemas, or DTOs.

The tarball is the unit of validation. npm and pnpm fixtures import every subpath, render static primitives on the server, mount `Sheet` in a DOM, and process Tailwind classes with `@source` pointing at the installed artifact.

## Architectural record

Explicit subpaths form the public API. The root `@fradelli/ui` does not re-export the catalog, keeping client and server boundaries explicit and making bundle imports visible.

The migration preserves public variants and composition while replacing app aliases with relative `.js` imports, using the `--fd-*` and Tailwind aliases from KAN-221, removing redundant `dark:` classes, keeping copy in the consumer (including required `SheetContent.closeLabel`), and excluding product flags and Sandicts wrappers.

The original plan proposed granular Radix packages. ADR 0002 supersedes that choice: current code uses native HTML and browser features, with only small internal helpers where required. React and React DOM remain peer dependencies.

Tailwind classes are static in emitted JavaScript. Tailwind 4 consumers import package CSS and declare the installed package through `@source`; variants use literal maps or CVA values instead of dynamic class strings.

Accessibility is part of each primitive's contract: focus and keyboard behavior, accessible labels, native field associations, reduced motion, and state communication that does not rely on color alone. The package does not choose a locale or create a form provider just to generate IDs.

## Validation and maintenance

Package validation checks exact tarball contents, every export target, forbidden consumer aliases and domains, publint, type resolution, and React peer dependencies. npm and pnpm fixtures install the same tarball, typecheck without path aliases, exercise static rendering and Sheet interaction, compile Tailwind CSS, and confirm one React and React DOM instance.

For the current release classification and publishing procedure, see [versioning and releases](../governance/versioning-and-releases.md) and [release operations](../governance/releasing.md). For new components, follow the [component admission checklist](../governance/component-admission.md).
