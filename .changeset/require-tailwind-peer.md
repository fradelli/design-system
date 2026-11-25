---
"@fradelli/ui": minor
---

Make `tailwindcss` (`>=4.3.0 <5`) a required peer dependency. The package CSS uses Tailwind theme variables and the components ship Tailwind class names that the consumer build compiles, so the package cannot be styled without Tailwind CSS 4. Package managers now report a missing peer when Tailwind CSS is not installed; consumers that already install `tailwindcss` need no change.
