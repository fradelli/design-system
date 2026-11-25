# Fradelli Design System

The shared source of visual identity and primitives used by Sandicts, Kaizen, and future products in the Fradelli ecosystem.

## Current status

This repository contains the architectural contract, governance rules, and the `@fradelli/ui` package. Its dark-first visual foundation includes color, typography, spacing, radius, focus, and motion tokens, along with shared primitives. The package is distributed privately through GitHub Packages. Releases use an automated Changesets workflow.

The KAN-222 scaffold produces an ESM tarball with TypeScript declarations and an explicit CSS entry point. Release automation validates the package, creates a version PR, and publishes only after that PR merges.

## Development

Use Node.js `24.20.0` and npm `11.19.0`:

```bash
npm ci
npm run ci
```

The gates cover formatting, lint, types, tests, build, tarball inspection, compatibility with npm and pnpm consumers, and dependency auditing. To validate only the installable artifact, run `npm run pack:check`.

Public changes must include their release intent:

```bash
npm run changeset
```

### Tokens and Storybook

Files in `tokens/*.json` are the editable source. Generated CSS is versioned for review, but must not be edited manually:

```bash
npm run tokens:build
npm run tokens:check
npm run storybook
```

Consumers need Tailwind CSS 4 (`tailwindcss` is a required peer dependency): the package ships Tailwind theme variables and class names, and the consumer build compiles them. Import the framework and the package CSS once, and declare the installed package source. The path may vary depending on the app's stylesheet:

```css
@import "tailwindcss";
@import "@fradelli/ui/styles.css";
@source "../node_modules/@fradelli/ui/dist";
```

Load IBM Plex Sans and Figtree at the application root and expose `--font-ibm-plex-sans` and `--font-figtree`. Existing applications may keep `--font-inter` as a fallback. The package uses system fallbacks and does not distribute font files.

See the [Mira component decision](docs/decisions/0006-mira-component-recipes.md) and the [shared style guide](docs/governance/shared-ui-style.md). Dialog and Checkbox are available from `@fradelli/ui/dialog` and `@fradelli/ui/checkbox`.

### Components

#### Persistent activity surfaces

Use the Mira `Item` primitive from `@fradelli/ui/item` for compact content with
independent actions. Its additive `variant="elevated"` provides the shared
surface, border, and shadow. Use `StatusIndicator` from
`@fradelli/ui/status-indicator` for a semantic dot; `pulse` is opt-in and stops
under reduced motion. Supply an accessible label or leave the dot decorative
beside equivalent text. Consumers own fixed placement, safe-area/navigation
offsets, timing, labels, and routes. The independent action can use Button
`size="icon-touch"` and `Trash2` from `@fradelli/ui/lucide-icons`. See
[source and validation](docs/governance/persistent-status-validation.md).

#### Select

The Mira Select primitive is available from `@fradelli/ui/select`. It is additive;
`@fradelli/ui/native-select` remains available. Use Select for a field value and
DropdownMenu for commands.

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fradelli/ui/select";

<Select name="intensity" defaultValue="low" items={{ low: "Low", high: "High" }}>
  <SelectTrigger aria-label="Intensity">
    <SelectValue placeholder="Choose intensity" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem value="low">Low</SelectItem>
      <SelectItem value="high">High</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>;
```

Supply `items` so an initial or controlled value displays its label before the
popup mounts. For controlled fields, use `value` and `onValueChange`, whose empty
value is `null`. Set `name`, `disabled`, and `required` on Select itself.
An unselected named field serializes as an empty string; a disabled field is
omitted from FormData. Supply the visible label or an accessible name on the
trigger and connect application errors with `aria-invalid` and
`aria-describedby`.

SelectContent uses the Base UI portal and positioning behavior, including within
Dialog. Use `alignItemWithTrigger={false}` to position below the trigger rather
than align the selected item over it. Escape closes the Select before its parent
Dialog. The application owns validation, pending submission, and persistence.

Recipe sources: [Base UI Select](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/select.tsx)
and [Mira styles](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/styles/style-mira.css).
Imports, semantic colors, focus tokens, and icons are adapted to this package;
geometry and recipe states are preserved. Select supports Base UI state callbacks
in `className`.

Components and the `cn` helper are exposed only through explicit subpaths:

```tsx
import { Button } from "@fradelli/ui/button";
import { Field, FieldDescription, FieldLabel } from "@fradelli/ui/field";
import { Input } from "@fradelli/ui/input";
import { Popover } from "@fradelli/ui/popover";
import { RadioGroup } from "@fradelli/ui/radio-group";
import { cn } from "@fradelli/ui/cn";
```

Available subpaths are `alert`, `alert-dialog`, `badge`, `button`, `card`, `checkbox`, `cn`, `dialog`, `field`, `icons`, `input`, `label`, `loading-region`, `navigation-item`, `pending-button`, `popover`, `radio-group`, `separator`, `sheet`, `skeleton`, `status-badge`, and `switch`. The root entry point intentionally stays empty to keep client and server boundaries separate.

`NavigationItem` provides a link with a minimum touch target, visible focus, and native active state through `aria-current`. It does not determine routes, positioning, breakpoints, or copy. The app composes its own navigation and preserves its URL parameters.

```tsx
import { NavigationItem } from "@fradelli/ui/navigation-item";
import { BarbellIcon } from "@fradelli/ui/icons/Barbell";

<NavigationItem href="/example" aria-label="Example" aria-current="page">
  <BarbellIcon aria-hidden="true" />
