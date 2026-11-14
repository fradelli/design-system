# Select local validation

## Scope

The additive `@fradelli/ui/select` entry point follows the Base UI Select recipe
and Mira styles linked in the README. It uses the existing Base UI and Lucide
dependencies, shared semantic colors, and the package focus tokens. NativeSelect
and the existing Phosphor icon subpaths remain available.

The component is a fundamental primitive with a concrete consumer: the existing
choice fields in Kaizen. Routing, actions, data, and validation remain consumer
responsibilities. The Changeset declares a minor release; no version bump or
publication was performed.

## Verified locally

- Formatting, ESLint, and TypeScript passed.
- Unit suite: 55 tests across 19 files passed.
- Seven Select tests in jsdom cover initial and empty form values, disabled and
  conditional field omission, controlled selection, keyboard selection without
  form submission, Escape, and layered Dialog focus restoration.
- Package build, deterministic tokens, and the existing icon catalog check passed.
- Tarball allowlist, strict publint, and ESM/bundler type resolution passed,
  including the new Select entry point.
- The extracted tarball passed an SSR import and initial label/value serialization
  smoke check.
- Storybook production builds passed, including the final source in a fresh
  temporary output directory. Rebuilding the original output directory encountered
  an `EPERM` directory-creation error. Browser interaction execution was blocked
  before tests ran by `ERR_NETWORK_ACCESS_DENIED` at localhost.
- `git diff --check` passed.

## Remaining acceptance

The Storybook interaction stories are implemented but have not passed in a real
browser in this environment. Run Form, KeyboardAndEscape, and InsideDialog at
desktop and mobile widths, including touch, geometry, scroll containment, and
accessibility checks. jsdom results do not establish visual acceptance.

The npm/pnpm consumer fixtures include Select type and SSR checks. Fixture
installation was blocked in offline mode by an uncached Tailwind CLI dependency
(`ENOTCACHED`), so neither fixture installation is claimed as passing.

Kaizen was not modified: the current environment does not grant write access to
that repository, and its Git operation returned permission denied. Its package
and lockfile still reference `fradelli-ui-mira-forms.tgz` at version 0.6.0, without
the Select entry point. Docker Desktop's Linux daemon was unavailable. Application
startup, migrations, production build, coverage, consumer migration, typography
measurements, and desktop/mobile acceptance remain unverified.

The candidate artifact is `fradelli-ui-mira-select.tgz`, with package metadata
version 0.6.0. It is an unpublished local candidate, not an immutable released
0.6.0 replacement. SHA-256:

```text
6cf6b4ddf66170d55ef271a701e1bd2f1ab22e54b661a36efcfcc015c482a427
```

Install the candidate through the consumer's package manager in an environment
with access to both repositories, preserve its current changes, and complete the
application acceptance before release. No deployment, merge, or publication was
performed.
