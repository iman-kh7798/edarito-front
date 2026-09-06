# Testing

This boilerplate uses a three-layer testing strategy:

- Unit tests for pure functions and isolated modules.
- Integration tests for React components, hooks, routing, and provider behavior.
- End-to-end tests for browser-level user flows.

## Commands

```bash
npm run test              # Unit and integration tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:watch        # Watch mode for local work
npm run test:coverage     # Coverage report
npm run test:e2e          # Playwright E2E tests
npm run test:e2e:ui       # Playwright UI mode
```

## File Naming

Use explicit suffixes so each command can target the right layer:

```text
*.unit.test.ts
*.unit.test.tsx
*.integration.test.ts
*.integration.test.tsx
e2e/*.spec.ts
```

## Unit Tests

Use unit tests for deterministic code with no browser navigation or real network dependency.

Good candidates:

- storage helpers
- validators
- date formatting helpers
- pure mapping functions
- query key factories

## Integration Tests

Use integration tests for behavior across a few modules.

Good candidates:

- route rendering
- protected route behavior
- feature hooks with mocked API calls
- forms with validation and submission behavior

React integration tests use Testing Library. Prefer user-visible queries such as `getByRole`, `getByLabelText`, and `findByText`.

## E2E Tests

Use E2E tests for the most important browser flows. Keep them few and valuable.

Good candidates:

- login/logout
- protected route redirects
- critical create/edit flows
- layout and navigation smoke tests

Playwright starts the Vite dev server automatically from `playwright.config.ts`.

By default, Playwright uses its managed browser binaries. If a local machine cannot download those binaries, but has Chrome installed, run:

```bash
PLAYWRIGHT_CHROMIUM_CHANNEL=chrome npm run test:e2e
```

## CI Strategy

GitLab runs:

- security checks first;
- ESLint, Steiger, and format checks second;
- unit tests, integration tests, the production build, and E2E tests in the final stage.

Keep unit and integration tests fast. Put slower full-browser checks in E2E.
