# ADR 0001 — Shared Design System foundation

- **Status:** Accepted
- **Date:** 2026-09-07
- **Decision makers:** frontend/design-system
- **Issue:** [KAN-223](https://sandicts.atlassian.net/browse/KAN-223)

## Context

Sandicts and Kaizen are related products developed by the same owner, with schedules as a relevant part of their work. They need to share identity and visual quality without coupling their domains or release cycles.

Copying styles between repositories would create divergence. A monorepo would combine cycles that are currently independent. A package that knew about reservations, diet, or tasks would create a `common` layer that is difficult to evolve. We therefore need a small normative source with verifiable boundaries.

## Decision

The `fradelli/design-system` repository is the normative source for the Design System. It initially contains one package, `@fradelli/ui`, with versions pinned independently by Sandicts and Kaizen.

~~~text
fradelli/design-system
  └─ @fradelli/ui
       ├─ Sandicts
       └─ Kaizen
~~~

The first release is dark first. This sets implementation priority and does not prohibit a future light mode. Variable Inter is the shared proportional typeface. Applications load the font once at the root, expose `--font-inter`, and the package references that variable with a system fallback. The package does not depend on `next/font` or distribute font binaries.

## Ownership

| Item | Owner | Notes |
| --- | --- | --- |
| Semantic tokens, typography, radius, focus, and motion | `@fradelli/ui` | Domain agnostic visual contract |
| Generic visual statuses | `@fradelli/ui` | `success`, `warning`, `info`, and `destructive` |
| Primitives and their accessibility tests | `@fradelli/ui` | For example: Button, Input, Alert, and Dialog |
| Visual patterns proven in two products | `@fradelli/ui` | Subject to the admission checklist |
| Logo, name, metadata, and artwork | Application | Product specific identity |
| Shell, page, route, and feature composition | Application | Includes composed schedules |
| Reservation, court, workout, diet, habit, and task | Application | Domain is never exported by the package |
| API, persistence, query, i18n, and authentication | Application | Integrations stay local |
| Mapping between a category and business meaning | Application | The package provides color, not domain semantics |

## Visual foundation

### Typography

Variable Inter is used by role, without competing type families:

| Role | Initial weight |
| --- | ---: |
| Body | 400 |
| Label and navigation | 500 |
| Emphasis and actions | 600 |
| Headings | 700 |
| Display and text wordmark | 800 |

A system monospace font may still be used when the content requires technical character alignment.

### Colors

The values below are the initial contract to be converted into tokens and validated by KAN-221. They do not authorize duplicated CSS in consumers.

| Role | Initial value |
| --- | --- |
| Background | `#0B0B0C` |
| Surface | `#141416` |
| Elevated | `#1C1C1F` |
| Border | `#2B2B30` |
| Foreground | `#F4F4F5` |
| Muted foreground | `#9B9BA3` |
| Brand red | `#F07878` |
| Primary yellow | `#F2CF63` |

The categorical palette contains eight pastel colors:

| Visual category | Initial value |
| --- | --- |
| Yellow | `#F2CF63` |
| Orange | `#F0A866` |
| Red | `#F07878` |
| Pink | `#E58AB7` |
| Purple | `#B79AF2` |
| Blue | `#7DA7F2` |
| Cyan | `#65C8D0` |
| Green | `#7BC8A4` |

These names describe appearance, not domain. For example, Sandicts decides which category represents an activity; Kaizen decides which one represents diet or training. Color must always be accompanied by text, an icon, or another indicator.

`brand` and `destructive` are separate tokens even when both look red. Identity must not automatically imply error semantics.

## Technical contract

- React and React DOM are peer dependencies.
- TypeScript, Tailwind CSS 4, shadcn/ui over Radix Nova, and Phosphor form the initial technical direction.
- The package does not depend on Next.js and preserves the boundaries required for React Server Components.
- Source tokens follow the DTCG format and generate deterministic CSS.
- CSS, the `cn` helper, and components are exposed through explicit subpaths.
- Storybook documents foundations, states, and variants.
- The complete calendar stays local until there are two real uses and a demonstrably domain agnostic API. Smaller date primitives can be evaluated separately.

None of these tools were configured by KAN-223. Implementation belongs to issues KAN-222, KAN-221, KAN-220, and KAN-226.

## Distribution and evolution

The package starts private on GitHub Packages even though this repository is public. No credentials are committed. Consumers install an exact version and choose when to upgrade; publishing a version does not update applications.

We use Semantic Versioning and Changesets. While the API is in `0.x`, breaking changes still require a changelog and migration guide. Reaching `1.0.0` requires validated use by both consumers, a reviewed public API, and a stable release process.

Detailed rules are in [`versioning-and-releases.md`](../governance/versioning-and-releases.md).

## Component admission

Basic primitives may originate in the package. Composed patterns enter only after real use in two products and approval under [`component-admission.md`](../governance/component-admission.md). Flags such as `product`, `sandictsVariant`, or `kaizenVariant` indicate an unsuitable abstraction.

## Rejected alternatives

- **Copying styles between apps:** creates divergent sources of truth.
- **Combining products in a monorepo:** couples release cycles without need.
- **Creating multiple packages now:** adds versioning without proven separate owners or cycles.
- **Sharing pages or domain:** turns the visual package into a business layer.
- **Extracting a complete calendar in the first release:** commits to an API before we know both real use cases.

## Consequences and risks

This decision reduces visual duplication and allows independent versioned evolution. In return, it requires release discipline, testing the actual artifact, reviewing breaking changes, and temporarily maintaining compatibility during migrations.

The main risks are premature abstraction, accidental Next.js dependency, duplicate React copies, Tailwind classes that go undetected, and token divergence. The admission checklist, peer dependencies, consumer fixtures, explicit `@source`, and deterministic generation control these risks.

## Review and supersession

Review this decision if release cycles become genuinely independent, a third consumer has incompatible requirements, or separating tokens from components becomes necessary. A structural change requires a new ADR that explicitly supersedes this one; do not silently alter a decision already used by releases.
