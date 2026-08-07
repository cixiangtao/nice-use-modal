# Releasing nice-use-modal

Releases are maintainer-only. release-it prepares a constrained release pull
request; GitHub Actions is the only npm publisher.

## Release contract

- `package.json` owns the version and follows Semantic Versioning.
- Product changes first enter protected `master` through ordinary pull requests.
- Release preparation runs on an exact `release/vX.Y.Z` branch with a clean
  worktree and configured upstream.
- `pnpm release:check` is the required quality, build, package, and consumer gate.
- Conventional commits feed `CHANGELOG.md`; the maintainer chooses the version.
- release-it updates only `package.json`, `pnpm-lock.yaml`, and `CHANGELOG.md`,
  then creates `chore(release): vX.Y.Z` locally without tagging, pushing, or
  publishing.
- After that exact release PR merges, `.github/workflows/release.yml` revalidates
  its ancestry and diff, creates `vX.Y.Z` at the merge commit, and publishes the
  inspected package artifact to npm through trusted publishing.
- npm, Git tags, and `CHANGELOG.md` are the canonical release surfaces. GitHub
  Releases and downloadable binary assets are not part of this package's contract.
- A manually pushed tag or a non-release PR cannot start publication.

## Prepare

1. Confirm `master` is synchronized with `origin/master` and contains every
   ordinary PR intended for the version. Other open PRs may remain open.
2. Create `release/vX.Y.Z` from that exact `master` head.
3. Confirm the worktree and index are clean.
4. Run the full gate:

   ```bash
   pnpm release:check
   ```

5. Preview release-it without changing local or remote state:

   ```bash
   pnpm release:dry
   ```

6. Prepare the release commit on the release branch:

Run:

```bash
pnpm release <patch|minor|major>
```

7. Push the release branch and open a PR into `master`. The PR must contain only
   `package.json`, `pnpm-lock.yaml`, and `CHANGELOG.md`.

## Publish

Merge the checked release PR. GitHub Actions owns the tag and npm publication;
there is no local publish command. The Action uses `latest` for stable versions
and the prerelease identifier, such as `beta`, for prereleases.

## Verify

After the Action completes, independently verify:

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
- the merged release PR and its merge commit;
- the release workflow jobs and uploaded package artifact;
- whether the tag or npm publication completed before the failure.

Retry through the same merged-PR workflow after inspecting partial state. Never
fall back to a local `npm publish`. Keep authentication URLs out of logs and
issue reports.
