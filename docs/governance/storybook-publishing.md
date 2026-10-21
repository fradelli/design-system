# Storybook publishing

## Scope

The public catalog is hosted at `https://fradelli.github.io/design-system/` through GitHub Pages, with GitHub Actions as its source. The catalog follows `main` and may show changes that are not yet in a package release. Package publication remains exclusive to the `Release` workflow; this flow never runs `npm publish`.

## Workflow

1. Pull requests run `Validate package`; they do not upload or deploy Pages.
2. A push to `main` or a manual run on that branch installs dependencies and runs `npm run ci`.
3. After validation passes, the job uploads `storybook-static` as a `github-pages` artifact with seven-day retention.
4. The `Publish Storybook` job depends on validation, uses the `github-pages` environment, and deploys that exact artifact.
5. The deploy action records the effective URL in the environment output.

Runs on `main` are serialized by the CI concurrency group; an in-progress deployment is not cancelled to start another. Pull requests continue to cancel previous runs on the same ref. No pull-request run receives publishing permissions.

## Repository configuration

- Pages uses GitHub Actions as its source and has no custom domain initially.
- The `github-pages` environment permits only `main` through a custom branch policy.
- The workflow uses the default `contents: read`; `pages: write` and `id-token: write` are granted only to the deploy job.
- Official `configure-pages` v6.0.0, `upload-pages-artifact` v5.0.0, and `deploy-pages` v5.0.1 actions are pinned by SHA. Hosting requires no PAT or new secret.
- The build uses relative paths for manager, iframe, and assets. Do not force a global base path that changes development or tests. Review this configuration if an absolute path is introduced. `storybook-static` remains ignored and is never committed.

## Verification

Confirm the `Validate package` check and `Publish Storybook` job passed for the deployed commit. Open the site and direct story links under `/design-system/?path=...`, including after reload. Check Foundations, Card, PendingButton, Alert, Sheet, Popover, and Patterns/Form, including keyboard interaction. Verify manager, iframe, CSS, JavaScript, and icon paths, and inspect the mobile preview. Demonstration stories must not perform real email, account, or product operations. Record the SHA, run, and URL in the delivery record; never record tokens or authentication data.

## Manual runs and recovery

To republish the current version, run the CI workflow manually with ref `main`. It repeats the full gate before deployment. A dispatch on another branch does not publish.

A validation or build failure prevents upload and deployment, preserving the last published site. To restore an earlier version, prefer a revert PR to `main`, with CI and a new deployment. Do not force-push or disable checks. Republishing an exact earlier artifact requires review of the run and artifact retention, and must use a GitHub-supported procedure with the required authorization; the standard manual run deploys current `main`.

## Versioning and limits

This flow and its documentation do not change the library API, styles, or behavior and need no Changeset. Component and token changes still require their own classification. The public site does not grant access to the private package or update applications.

The catalog uses the available font environment; consumers provide Inter or the configured fallback is used. Screen-reader and real-consumer review remain part of Design System adoption.

## Initial configuration validation

The local gate passed with 43 unit tests and 49 Chromium stories, plus token checks, build, tarball, npm/pnpm fixtures, and a root repository audit with no findings. The CSS fixture retains the preexisting alerts recorded in the history. YAML structure and permissions were checked; configuration tests verify validation dependency and the absence of deploy permissions in pull-request jobs.

The static build was served at `/design-system/` and inspected in a browser: Card and PendingButton loaded, the loading interaction worked, and a direct story link retained its selection after reload. Pages uses a workflow, HTTPS, and a `main`-only environment. Confirm the first public deployment from the `main` run.
