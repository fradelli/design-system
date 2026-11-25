# Release operations

This runbook applies [`versioning-and-releases.md`](versioning-and-releases.md) to `@fradelli/ui`. Releases are created exclusively by the `Release` workflow from `main` with Changesets.

## Prerequisites

Every PR that changes public API, styles, or behavior must classify its SemVer impact, include a Changeset created with `npm run changeset`, pass `npm run ci`, keep React and React DOM as peer dependencies, and exclude product domain code, credentials, and generated artifacts. Documentation or internal changes with no artifact impact may omit the Changeset when the PR records the reason.

## Automated flow

1. The implementation PR merges into `main`.
2. The `Release` workflow runs all gates again.
3. If Changesets are present, the workflow creates or updates one version PR on `changeset-release/main`. The `CI` workflow starts on it without manual approval when the release GitHub App is configured (see [CI on the version PR](#ci-on-the-version-pr)).
4. The version PR updates `package.json`, `package-lock.json`, and `CHANGELOG.md`, then removes consumed Changesets.
5. The owner reviews the version, changelog, and CI before merging the version PR.
6. Merging the version PR runs the workflow again.
7. With no pending Changesets, `changeset publish` publishes to GitHub Packages.
8. The workflow creates the corresponding tag and GitHub Release.

The implementation PR never runs `npm publish` directly. A published version is immutable and cannot be overwritten.

## CI on the version PR

GitHub does not start workflows for events made with `GITHUB_TOKEN`. For a pull request opened, synchronized, or reopened with `GITHUB_TOKEN`, it creates the `pull_request` runs in an approval-required state instead: the run ends as `action_required` with no jobs until someone with write access selects **Approve workflows to run**. This is GitHub behavior, not a repository setting; the fork contributor approval policy does not change it.

The `Release` workflow therefore creates the version PR with a GitHub App installation token:

- Repository variable `RELEASE_APP_CLIENT_ID` holds the App client ID.
- Repository secret `RELEASE_APP_PRIVATE_KEY` holds the App private key.
- The App is installed on `fradelli/design-system` only, with repository permissions **Contents: Read and write** and **Pull requests: Read and write**, and no webhook.
- The workflow asks `actions/create-github-app-token` for a token limited to `contents: write` and `pull-requests: write` and passes it to `changesets/action`. The version commit, the version PR, tags, and GitHub Releases are attributed to the App.
- Publishing to GitHub Packages still uses `GITHUB_TOKEN` with `packages: write`.

When `RELEASE_APP_CLIENT_ID` is not set, the token step is skipped and `changesets/action` falls back to `GITHUB_TOKEN`. The version PR is still created, but its CI run waits as `action_required`: open the PR and select **Approve workflows to run**, or use **Re-run all jobs** on the run.

To confirm the setup, run `gh run list --branch changeset-release/main` after the `Release` workflow updates the version PR: the newest `CI` run must start on attempt 1 without `action_required`.

## Version PR review

Before merging, confirm that the aggregate classification creates the expected version, the changelog describes every public change, only integrated Changesets were consumed, the lockfile matches the root package version, no unexpected source or configuration changes appear, and the `Validate package` check is green.

## Post-release verification

In an authenticated GitHub Packages session, replace `0.1.0` with the released version. Verify the package, tag, and GitHub Release refer to the same version using `npm view`, `gh release view`, and `git ls-remote --tags`.

## Package access after the first publish

The first publish creates the private package. In `fradelli` → **Packages** → `ui` → **Package settings**, confirm **Private**, disable **Inherit access from repository**, confirm `fradelli/design-system` has `Admin` under **Manage Actions access**, grant `Read` to `fradelli/reactjs-sandicts-web` and `fradelli/kaizen-app`, and do not grant consumers `Write` access. Access prepares consumer workflows; it does not install or update the package in apps.

## Authentication

The producer workflow publishes with the ephemeral `GITHUB_TOKEN` with `packages: write` and opens the version PR with a short-lived GitHub App installation token (see [CI on the version PR](#ci-on-the-version-pr)). The repository does not need a PAT or registry-specific secret. Local development that needs to read the package authenticates outside the project in the user's profile with a classic PAT limited to `read:packages`. Never commit or log a token, `_authToken`, `.env`, or authenticated `.npmrc`.

Consumer workflows use `GITHUB_TOKEN` with `packages: read` only after receiving explicit access. Authentication failure must stop installation; there is no fallback to copied source, a permanent tarball, or a floating version.

## Recovery and rollback

If the workflow fails before upload, fix the cause and use **Re-run failed jobs** on the same run. Do not create a tag or version manually. If a faulty version has already been published, do not delete or republish it: create a patch Changeset, publish a new version through the normal flow, and temporarily pin affected consumers to the exact last known good version. If only a consumer's access fails, fix **Manage Actions access**. Do not make the package public or add a PAT to a consumer repository.
