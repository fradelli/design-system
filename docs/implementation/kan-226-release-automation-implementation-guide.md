---
title: KAN-226 release automation implementation record
doc-type: implementation-guide
status: implemented
last-reviewed: 2026-10-21
owners:
  - frontend
  - design-system
related-issue: KAN-226
related-repository: fradelli/design-system
---

# KAN-226 — Automate versioning and publishing for `@fradelli/ui`

## Delivery status

- **Status:** implementation completed locally and submitted in [PR #4](https://github.com/fradelli/design-system/pull/4). Organization and repository settings allow GitHub Actions to create automated version PRs.
- **Scope:** enable private, immutable, auditable releases of `@fradelli/ui` to GitHub Packages with Changesets and GitHub Actions.
- **Issue:** KAN-226. Confirm its exact Jira title when Atlassian access is available again.
- **Repository:** [fradelli/design-system](https://github.com/fradelli/design-system).
- **Original recommended branch:** `codex/KAN-226-automate-package-release`.
- **Base at implementation:** `main` at `1d695cb`, after KAN-221 and KAN-220 merged.
- **Plan readiness:** ready.
- **Evidence:** ADR 0001, release governance, current manifests and workflows, GitHub configuration, two pending Changesets, and Sandicts/Kaizen adoption plans.
- **Out of scope:** installing the package in consumers, changing components/tokens, publishing to npmjs.org, making the package public, creating a shared calendar, or storing a PAT in the project.

## Outcome

After a merge to `main`, the release workflow validates the package. With pending Changesets it creates or updates a version PR; after that PR merges and no Changesets remain, it publishes to GitHub Packages, then creates an immutable tag and GitHub Release. Sandicts and Kaizen choose when to install an exact version.

The first version PR was expected to combine two pending minor Changesets. Starting from `0.0.0`, the expected result was `@fradelli/ui@0.1.0`. Publishing occurs only after the version PR merges; the KAN-226 implementation PR does not call `npm publish` directly.

## Confirmed release configuration

| Item                | Implementation record                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Package registry    | `https://npm.pkg.github.com`; the package did not exist before the first publish                                                                             |
| Release calculation | Manifest started at `0.0.0`; two pending minor Changesets described foundations and primitives                                                               |
| Publish guard       | `verify-publish-context.mjs` permits only a push to `main` in `fradelli/design-system` with `NODE_AUTH_TOKEN` present, without reading or printing its value |
| Actions permissions | `contents: write`, `pull-requests: write`, and `packages: write` are confined to the release workflow; default repository permissions remain read-only       |
| Authentication      | Ephemeral `GITHUB_TOKEN`; no `NPM_TOKEN`, PAT, `.env`, or committed `_authToken`                                                                             |
| Release action      | `changesets/action` v2.1.2 pinned to SHA `ae32849d5ba541f9ae29e40e22a623bc13562f51`                                                                          |
| Pre-publish gate    | Release workflow runs `npm run ci` itself because normal CI and release run in parallel after merge                                                          |
| Consumer access     | Package remains private; grant consumer workflows read access only after package creation                                                                    |

The existing `.npmrc` contains only the public scope mapping. No `id-token: write` is required: npmjs.org provenance and trusted publishing are outside GitHub Packages releases.

## Release and recovery policy

Use the `Release` workflow and Changesets for all releases. Never delete or overwrite a published version. If a workflow fails before upload, fix the cause and rerun the failed job. If a published version is faulty, issue a corrective patch and pin affected consumers to the exact last known good version while they upgrade.

The implementation plan's initial validation covered publishing guard scenarios, release configuration, action pinning, restricted registry metadata, and full package CI. The detailed operational steps live in [release operations](../governance/releasing.md); SemVer classification lives in [versioning and releases](../governance/versioning-and-releases.md).

## Current maintenance

This is a historical implementation record; follow the live workflow, package manifest, and governance documents for current behavior. Consumer installation, migration, and visual validation are separate work in each application. Do not add publishing credentials to this repository or publish locally.
