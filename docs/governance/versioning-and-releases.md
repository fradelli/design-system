# Versioning and releases

`@fradelli/ui` follows Semantic Versioning and uses Changesets to record the intent of each change.

## Initial `0.x` phase

`0.x` versions allow rapid evolution, but do not make breaking changes silent. Every incompatibility requires a Changeset, changelog, migration guide, and validation in affected consumers. Release `1.0.0` only when Sandicts and Kaizen consume the package, the public API has been reviewed, and the build, tests, packing, and installation of the actual artifact are stable.

## Classification

| Change | Release |
| --- | --- |
| Internal fix with no observable contract change | Patch |
| Compatible new component, export, token, or variant | Minor |
| Removed or renamed export, prop, or token | Major; documented breaking minor in `0.x` |
| Material change to the semantic value of a token | Major; documented breaking minor in `0.x` |
| Contrast, focus, or accessibility behavior fix | Patch if the API is preserved; otherwise classify by the break |
| New deprecation without removal | Minor |
| Documentation with no artifact effect | No release unless it corrects a published contract |

## Deprecation

Mark a public API as deprecated in its type and documentation, with an alternative and migration example. Remove it only in a later breaking release. Security exceptions require explicit communication and may shorten the transition period.

## Process

1. The PR declares public impact and SemVer classification.
2. CI validates tokens, lint, types, tests, Storybook, build, and package tarball.
3. The frontend/design-system owner approves public or breaking changes.
4. A release creates an immutable version and changelog; it never overwrites a version.
5. Each app opens its own upgrade PR and pins the version in its lockfile.

While there is a single maintainer, the named owner remains `frontend/design-system`; approval must still be recorded in the PR.

## Rollback

Consumers revert to the exact previous version. A faulty release gets a corrective patch; never overwrite or republish the same version number.

## Registry and credentials

The package starts private on GitHub Packages. Access tokens live only in the appropriate environments and never in `.npmrc`, documentation, fixtures, logs, or commits. Authentication failures must stop installation or publishing; there is no fallback to copied code or a floating version.
