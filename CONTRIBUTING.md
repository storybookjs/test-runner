# Contributing to Storybook Test Runner

We welcome contributions to the test runner! This document outlines the process for contributing to this project.

## Development Workflow

1. Run `pnpm install` to install dependencies
2. Run `pnpm start` to both build the test-runner and run Storybook
3. Run `pnpm test-storybook` to run the test-runner
4. Run `pnpm test` to run tests

## Branch Structure

- **next** - the `next` version on npm, and the development branch where most work occurs
- **main** - the `latest` version on npm and the stable version that most users use

## Pull Request Guidelines

- All PRs should target the `next` branch, which depends on the `next` version of Storybook
- Include a clear description of the changes you've made
- If the change contains a bugfix that needs to be patched back to the stable version, please note that in the PR description
- Explicitly mention whether your change warrants a patch, minor or major release
- Update documentation if necessary
- Add tests for new functionality

## Release Process

1. All PRs should target the `next` branch, which depends on the `next` version of Storybook.
2. All user-facing PRs must include a changeset for `@storybook/test-runner` that uses a `patch`, `minor`, or `major` bump.
3. Every PR and push to `main` publishes a preview build via pkg.pr.new for validation.
4. When changesets land on `main`, the release workflow either opens a release PR or publishes the package to npm with provenance enabled.
5. If the change contains a bugfix that needs to be patched back to the stable version, that still has to be handled separately.

## Documentation

- Update README.md if your changes affect user-facing functionality
- Add JSDoc comments for new functions and classes
- Update TypeScript types as needed

## Issue Reporting

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Relevant code snippets or configuration

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Check existing issues and discussions
- Reach out to the maintainers

Thank you for contributing to the Storybook Test Runner!
