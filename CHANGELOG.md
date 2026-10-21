# Changelog

## 0.5.0

### Minor Changes

- 5478cfa: Adopt the portfolio's approved glass visual language as the shared foundation. Card uses glass by default, with `surface="solid"` as an opaque option; CardTitle and SheetTitle adopt the title hierarchy, and Input receives a 60% elevated background.

  Breaking visual change in 0.x: review contrast, composition, and spacing before upgrading. Includes public surface and typography tokens and classes, an opaque fallback, and reduced-transparency support. See `docs/governance/glass-migration.md`. The staged release was approved with the portfolio as the validated consumer; the other applications require their own validation before upgrading. See ADR 0005.

  Standardize composition across surfaces: Card now owns root padding (24px/default, 16px/sm), with no horizontal padding on slots; section and body roles use 24/32 and 16/24. Adds display/interface/label roles, Sheet, Alert, PendingButton, Switch, RadioGroup, and Popover fixes, plus family-based stories. Text Buttons use a minimum height and allow wrapping; AlertAction occupies a reserved row. These visual changes require reviewing consumer overrides.

  Also fixes native validity for a required RadioGroup with no selection: internal inputs no longer use readOnly, preserve FormData, and direct invalid focus to a visible item. Localized messages remain the consumer's responsibility.

## 0.4.0

### Minor Changes

- ae46423: Replace Radix-backed primitives with accessible native implementations and add generic Popover and RadioGroup components.
- 2dd2eaf: Add generic accessible AlertDialog, LoadingRegion, PendingButton, and StatusBadge primitives.

## 0.3.0

### Minor Changes

- 2f43398: Add NavigationItem as a navigation-link primitive with an active state, visible focus, and a minimum touch target. Export BarbellIcon and ForkKnifeIcon through an explicit subpath, reusing Phosphor without new dependencies.

## 0.2.0

### Minor Changes

- 09488a8: Add the accessible `Switch` primitive with controlled, disabled, and visible-focus states.

## 0.1.0

### Minor Changes

- 1d695cb: Add the `cn` helper and the first shared primitives with explicit subpaths, accessibility tests, and validation with npm and pnpm consumers.
- 858657f: Add the dark-first visual foundation with DTCG tokens, Inter through a consumer variable, and CSS compatible with Tailwind 4.

All relevant `@fradelli/ui` changes are recorded in this file by Changesets automation.
