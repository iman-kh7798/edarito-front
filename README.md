# Frontend Boilerplate

A modern React boilerplate with TypeScript and JavaScript source options, Feature-Sliced Design structure, authentication scaffolding, React Query, Axios, Tailwind CSS, GitLab CI, Husky, Commitlint, and Docker support.

## Stack

- React 19
- Vite
- TypeScript-first source in `src/`
- JavaScript source option in `src-js/`
- React Router
- TanStack Query
- Axios
- Zod
- Tailwind CSS
- ESLint, Steiger, Prettier, Husky, lint-staged, Commitlint
- Vitest, Testing Library, Playwright
- GitLab CI with Semgrep, Trivy, npm audit, and optional SonarQube analysis
- Docker and Docker Compose

## Getting Started

### Requirements

- Node.js 24 LTS
- npm
- Docker, optional for containerized development

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

### Validate

```bash
npm run validate
```

`validate` runs ESLint, the FSD architecture check, formatting, unit/integration tests, and the production build.

## Source Options

The TypeScript source is the default and recommended source:

```text
src/
```

The JavaScript source lives here:

```text
src-js/
```

To run the JavaScript source, update:

```html
<!-- index.html -->
<script type="module" src="/src-js/main.jsx"></script>
```

```ts
// vite.config.ts
resolve: { alias: { "@": path.resolve(__dirname, "src-js") } },
```

Detailed source docs:

- [TypeScript source](./src/README.md)
- [JavaScript source](./src-js/README.md)

## Project Structure

```text
src/ or src-js/
├── app/        # App composition: providers, router, layouts
├── pages/      # Route-level screens
├── widgets/    # Reusable page sections and layout widgets
├── features/   # User actions and workflows
├── entities/   # Business entities and entity-level API/hooks
└── shared/     # Generic API, configs, styles, storage, utilities
```

Read the full architecture guide:

- [Architecture](./docs/architecture.md)

## Kavano Frontend Agent Skill

This boilerplate includes the `kavano-frontend-agent-skill` for Codex/OpenAI-compatible agents and Claude Code. Developers cloning this repository can use it directly; no ZIP installation is required.

It also includes a reviewed, pinned `feature-slicing` companion plus focused `semgrep-security` and `sonarqube-analysis` skills. Kavano policy remains authoritative for repository-specific conventions.

- [Developer installation and usage guide](./docs/agent-skill.md)
- [GitLab wiki-ready page](./docs/wiki/kavano-frontend-agent-skill.md)
- [Canonical skill source](./agent-skills/kavano-frontend-agent-skill/SKILL.md)

## Scripts

```bash
npm run dev           # Start Vite dev server
npm run build         # Type-check and build production assets
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run lint:fsd      # Validate Feature-Sliced Design boundaries
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format files with Prettier
npm run format:check  # Check Prettier formatting
npm run test          # Unit and integration tests
npm run test:unit     # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e      # Playwright E2E tests
npm run test:coverage # Coverage report
npm run audit         # npm audit at moderate severity
npm run quality:lint  # ESLint, Steiger, and Prettier check
npm run quality:test  # Unit/integration tests and production build
npm run validate      # Lint, format check, test, and build
npm run validate:all  # Validate plus E2E and audit
```

## Testing

This template includes:

- Unit tests with Vitest
- Integration tests with Vitest and Testing Library
- E2E tests with Playwright

Read the full testing guide:

- [Testing](./docs/testing.md)

## Git Workflow

This template uses Conventional Commits and GitLab merge requests.

Local hooks:

- `pre-commit`: runs lint-staged
- `commit-msg`: validates commit messages with Commitlint
- `pre-push`: runs `npm run validate`

Read the full workflow:

- [Git flow](./docs/gitflow.md)

## GitLab CI

The GitLab pipeline uses three ordered stages:

1. Security: npm audit, Semgrep, Trivy, and SonarQube when its CI variables are configured.
2. Linting: ESLint, Steiger, and Prettier.
3. Testing: unit, integration, production build, and Playwright E2E.

Pipeline config:

- [.gitlab-ci.yml](./.gitlab-ci.yml)

## Docker

Run the development container:

```bash
docker compose up --build
```

Build the production image:

```bash
docker build --target production -t frontend-boilerplate .
```

Read the Docker guide:

- [Docker](./docs/docker.md)

## Security

Dependency, SAST, secret/configuration, and SonarQube quality-gate practices are documented here:

- [Security and audit](./docs/security.md)

## API And Auth

The configured Axios client lives in `shared/api/apiClient`.

It handles:

- base URL and timeout
- bearer token injection
- one refresh request shared across concurrent 401 responses
- retrying the original request after refresh succeeds
- clearing the token when refresh fails

Update endpoint constants in `shared/api/routes`.

## Code Quality

- Use public slice exports for cross-layer imports.
- Keep `shared` independent from business layers.
- Put server state in React Query.
- Put client-only shared state in Zustand only when React state is not enough.
- Add JSDoc in JavaScript when function shapes are not obvious.

## License

MIT
