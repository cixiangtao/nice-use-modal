# Releasing nice-use-modal

Releases are maintainer-only and use release-it as an interactive npm publisher.

## Release contract

- `package.json` owns the version and follows Semantic Versioning.
- Releases start from `master` with a clean worktree and configured upstream.
- `pnpm release:check` is the required quality, build, package, and consumer gate.
- Conventional commits feed `CHANGELOG.md`; the maintainer chooses the version.
- release-it creates `chore(release): vX.Y.Z`, the annotated `vX.Y.Z` tag, pushes
  the commit and tag, and publishes the package to npm.
- npm, Git tags, and `CHANGELOG.md` are the canonical release surfaces. GitHub
  Releases and downloadable binary assets are not part of this package's contract.
- npm authentication and any one-time password remain outside the repository.

## Prepare

1. Confirm `master` is synchronized with `origin/master`.
2. Confirm the worktree and index are clean.
3. Review unreleased commits and choose a SemVer increment.
4. Run the full gate:

   ```bash
   pnpm release:check
   ```

5. Preview release-it without changing local or remote state:

   ```bash
   pnpm release:dry
   ```

## Publish

Run:

```bash
pnpm release
```

Confirm the selected version and release plan. Do not bypass the clean-worktree,
branch, npm, or quality checks.

For a prerelease, provide both a prerelease identifier and an explicit npm
dist-tag such as `beta`. Never let a prerelease move `latest` accidentally.

## Verify

After release-it completes, independently verify:

```bash
git ls-remote --heads --tags origin
npm view nice-use-modal version dist-tags --json
```

Download the public npm artifact and repeat the package/consumer checks before
calling the version released.

## Recover from failure

Do not retry blindly. Inspect:

- `package.json`, `CHANGELOG.md`, the index, and the worktree;
- local and remote `vX.Y.Z` tags;
- the npm version and dist-tags;
- whether a release commit or push completed before the failure.

If npm authentication or network access fails, confirm whether release-it rolled
back the version and tag. Keep secrets and browser-authentication URLs out of logs
and issue reports.
