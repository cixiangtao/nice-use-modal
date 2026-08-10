# Releasing nice-use-modal

English | [简体中文](RELEASING.zh-CN.md)

GitHub Actions is the only npm and GitHub Release publisher. Release Please automatically creates
or updates the release pull request; maintainers do not bump versions, create tags, or publish from
a workstation.

## Normal flow

1. Merge ordinary product changes into protected `master` through reviewed pull requests and
   required checks. Unrelated open pull requests may remain open.
2. Release Please updates one automated release PR from a
   `release-please--branches--master--...` branch. Its proposed SemVer version and `CHANGELOG.md`
   are derived from conventional commit or squash-merge titles (`fix` = patch, `feat` = minor,
   and `!` or `BREAKING CHANGE` = major).
3. Review the release-only diff, version, changelog, and required CI, then merge that PR when the
   accumulated changes are ready to publish.
4. `.github/workflows/release.yml` verifies that exact merged PR and its restricted diff, builds
   and packs once, creates `vX.Y.Z`, publishes the inspected artifact through npm trusted
   publishing, and creates the matching GitHub Release.
5. Verify the workflow, remote tag target, GitHub Release flags, npm version and dist-tags, and a
   fresh install of the public package.

Do not create or push release tags locally, run `npm publish`, or manually edit the automated
release PR branch. A regular PR merge never publishes.

## Automation credentials

The repository must define `RELEASE_APP_CLIENT_ID` as an Actions variable and
`RELEASE_APP_PRIVATE_KEY` as an Actions secret for a GitHub App installed on this repository with
Contents, Issues, and Pull requests read/write permissions. The App token lets required CI run
unattended; PR checks created with the default `GITHUB_TOKEN` currently wait for separate workflow
approval.

## Failure recovery

Before recovering a failed release, inspect the merged release PR, workflow jobs, remote tag,
GitHub Release, npm version, and dist-tags. Run `Release npm package` manually from `master` with
the merged Release Please PR number as `release_pr`. The workflow re-proves that PR, its restricted
diff, merge commit, version, branch ancestry, and any existing tag before resuming only missing
delivery steps. Never reuse an already published version or fall back to local publication.
