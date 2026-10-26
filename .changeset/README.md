# Changesets

Changes that affect the public API, styles, or behavior must include a Changeset and follow `docs/governance/versioning-and-releases.md`.

## Workflow

1. Create a Changeset in the implementation PR with `npm run changeset`.
2. Classify the change as patch, minor, or major according to the release policy.
3. After merge, the `Release` workflow creates or updates the version PR.
4. Review the generated version and changelog before merging that PR.
5. Merging the version PR publishes an immutable version to GitHub Packages.

Documentation and internal changes with no effect on the package may omit a Changeset when the PR explains why. Never edit an already published version or publish outside the `main` workflow.
