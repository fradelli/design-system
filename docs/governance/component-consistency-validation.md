# Component consistency evidence — 2026-10-19

## Local delivery

Implementation was prepared on branch `codex/shared-glass-foundation`, preserving the earlier candidate. The package remains at `0.4.0` until Changesets determine the release version. No publication, PR, commit, or application migration was performed in that implementation stage.

The existing ADR 0002 on native primitives was preserved. The glass and composition decisions were recorded as ADRs 0003 and 0004, avoiding a numbering collision in the unpublished candidate.

## Findings and implementation

| Finding | Implementation and evidence |
| --- | --- |
| Card lacked horizontal inset | Root padding by density is generated from tokens; slots do not duplicate it. LayoutContracts compares glass/solid, default/compact, direct titles, line height, and geometry. |
| Alert content overlapped | Explicit content columns and flow with or without an icon; action uses a reserved row. Five variants, long text, missing title/description, and non-intersecting boxes were tested. |
| PendingButton became compressed | Overlaid states in a grid participate in sizing; spinner does not shrink. Four sizes, state transition without width jumps, and accessible name were tested. Icon sizes have a dedicated example. |
| Sheet stayed closed or opened on the wrong side | Display is conditional on open and insets reset per side. Four sides, close, hidden state, and focus restoration were tested. |
| Confirmation dialog had no separation | Content organizes regions with a gap; title uses the panel role; height is constrained and scrollable. Spacing after animation, safe initial focus, cancellation, and focus restoration were tested. |
| Switch lacked checked background | Theme color key was corrected. An interactive controlled story tests state and computed color after transition. |
| Badge stretched | Intrinsic height, alignment, and wrapping text; a taller neighbor and long label were tested. |
| Typography diverged | Complete display, section, card, body, interface, and label roles; theme maps interface utilities to tokens. Foundations shows the effective roles. |
| Other families | Label line height; Field inset, min width, and separator; RadioGroup base appearance, one Tab entry, and native required validity; Popover pure calculation, bounds, and resize/scroll observation; Slot merges classes, events, and refs. |

## Catalog

The catalog has 18 component families in their own folders under `src/stories/components/`, alphabetically arranged in Components. Foundations presents tokens and materials; Patterns contains an integration form. Glass is a Card surface, not a parallel family. The catalog contains 49 stories after the added icon-size examples.

## Checks performed

- `npm run ci` passed: formatting, lint, types, 41 unit tests across 15 files, deterministic token verification, Storybook build, 46 Chromium stories, package build, allowlist, publint, type resolution, and npm/pnpm fixtures with one React instance.
- The package repository audit found no vulnerabilities.
- The 46-story catalog passed 138 scenarios in Chromium, Firefox, and WebKit at 1280px, and another 138 at 320px.
- Critical Card, Alert/AlertDialog, Sheet, PendingButton, Popover, and Field scenarios passed 57 tests at 375px and 57 at 768px across all three browsers.
- Final Button/PendingButton icon examples passed 24 scenarios at 320px across all three browsers. Lint, types, catalog build, and tarball checks were repeated afterward.
- Visual Storybook review confirmed alerts without overlap, family-based catalog organization, and Card insets. Automated accessibility checks are enabled. Contrast on translucent surfaces remains inconclusive and needs human evaluation over real backgrounds.
- `git diff --check` and searches for secret patterns, residual whitespace, and invalid characters covered new and changed files.

Geometry checks wait for final animation state. The tarball allowlist includes the four emitted files for two internal positioning modules; they are not new public subpaths. Storybook build retains its own catalog chunk-size warnings.

## Compatibility review and publication limits

The portfolio's local glass layer already adds padding, and its contact form uses `px-0` and inner slots. Those usages need coordinated migration so the form does not lose its inset. The portfolio remains on its installed version; this review changed neither source nor lockfile. Kaizen and Sandicts were not modified.

Before publication, complete human review with Inter loaded, a screen reader, and real 200% zoom. Compare and approve real consumer screens, especially padding and height overrides, and measure performance. Review contrast over specific backgrounds, system transparency preferences, and unsupported-browser fallbacks. Review localized form messages with a screen reader.

The npm-consumer Tailwind fixture still reports four previously documented high-severity findings in its tool tree. The functional gate does not equal a clean audit of that fixture. No forced fix or override was made without evaluation.

These items are not implicit approvals. Release and consumer migrations remain separate steps after review.

## Additional validity and focus checks

RequiredForm reproduced incorrect positive validity in all three browsers before the fix: `readOnly` on internal inputs removed them from validation. Inputs now use `onChange` to update the group; invalid state keeps focus on a visible control. The regression passed Chromium, Firefox, and WebKit.

Controls with their own focus indicator use the internal `fd-focus-managed` marker; the global outline is a fallback for other elements. This prevents stacking an outline and ring on the same control. Input retains a visible ring and its error color when invalid. CompiledStyles confirmed the focused field has no outline and keeps a ring in all three browsers (18 Card-family scenarios).

## Final technical run

The final `npm run ci` passed with `DS_BROWSERS=chromium,firefox,webkit` and `DS_VIEWPORT_WIDTH=320`: 41 unit tests, 147 Storybook scenarios (49 per browser), token generation/check, build, tarball, npm/pnpm fixtures, and repository audit with no findings. Final review covered 58 new or changed files, with no secret patterns, invalid characters, or residual whitespace; relative links in new documents were checked.

The last catalog-only adjustment removed ineffective controls from comparison galleries; editable Playgrounds retain the controls. Lint, types, and Storybook build passed afterward, with no further library artifact changes. The candidate was ready for local review, with the publication and human-validation items above still open.
