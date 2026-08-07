# Contributing to nice-use-modal

Thanks for taking the time to improve nice-use-modal.

## Before you start

- Use Node.js 24.11 or newer.
- Use pnpm 10.34.5, as declared by `packageManager`.
- Search the existing issues before opening a new bug report or feature request.
- Use GitHub private vulnerability reporting for security issues instead of a public issue.

## Set up the project

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The demo runs locally at `http://localhost:3000`.

## Validate a change

Run the complete repository gate before opening a pull request:

```bash
pnpm release:check
```

This runs static checks, unit and type-contract tests, the package and demo builds,
real npm package inspection, and fresh React 18 and React 19 consumer smoke tests.

For faster iteration, use the narrower commands:

```bash
pnpm check
pnpm test
pnpm build
pnpm build:demo
pnpm verify:package
```

## Commit and pull request guidance

- Keep each commit focused on one durable intent.
- Use Conventional Commits, such as `feat(modal): add ...` or `fix(types): correct ...`.
- Add or update tests when behavior or public types change.
- Update `.github/README.md` and `CHANGELOG.md` when a public contract changes.
- Do not commit `dist`, `demo-dist`, package archives, credentials, or local configuration.

Pull requests should explain the user-visible effect, testing performed, and any
compatibility or migration impact.

Release operations are maintainer-only. See [RELEASING.md](RELEASING.md) for the
release contract.
