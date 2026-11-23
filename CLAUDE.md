# Design system rules

Rules for working in `fradelli/design-system`, which publishes `@fradelli/ui`. Shared rules live in the playbook; this file holds only what is specific to this package.

## Playbook

The roadmap and the shared standards live in [`fradelli/playbook`](https://github.com/fradelli/playbook). Tasks of this repository use the `DS-` prefix.

- Read the playbook [`CLAUDE.md`](https://github.com/fradelli/playbook/blob/main/CLAUDE.md), then [`projects/design-system/ACTIVE.md`](https://github.com/fradelli/playbook/blob/main/projects/design-system/ACTIVE.md), then only the selected task and its Inputs.
- Follow the standards the task cites, at least [writing](https://github.com/fradelli/playbook/blob/main/standards/general/writing.md), [pull requests](https://github.com/fradelli/playbook/blob/main/standards/general/pull-requests.md), and [dependency security remediation](https://github.com/fradelli/playbook/blob/main/standards/general/dependency-security-remediation.md).
- Update the task status and `ACTIVE.md` in the playbook when starting and finishing a task.

## Required context

- Read `docs/decisions/0001-shared-design-system-foundation.md` and the ADRs that supersede it before changing architecture, public APIs, tokens, or ownership.
- Read the relevant document in `docs/governance/` before admitting a component or classifying a release.
- Supersede an accepted decision with a new ADR; never rewrite an accepted ADR.

## Boundaries

- Share only identity, tokens, primitives, and domain-agnostic visual patterns.
- Do not add reservations, courts, workouts, diet, habits, tasks, pages, routes, authentication, APIs, i18n, providers, logos, or product artwork.
- Do not add a Next.js dependency. Keep React and React DOM as peer dependencies.
- Do not create product flags such as `product`, `sunaVariant`, or `kaizenVariant`.
- Do not add a dependency, abstraction, or component without a consumer and a verifiable justification.

## Security

- Treat every file as public: this repository is public.
- Never commit tokens, credentials, `.env` files, authenticated `.npmrc` files, personal paths, or user data.

## Source and generated files

- Keep relative imports compatible with NodeNext, with the `.js` extension for emitted modules.
- Change tokens in `tokens/*.json` and run `npm run tokens:build`; never edit `src/styles/tokens.generated.css`.
- Never edit or commit `dist/`, `.tmp/`, `storybook-static/`, tarballs, or fixture lockfiles.

## Validation

- Run `npm run ci` before opening a pull request that changes code, styles, tokens, or package metadata.
- For documentation-only changes, run at least `npm run format:check` and `git diff --check`.

## Releases

- Declare the SemVer impact of every public change and add a Changeset with `npm run changeset`. A documentation-only pull request states why it has none.
- Publish only through the `Release` workflow from `main`. The maintainer merges the version pull request.
- Never run `npm publish` locally or add a PAT, `_authToken`, `.env`, or authenticated `.npmrc` to the repository.
- Never change a published version: publish a corrective version, or roll consumers back to the exact previous version.
