# NavigationItem admission

NavigationItem is a fundamental link primitive, not a composed bar or shell. It knows nothing about routes, providers, text, permissions, or activity types. Its current consumer is Kaizen's responsive navigation; the fundamental-primitive exception permits admission without assuming a second product.

The API uses native anchor props, `asChild` for composition, `className`, and `aria-current="page"` for the active state. The consumer supplies an accessible name when visible content is only an icon. Decorative icons use `aria-hidden`. A link has no artificial disabled state; omit unavailable destinations or represent them as text in the consumer.

The primitive provides visible focus, a 44px minimum target, contrast through existing tokens, and reduced motion. Active state does not rely on color alone: `aria-current` communicates the current destination. Phosphor is already a package dependency; BarbellIcon and ForkKnifeIcon are visual exports, not domain names.

SemVer: compatible minor. New subpaths do not change Button or other exports. Roll consumers back to their exact previous version. Release only through the `Release` workflow on `main`; do not publish locally or consume a copied `dist` directory.
