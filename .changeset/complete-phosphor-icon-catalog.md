---
"@fradelli/ui": minor
---

Expose every canonical icon from the pinned Phosphor 2.1.10 SSR catalog through individual public entry points such as `@fradelli/ui/icons/Trash`. Keep the aggregate icon entry point, `IconProps`, `BarbellIcon`, and `ForkKnifeIcon` compatible. Add a deterministic catalog generator, closed artifact validation, representative Storybook examples, and consumer fixtures. Applications should prefer individual imports to keep development module graphs small; no dynamic icon registry or React Context is shipped.
