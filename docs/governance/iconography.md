# Icon catalog

The package exposes every canonical drawing in its exactly pinned Phosphor dependency.
The catalog is a public, domain independent API. It does not include Phosphor contexts,
rendering helpers, deprecated aliases, or product-specific names.

Prefer individual imports, especially in Next.js:

```tsx
import { TrashIcon } from "@fradelli/ui/icons/Trash";

<button type="button" aria-label="Delete item">
  <TrashIcon weight="regular" size={20} aria-hidden="true" focusable="false" />
</button>;
```

The existing `@fradelli/ui/icons` aggregate remains compatible and also exposes the
canonical named components. The package root stays empty. Individual modules use SSR
implementations and work in Server Components and Client Components without a provider.
`IconProps` retains the original SVG props, size, six weights, mirrored, alt, and ref.

The application owns accessible labels, icon selection, touch target size, and domain
meaning. Decorative icons are hidden from assistive technology and inherit currentColor.
Do not add a runtime `icons[name]` registry or import a namespace for dynamic lookup.

## Generation and release

`src/icons/catalog.json` records the installed dependency version and every admitted
canonical module. `npm run icons:generate` creates the named aggregate and individual
wrappers; `npm run icons:check` verifies exact content and rejects unexpected files.
Generation uses only installed modules and verifies their actual canonical SSR exports.
Review additions and removals explicitly when upgrading Phosphor.

The tarball allowlist derives only the expected pairs of JS/declaration files from that
manifest. Every wildcard export is expanded against the reviewed manifest, never against
an unrestricted directory glob. Generated source is versioned; dist and fixture output
are build artifacts. The package keeps React as a peer and has no Next.js dependency.

SemVer: adding this complete catalog is a compatible minor. Removing a drawing or
changing its props requires an explicit breaking-change review. New upstream drawings
require a dependency upgrade and release; using an already published drawing does not.
Publish only through the Release workflow on main. Consumers install an exact published
version and roll back their pin/lockfile together if necessary.
