# Persistent status primitives

## Source and approach

Reviewed on 2026-11-13. shadcn/ui [Item](https://ui.shadcn.com/docs/components/base/item)
provides media, content, title, description, and action slots. It fits persistent
content with independent navigation and action controls. [Toast](https://ui.shadcn.com/docs/components/base/toast)
is documented as a temporary message, so it is not the persistent activity UI.

`src/components/item/index.tsx` comes from the official
[base-mira Item registry recipe](https://ui.shadcn.com/r/styles/base-mira/item.json),
retrieved directly as registry source, without running the CLI. The recipe needs
only the existing Base UI, class-variance-authority, cn, and Separator dependencies.
Changes: public package-relative imports, shared semantic color/focus mappings,
an explicit client boundary for useRender, and an additive `elevated` variant
using the shared elevated surface, border, and shadow. Other sizes and slots are
preserved. This is a primitive, not a domain-specific activity bar.

Retrieved registry JSON SHA-256:
`5f76a95b6dbac4cd164b49832be2d2b248e409449058fe67068c60020b056f1a`.

`StatusIndicator` is a generic visual primitive, not an official shadcn component.
It uses existing semantic status colors and supports neutral, success, warning,
and destructive tones. Pulse is opt-in, uses a two-second subtle cycle, and stops
under reduced motion. Forced colors use CanvasText. An unlabeled dot is decorative;
an explicitly labeled dot is an image, without a live region. Consumers expose
textual state as well and must not announce a ticking timer every second.

## Admission and ownership

Concrete consumer: Kaizen's existing active execution recovery control. These
fundamental primitives satisfy the exception to the two-product admission rule;
no shared composed activity bar is introduced. There are no workout props, DTOs,
routes, persistence, providers, timer logic, or new dependencies in the package.

The application positions an Item outside document flow and above its navigation,
owns safe-area offsets, and maps active/paused to pulse and semantic tone. An
independent link resumes; a sibling Button opens destructive confirmation.
Fixed placement and removal of layout reservations belong to the app. Existing
Dialog controls focus and remains above the floating surface.

The consumer's independent destructive action uses Button `size="icon-touch"`
(44 CSS pixels) and Trash2 from the new explicit `@fradelli/ui/lucide-icons`
entry. Only the currently consumed Lucide drawing is admitted in this iteration;
legacy generated Phosphor paths remain unchanged. This is not a claim of a
complete Lucide catalog migration.

## Delivery

Additive minor Changeset. Validate unit contracts, Storybook keyboard interaction,
reduced-motion CSS, npm/pnpm artifact imports and SSR, package checks, and the
installed Kaizen candidate. Local tarballs retain preview metadata and are not
published replacements for the immutable 0.6.0 release. Publish only through the
Release workflow after review. Rollback the consumer to its prior candidate or
published exact version; no database changes are required.

## Verified in this iteration

- TypeScript, package build and shared token/icon determinism checks passed.
- Six focused unit/export/client-boundary tests passed; the broad unit run was
  interrupted without a result and is not recorded as a passing full suite.
- Four Chromium Storybook tests passed for Item and StatusIndicator. The first
  run reloaded while optimizing Base UI dependencies; explicit optimizer entries
  fixed the reload and the repeated run passed.
- Storybook production build passed. Package allowlist, strict publint and ESM/
  bundler type resolution passed, including all three new public entry points.
- The new tarball is validated as a local candidate, not a published release.
- Fresh npm and pnpm consumer fixtures passed type checking, generated CSS,
  SSR smoke imports (including Item, StatusIndicator and Trash2), and the
  single-React-instance check.
- Installed Kaizen candidate SHA-256:
  `81a1e9f7bec582ad4c8c8dfd7f076abd988f7971a51f9d700f6acfe08fbf00ae`.
  Its production build, 21 focused recovery tests, static gates, and browser
  scenarios at 1440, 390 and 320 CSS pixels passed. The main layout was unchanged
  when the floating control appeared; mobile navigation stayed clear. Pulse,
  reduced motion, paused state, 44-pixel action target, independent actions and
  cancellation focus restoration passed. Physical-device safe areas remain unverified.
