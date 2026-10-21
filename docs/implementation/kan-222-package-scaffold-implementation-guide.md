---
title: KAN-222 package scaffold implementation record
doc-type: implementation-guide
status: implemented
last-reviewed: 2026-10-21
owners:
  - frontend
  - design-system
related-issue: KAN-222
related-repository: fradelli/design-system
---

# KAN-222 — `@fradelli/ui` scaffold and package validation

## Delivery status

- **Status:** implemented, validated, and submitted for review in [PR #1](https://github.com/fradelli/design-system/pull/1).
- **Scope:** establish a minimal, installable, verifiable ESM package without implementing the visual foundation or components.
- **Issue:** `KAN-222 — [Design System] Scaffold and validate the @fradelli/ui package`.
- **Epic:** `KAN-219 — [Platform] Shared Design System`.
- **Repository:** [fradelli/design-system](https://github.com/fradelli/design-system).
- **Original recommended branch:** `codex/KAN-222-scaffold-fradelli-ui`.
- **Base:** `main`, after KAN-223 integration.
- **Plan and implementation:** approved and completed; `npm run ci` passed in the actual repository, including the lockfile, tarball allowlist, and consumer fixtures.
- **Evidence:** KAN-222, ADR 0001, governance policies, repository state, Sandicts and Kaizen manifests, npm registry, and official npm, TypeScript, GitHub Actions, GitHub Packages, and Changesets documentation.
- **Out of scope:** DTCG tokens, Inter at runtime, Tailwind, Storybook, primitives, publishing, secrets, app installation, and product domains.

## Outcome

The initial `@fradelli/ui@0.0.0` scaffold could be packed as one tarball containing ESM JavaScript, TypeScript declarations, and a valid empty CSS entry point. The same artifact was installed by fixtures representing npm and React 19.2.7 for Sandicts, and pnpm and React 19.2.8 for Kaizen.

The package was not published by this scaffold. A guard blocked `npm publish` until KAN-226.

## Technical decisions

The build uses `tsc` with `module` and `moduleResolution` set to `NodeNext`; no bundler was added. Future source-relative imports use the emitted `.js` extension so declarations do not depend on `moduleResolution: bundler`.

The root entry point exports nothing. Initial package exports were the empty ESM module, an empty but valid CSS cascade layer, and `package.json`. React and React DOM were peer dependencies in `>=19.2.7 <20`, with exact development versions. The package targeted GitHub Packages with restricted access, used `UNLICENSED`, and deliberately omitted `private: true` to allow a future release.

The validation gate creates one tarball and checks its exact allowlist, strict publint and type resolution, forbidden app aliases and domain references in `dist`, installation in npm and pnpm fixtures, resolution of JavaScript/CSS/declarations, satisfied peers, and one React/React DOM version.

The original toolchain snapshot used Node `24.20.0`, npm `11.19.0`, TypeScript `6.0.3`, and pinned development dependencies. Revalidate tool versions against the current package manifest before relying on historical values.

## Current maintenance

This guide records the original scaffold, not current package metadata. Follow the live `package.json`, lockfile, [repository instructions](../../AGENTS.md), and [release governance](../governance/versioning-and-releases.md) for present-day work. Never edit lockfiles or generated output manually.
