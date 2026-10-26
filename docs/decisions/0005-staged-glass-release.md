# ADR 0005 — Staged release of the glass visual language

- **Status:** Accepted by the maintainer
- **Date:** 2026-10-19
- **Issue:** KAN-226
- **Decision:** Supersedes only ADR 0003's requirement to validate all three applications before first publication; preserves the contracts in ADRs 0001, 0003, and 0004.

## Context and authorization

The package and catalog were validated. The portfolio was migrated to the candidate and reviewed by the maintainer. Kaizen and Sandicts are outside this delivery.

On 2026-10-19, the maintainer explicitly authorized publishing version 0.5.0 after validating the package and portfolio, leaving Kaizen and Sandicts migration and validation for future work. This decision is also recorded in version PR #14.

## Decision

Release the breaking minor version 0.5.0 with package validation and portfolio evidence. Applications pin independent versions: publishing the package does not update Kaizen or Sandicts. Those consumers need their own migrations, validation, and authorization before installing the new version.

This decision does not claim that screens, contrast, performance, or compatibility in those two products have been approved. The exception applies only to the first publication of this change and does not waive the package's technical checks.

## Evidence and limits

- `npm run ci` passed for package version 0.5.0: 43 unit tests, 49 Chromium stories, tokens, build, tarball, npm/pnpm fixtures with one React instance, and a root dependency audit with no findings.
- PR CI passed after aligning the manifest and lockfile at 0.5.0: run 39306694188.
- The portfolio's local gate passed with 19 tests and a production build. Cards were checked at 320px in both languages and at 375, 640, and 768px in English, without internal overflow; links and skill organization were tested by keyboard.
- Real 200% zoom, the transparency preference matrix, and a valid form submission simulation remain limitations of the consumer review. No email was sent.
- The Tailwind tool fixture reports four preexisting high-severity findings described in the package evidence; this does not change the root dependency audit result.

## Operation and rollback

Publish only through the `Release` workflow and Changesets. The portfolio will install the exact published version and repeat a clean install and CI before promotion.

Roll back consumers by reverting code, CSS, manifest, and lockfile together. A package fix requires a new immutable version; never overwrite or delete a published version.
