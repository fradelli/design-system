# Changelog

## 0.8.0

### Minor Changes

- ca10a01: Require consumer-supplied close labels on Dialog and Toast. This is a documented breaking change in `0.x`: no close control ships English copy anymore.

  - `DialogContent` requires `closeLabel` while it renders its corner close button, which is the default. The label replaces the hardcoded `Close` screen reader text.
  - `DialogFooter` requires `closeLabel` when `showCloseButton` is set. The label replaces the hardcoded visible `Close` text.
  - `Toaster` requires `closeLabel`. The `Close toast` default is removed.
  - `ToastClose` requires `aria-label`. The hardcoded `Close toast` name is removed.
  - The new `DialogContentProps`, `DialogFooterProps`, `ToasterProps`, and `ToastCloseProps` types describe these contracts.

  Migration: pass each label from the application's i18n messages. TypeScript reports every call site that omits one.

  ```tsx
  <DialogContent closeLabel={messages.close}>...</DialogContent>
  <DialogContent showCloseButton={false}>...</DialogContent>
  <DialogFooter showCloseButton closeLabel={messages.close} />
  <Toaster closeLabel={messages.dismissNotification} />
  <ToastClose aria-label={messages.dismissNotification} />
  ```

  To keep the previous English copy, pass `closeLabel="Close"` to Dialog and `closeLabel="Close toast"` to `Toaster`.

- 96d9587: Make `tailwindcss` (`>=4.3.0 <5`) a required peer dependency. The package CSS uses Tailwind theme variables and the components ship Tailwind class names that the consumer build compiles, so the package cannot be styled without Tailwind CSS 4. Package managers now report a missing peer when Tailwind CSS is not installed; consumers that already install `tailwindcss` need no change.

### Patch Changes

- 3620791: Highlight `DropdownMenuShortcut` and `ContextMenuShortcut` in the foreground color when their menu item is focused or highlighted. The shortcuts referenced group names that the menu items never declared, so the highlight never applied.

## 0.7.0

### Minor Changes

- 52b4af2: Add the official Base Mira toast recipe with Lucide icons and a configurable dismiss label.
- 52b4af2: Add ColorSwatch, a reusable rounded-square palette sample with decorative and accessible labeled modes, exported from @fradelli/ui/color-swatch.
- 52b4af2: Export the Base Mira context menu with shared surface tokens and Lucide icons.
- 52b4af2: Export the Base Mira Kbd primitive and use shared elevated surfaces for tooltips with legible shortcut keycaps.
- 52b4af2: Add the Base UI Mira accordion primitive and its public subpath.
- 52b4af2: Adopt Mira form and button styles and expose the Base UI dialog and checkbox through dedicated package entries.
  Export semantic button colors and apply Mira sizing to navigation links.
  Apply Mira card typography and support interactive titles through composition.
- 52b4af2: Add the official Mira Item primitive (default, outline, and muted variants) and a
  generic StatusIndicator with opt-in pulse and reduced-motion support. Consumers
  keep persistent placement, navigation, timers, and application state.
  Provide an icon-touch Button size and an explicit Lucide Trash2 export for the
  independent action without importing an icon library directly in the consumer.
- 52b4af2: Export Mira native select, dropdown menu and collapsible components for shared forms and disclosures.
- 52b4af2: Add the Base UI Mira Select primitive at `@fradelli/ui/select`, with Lucide icons, shared tokens, native form serialization, and keyboard interaction. Existing NativeSelect and Phosphor entry points remain compatible.
- 52b4af2: Adopt the official Base Mira Switch recipe and bottom-anchored mobile modal presentation. Preserve status indicator halo space.

  **Breaking in 0.x — Switch.** `Switch` now renders the Base UI switch (`<span role="switch">` with a hidden input) instead of a native `<button>`, and its props are `Switch.Root.Props` from `@base-ui/react/switch` plus `size` (`"sm" | "default"`).

  - `checked` is no longer required. Pass `checked` with `onCheckedChange(checked)` for a controlled switch, or `defaultChecked` for an uncontrolled one. Replace `onClick` toggling with `onCheckedChange`.
  - `type` is no longer accepted. The switch never submits a form; use `name` and `value` when the state must be posted with a form.
  - `aria-label` is no longer required by the type. Keep an accessible name through `aria-label`, `aria-labelledby` or an associated label.
  - Disabled state is exposed as `aria-disabled="true"` and `data-disabled`, not the native `disabled` attribute. Style with `data-disabled` and assert with `aria-disabled` in tests.
  - Checked state is exposed as `data-checked` / `data-unchecked` instead of `data-state="checked" | "unchecked"`.

- 52b4af2: Add Table and Progress from the official shadcn/ui Mira recipes (Base UI registry), exported from @fradelli/ui/table and @fradelli/ui/progress.
- 52b4af2: Export the Base Mira tooltip and share item typography and interaction states across dropdown and context menus.

## 0.6.0

### Minor Changes

- 2fdf58f: Expose every canonical icon from the pinned Phosphor 2.1.10 SSR catalog through individual public entry points such as `@fradelli/ui/icons/Trash`. Keep the aggregate icon entry point, `IconProps`, `BarbellIcon`, and `ForkKnifeIcon` compatible. Add a deterministic catalog generator, closed artifact validation, representative Storybook examples, and consumer fixtures. Applications should prefer individual imports to keep development module graphs small; no dynamic icon registry or React Context is shipped.

### Patch Changes

- 2fdf58f: Show a pointer cursor for enabled Button variants and composed links, retaining the disabled cursor and interaction guards. Make the primary hover background subtly translucent at 98% instead of darkening the entire control with a brightness filter. Text, icon, focus, and size/variant composition remain intact. Validate the actual cursor and background alpha in Storybook.

## 0.5.1

### Patch Changes

- c67509d: Translate package metadata and repository documentation into English, and standardize future project content in English.

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
