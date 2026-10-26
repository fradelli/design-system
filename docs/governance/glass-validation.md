# Glass candidate validation evidence — 2026-10-19

## Scope

The foundation was implemented on local branch `codex/shared-glass-foundation`, based on `origin/main` at commit `b302e0e`, with base version `0.4.0`. This record covers that implementation stage; it contains no package release or consumer migration.

The implementation includes tokens, shared classes, glass/solid Card, CardTitle, SheetTitle, an Input background, examples, tests, and documentation. The palette, peer dependencies, and domain behavior stay unchanged.

## Validation results

| Check | Result |
| --- | --- |
| Clean install with `npm ci --ignore-scripts` | Passed after stopping a local server that held esbuild open on Windows |
| `npm run ci` | Passed, including all gates below |
| Formatting, lint, and types | Passed |
| Unit tests | 37 passed across 13 files |
| Tokens | Deterministic generation and check passed |
| Storybook build | Passed; catalog chunk-size warning remains |
| Chromium Storybook tests | 18 passed across four files, including configured accessibility checks |
| Packaging | Build, publint, and supported type-resolution modes passed |
| npm and pnpm fixtures | Install, types, CSS, and smoke checks passed with one React version |
| Package repository audit | No vulnerabilities after compatible fixes |
| Whitespace and secret patterns | Reviewed across changed files, including new files |

The final override example uses the default glass surface. Formatting, Storybook build, and its tests were repeated after that adjustment. Compiled CSS confirms 12px blur, 16px radius, 24px horizontal padding, 20px title, consumer class overrides, field error association, keyboard operation, and opaque opt-out.

Shared styles live in the component CSS layer so consumer utilities retain priority. Browser tests now include the Tailwind plugin already used by the build; before this, tests did not exercise compiled utilities.

## Base issues resolved for validation

The first install exposed two vulnerable development transitive dependencies already present in the base:

| Package | Before | After | Path and evidence |
| --- | ---: | ---: | --- |
| `shell-quote` | 1.10.0 | 1.12.0 | Changesets → launch-editor; GHSA-pqg4-j6r4-53mv, critical |
| `source-map-js` | 1.2.1 | 1.2.2 | jsdom/css-tree and Tailwind tools; GHSA-68fv-2mgg-jv7q, high |

The audit simulation indicated only these compatible updates. They were applied by npm without overrides.

## Consumer compatibility read-through

The portfolio's local glass layer adds padding, and its contact form uses `px-0` and inner slots. Those usages need a coordinated migration so the form keeps its inset. The portfolio remains on its installed version; this review changed neither its source nor lockfile. Kaizen and Sandicts were not modified.

## Open items before broader adoption

- Human review with Inter actually loaded, a screen reader, and real 200% zoom. The preview declares a system fallback and does not prove that Inter loads in every environment.
- Visual comparison and approval on real consumer screens, especially padding and height overrides; measure performance in real compositions.
- Contrast over specific backgrounds, system preferences, and fallback in unsupported environments, in addition to existing opt-out tests.
- RadioGroup with no initial selection and a disabled item was checked. RequiredForm passed in all three browsers (nine family scenarios), covering required validity, focus on the first visible item, and FormData after selection. This does not replace screen-reader review of localized messages.
- The npm-consumer Tailwind fixture still reports four high findings in `@tailwindcss/cli` and its dependency tree. The warning was documented already; a functional gate is not the same as a clean fixture audit. No forced fix or override was applied without evaluation.

These limits are not claims of approval. Publication and migrations remain separate steps after candidate review.

## Additional native validity fix

RequiredForm reproduced an incorrectly positive validity state in all three browsers before the fix: `readOnly` on internal inputs removed them from validation. Inputs now use `onChange` to update the group; an invalid state keeps focus on a visible control. The regression passed in Chromium, Firefox, and WebKit.

## Focus without duplication

Controls with their own indicator use the internal `fd-focus-managed` style marker; the global outline is a fallback for other elements. This avoids stacking an outline and ring on one control. Input retains a visible ring without reducing its color to 30%; invalid state preserves the error color. CompiledStyles confirmed no outline and a present ring on the focused field in all three browsers (18 Card-family scenarios).

## Final technical run

The final `npm run ci` passed with `DS_BROWSERS=chromium,firefox,webkit` and `DS_VIEWPORT_WIDTH=320`: 41 unit tests, 147 Storybook scenarios (49 per browser), token generation and check, build, tarball, npm/pnpm fixtures, and a repository audit with no findings. Final review covered 58 new or changed files, with no secret patterns, invalid characters, or residual whitespace; relative links in new documents were checked.

The final catalog metadata adjustment removed ineffective controls from comparison galleries; editable Playgrounds retain those controls. Lint, types, and Storybook build passed again, with no further library artifact changes.

The candidate is ready for local review with publication and human-validation items listed above.

## Catalog language review — 2026-10-19

All visible Storybook examples were standardized in English. Remaining PendingButton, Alert, Badge, Card, Label, and Popover examples were translated while retaining long content to exercise composition. The button test now expects “Saving changes” and still checks width stability.

Formatting, lint, types, 20 affected example tests in Chromium, Storybook build, and `git diff --check` passed. Inspection of the Interactive example confirmed “Pending state” and “Saving changes”. A search found no remaining Portuguese text in stories. The change affected the catalog and tests only; it did not change the library's API or public artifact.
