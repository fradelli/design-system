# Repository instructions

## Required context

- Read `docs/decisions/0001-shared-design-system-foundation.md` before changing architecture, public APIs, tokens, or ownership.
- Read the relevant document in `docs/governance/` before admitting a component or classifying a release.
- Write all project-maintained content in American English (`en-US`). Keep public API names in English as well.
- Write branch slugs, commit messages, PR titles, and PR descriptions in English. Include the Jira key when one is available; do not invent one.

## Boundaries

- This repository shares identity, tokens, primitives, and domain agnostic visual patterns.
- Do not add reservations, courts, workouts, diet, habits, tasks, pages, routes, authentication, APIs, i18n, providers, logos, or product artwork.
- Do not add a Next.js dependency. React and React DOM must remain peer dependencies.
- Do not create product flags such as `product`, `sandictsVariant`, or `kaizenVariant`.
- Do not add a dependency, abstraction, or component without a consumer and verifiable justification.

## Security and publishing

- Never commit tokens, credentials, `.env`, authenticated `.npmrc` files, personal paths, or user data.
- This repository is public. Review new files as if they were visible to anyone.
- Published versions are immutable; issue a corrective patch or roll consumers back.

## Delivery

- Link branches, commits, and PRs to the corresponding Jira issue when applicable. Use `codex/KAN-123-description` when an issue key is available.
- Classify public changes according to SemVer and include a Changeset when the automation is available.
- Run formatting, lint, type, test, build, and tarball checks as appropriate. The full gate is `npm run ci`; for documentation-only changes, run at least `npm run format:check` and `git diff --check`.
- Do not edit `dist/`, `.tmp/`, tarballs, or fixture lockfiles manually. These are generated artifacts and must not be committed.
- Keep source relative imports compatible with NodeNext, including the `.js` extension for emitted relative modules.
- Never edit `src/styles/tokens.generated.css` manually. Change the DTCG files in `tokens/` and run `npm run tokens:build`.
- Releases are made exclusively by the `Release` workflow from `main`, using Changesets.
- Never run `npm publish` locally or add a PAT, `_authToken`, `.env`, or authenticated `.npmrc` to the repository.
- Every public change must declare its SemVer impact and include a Changeset, unless the PR explicitly justifies a documentation-only change.
- Published versions are immutable; issue a new version to fix them and roll consumers back to the exact previous version when needed.
- A new ADR supersedes an accepted decision; do not silently rewrite architectural history.