</NavigationItem>;
```

With consumer routers, use `asChild` to provide a single link without nested anchors.

### Icons

All 1,512 canonical drawings from the pinned Phosphor 2.1.10 SSR catalog are available
through individual public entry points, with the same SVG props, size, weight, mirrored,
alt, and ref support in Server Components and Client Components:

```tsx
import { CheckCircleIcon } from "@fradelli/ui/icons/CheckCircle";
import { StopIcon } from "@fradelli/ui/icons/Stop";
import { TrashIcon } from "@fradelli/ui/icons/Trash";
```

Prefer individual imports to avoid processing the aggregate catalog during development.
`@fradelli/ui/icons` remains compatible, including `IconProps`, `BarbellIcon`, and
`ForkKnifeIcon`, and also exposes the other named drawings. No context provider, dynamic
name registry, or direct application dependency on Phosphor is required. Hide decorative
icons with `aria-hidden` and `focusable="false"`; accessible names belong to controls.
See [the icon catalog contract](docs/governance/iconography.md) for generation and releases.

Enabled Button variants and composed links use a pointer cursor. Primary hover changes
only the background to 98% opacity, retaining the text and icon opacity and visible focus.

Consumers associate labels, descriptions, and errors using HTML attributes:

```tsx
<Field data-invalid="true">
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" aria-describedby="email-help email-error" aria-invalid="true" />
  <FieldDescription id="email-help">Used for account access.</FieldDescription>
  <FieldError id="email-error">Email is required.</FieldError>
</Field>
```

Close controls never ship built-in copy. Supply each label from the application's i18n system:

- `SheetContent` requires `closeLabel`.
- `DialogContent` requires `closeLabel` unless `showCloseButton={false}`.
- `DialogFooter` requires `closeLabel` when `showCloseButton` is set.
- `Toaster` requires `closeLabel`, and `ToastClose` requires `aria-label`.

```tsx
<SheetContent closeLabel={messages.closePanel}>...</SheetContent>
<DialogContent closeLabel={messages.closeDialog}>...</DialogContent>
<Toaster closeLabel={messages.dismissNotification} />
```

### Glass visual language

Card uses glass by default and offers `surface="solid"`. Read [ADR 0003](docs/decisions/0003-shared-glass-visual-language.md), [ADR 0004](docs/decisions/0004-consistent-component-composition.md), and the [migration guide](docs/governance/glass-migration.md) before upgrading. The staged release and consumer-validation requirements are recorded in [ADR 0005](docs/decisions/0005-staged-glass-release.md).

### Consumers

- [Sandicts](https://github.com/fradelli/reactjs-sandicts-web): scheduling and sports management.
- [Kaizen](https://github.com/fradelli/kaizen-app): personal organization, healthy routines, diet, and tasks.

Each application owns its pages, features, business rules, integrations, brand, and release cycle. The Design System shares only identity, tokens, primitives, and domain-agnostic visual patterns.

## Releases

Releases follow Semantic Versioning and are created exclusively by the `Release` workflow. A merge with Changesets creates or updates a version PR; merging that PR publishes to GitHub Packages and creates the tag and GitHub Release.

Credentials are never committed. The producer uses an ephemeral `GITHUB_TOKEN`, and each consumer receives read-only package access. See the [release runbook](docs/governance/releasing.md) for review, authentication, verification, and rollback.

## Normative sources

- [ADR 0002 — Accessible native primitives without a headless dependency](docs/decisions/0002-native-accessible-primitives.md)
- [ADR 0001 — Shared Design System foundation](docs/decisions/0001-shared-design-system-foundation.md) (historical; its primitive technical direction was superseded by ADR 0002)
- [Component admission](docs/governance/component-admission.md)
- [Versioning and releases](docs/governance/versioning-and-releases.md)
- [Release operations](docs/governance/releasing.md)

ADR 0002 governs primitive implementation. ADR 0001 remains normative for its other boundaries and ownership decisions. Consumer application documents should link to these ADRs instead of keeping independent copies of the decisions.

## Boundaries

The Design System owns tokens, typography, radius, focus, motion, generic visual states, accessible primitives, and patterns proven to be shared.

The Design System does not own complete calendars, reservations, courts, workouts, diet, habits, tasks, routes, authentication, APIs, i18n, providers, shells, pages, logos, or product-specific artwork.

## License

This public repository does not currently have a `LICENSE` file. Source visibility must not be interpreted as an automatic grant of reuse rights. Decide the license policy before any potential public package distribution.

## Catalog and composition

Storybook is organized into Foundations (tokens and materials), Components (one folder per family), and Patterns (integrations). Glass and solid are surfaces of the same Card and share geometry. Padding belongs to the root: 24px by default and 16px at `sm`; slots do not duplicate that inset.

See [ADR 0003](docs/decisions/0003-shared-glass-visual-language.md), [ADR 0004](docs/decisions/0004-consistent-component-composition.md), and the [migration guide](docs/governance/glass-migration.md) before upgrading consumers.

To expand local browser validation, set `DS_BROWSERS=chromium,firefox,webkit` and `DS_VIEWPORT_WIDTH=320` in the environment for `npm run test:storybook`. Install the corresponding official browsers through Playwright. The default gate uses Chromium at 1280px.

## Public Storybook

The catalog is published to [GitHub Pages](https://fradelli.github.io/design-system/) by the CI workflow after validating `main`. Pull requests do not publish the site. Stories are interactive and use demonstration content without real product operations.

The catalog follows `main` and may include changes that have not been published in a package version. Hosting Storybook does not change package access on GitHub Packages or update consumers.

See the [publishing guide](docs/governance/storybook-publishing.md) for configuration, verification, and recovery.
