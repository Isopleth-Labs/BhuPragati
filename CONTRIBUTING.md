# Contributing to BhuPragati

Thank you for your interest in contributing to Better Bharat Map! We welcome bug reports, feature requests, documentation improvements, and code contributions.

## Getting Started

### Prerequisites

* Git
* Bun
* Docker (recommended for development containers)

### Local Development

Clone the repository:

```bash
git clone <repository-url>
cd better-bharat-map
```

Install dependencies:

```bash
bun install
```

Start the development server:

```bash
bun --bun run dev
```

Build the project:

```bash
bun --bun run build
```

Run tests:

```bash
bun test
```

## Development Workflow

1. Create a new branch from `master`.

```bash
git checkout master
git pull
git checkout -b feat/your-feature-name
```

Examples:

```text
feat/add-state-search
fix/mobile-tooltip
docs/contributing-guide
```

2. Make your changes.

3. Test your changes locally.

4. Commit using clear commit messages.

```text
feat: add state search
fix: resolve tooltip overflow on mobile
docs: update contributing guide
```

5. Push your branch and open a Pull Request.

## Pull Requests

Before submitting a pull request:

* Ensure the project builds successfully.
* Run relevant tests.
* Update documentation when necessary.
* Keep pull requests focused on a single change.
* Link related issues when applicable.

## Reporting Issues

Please use the appropriate GitHub Issue Template:

* Bug Report
* Feature Request
* Documentation Improvement
* Question / Help

Provide as much detail as possible to help maintainers understand and reproduce the issue.

## Coding Guidelines

### General

* Write clear and maintainable code.
* Prefer descriptive names over abbreviations.
* Keep functions focused and small where practical.
* Remove unused code and imports.

### TypeScript

* Prefer explicit types when they improve readability.
* Avoid unnecessary `any` usage.
* Follow existing project patterns and conventions.

### React

* Keep components focused on a single responsibility.
* Extract reusable logic when appropriate.
* Avoid unnecessary re-renders.

## Documentation

Documentation improvements are always welcome.

If you change behavior, features, setup instructions, or workflows, update the relevant documentation.

## Code of Conduct

Be respectful and constructive when interacting with other contributors.

We aim to maintain a welcoming and collaborative environment for everyone.

## Questions

If you have questions, please open a Question / Help issue.
