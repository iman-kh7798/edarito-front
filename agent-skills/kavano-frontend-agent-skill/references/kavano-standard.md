# Kavano Frontend Engineering Standard

This reference captures the intended qualities of the Kavano frontend boilerplate. It is the target contract for migrations; it is not permission to replace working project behavior or copy every sample file.

## Target stack

- React and Vite
- TypeScript-first source under `src/`, with strictness increased as migration risk permits
- React Router for client routing
- TanStack React Query for server state
- Axios for HTTP where the existing project does not have a justified alternative
- Zod for untrusted boundary validation where runtime validation is required
- Tailwind CSS with shared styles and tokens
- ESLint, Prettier, Husky, lint-staged, and Commitlint
- Vitest and Testing Library for unit/integration behavior
- Playwright for a small number of critical browser flows

Preserve a mature equivalent already used successfully by the project unless replacing it is explicitly in scope. Architecture consistency matters more than changing libraries for cosmetic parity.

## Source layout

```text
src/
├── app/        # providers, router, layouts, application composition
├── pages/      # route-level screens
├── widgets/    # reusable composed sections and layout widgets
├── features/   # user actions and workflows
├── entities/   # domain objects, entity APIs, query hooks, types
└── shared/     # generic API, configs, styles, storage, utilities
```

Dependencies point downward only:

```text
app -> pages -> widgets -> features -> entities -> shared
```

Code in a slice may import other slices only from lower layers. Same-slice modules may import one another with relative paths. `app` and `shared` are unsliced exceptions; they are organized by segments.

Do not add the deprecated `processes` layer. Not every project needs every remaining layer: add `features`, `entities`, and `widgets` when they improve discovery or reuse, not to satisfy an empty-folder diagram.

## Layer ownership

- `app`: entrypoint, providers, router configuration, global styles, app-wide initialization, monitoring, and app-wide state setup.
- `pages`: route-ready screens, including page-specific loading/error states and code that is not meaningfully reused.
- `widgets`: large self-contained UI blocks reused across pages or independently meaningful within a complex page.
- `features`: important user interactions reused across pages. Not every button, hook, or form is a feature.
- `entities`: business concepts recognized by product/domain language, with reusable model, API, and presentation code.
- `shared`: business-agnostic integrations and foundations such as API clients, focused libraries, configuration, routes, and UI primitives.

Within a slice, prefer purpose-based segments such as `ui`, `model`, `api`, `lib`, and `config`. Avoid generic dumping grounds named `components`, `hooks`, `types`, `helpers`, or `utils` when a purpose-specific name is available.

## Public APIs and imports

- Cross-slice imports use the owning slice's explicit public API, normally `index.ts`.
- Same-slice imports use relative paths and must not import back through the slice barrel.
- Export named, intentional contracts; avoid `export *` barrels that expose internals.
- Prefer focused entrypoints for `shared/ui/*` and `shared/lib/*` to avoid giant barrels and accidental bundle growth.
- Same-layer cross-slice imports are prohibited. If entity relationships cannot reasonably be separated, use a narrow, explicit cross-reference contract rather than a general deep import.
- Configure the `@/*` alias consistently in TypeScript, Vite, tests, and lint tooling.

## Data and auth conventions

- Put endpoint constants or typed route builders in `shared/api/routes.ts`.
- Keep the configured HTTP client in `shared/api/apiClient.ts`.
- Put entity reads under `entities/<entity>/api`.
- Put workflow-specific calls under `features/<feature>/<action>/api`.
- Type request DTOs, response payloads, and normalized errors at the API boundary.
- Keep query keys next to the API they identify.
- Put mutation side effects such as invalidation and token updates in the feature model hook.
- Use React Query for remote/server state, component state for local UI state, and Zustand only for client state that genuinely spans distant consumers.
- Keep protected-route loading and error states visible and intentional.
- Register Axios interceptors once, not during component renders.
- Share concurrent refresh work, retry an original request at most once, and clear invalid client auth state on terminal refresh failure.
- Preserve the backend's existing auth contract during a structural migration. Treat localStorage token storage as a compatibility choice with XSS exposure; prefer secure HttpOnly cookie sessions only when the backend and migration scope support them.

## UI and accessibility

- Keep reusable design tokens and global styles under `shared/styles` or focused shared UI foundations.
- Keep business-specific presentation in the owning entity, feature, widget, or page.
- Preserve semantic HTML, labels, keyboard access, focus behavior, reduced-motion behavior, and visible loading/error feedback during moves.
- A structural migration does not authorize a redesign.

## Quality and repository policy

- Provide one documented validation command that covers lint, formatting, unit/integration tests, and production build. Preserve the existing package manager.
- Add meaningful tests for migrated behavior, not assertions that only prove placeholder text renders.
- Keep unit tests close to pure modules, integration tests close to composed behavior, and a small set of high-value browser tests under `e2e/`.
- Use user-visible queries and outcomes in component/browser tests. Mock network boundaries deliberately; do not mock the behavior under test.
- Keep `.gitattributes` at repository root with LF normalization:

```gitattributes
* text=auto eol=lf
.husky/** text eol=lf
*.sh text eol=lf
```

- Do not document GitLab CI, Docker, or JavaScript/TypeScript source alternatives unless the corresponding files and workflows are present and maintained.
- Prefer one canonical source implementation. If a JavaScript mirror is temporarily retained, document how it is validated and how drift is prevented.
- Keep generated output, dependencies, coverage, and test artifacts ignored.
- Preserve unrelated working-tree changes and avoid mass formatting outside the migration scope.

## Boilerplate gaps that must not be copied

- Placeholder pages, empty layout widgets, and tests that only assert a heading.
- Duplicate TypeScript and JavaScript application trees without equal validation and an explicit maintenance strategy.
- HTTP interceptor registration that can run more than once.
- Blank protected-route loading states.
- Hardcoded environment-specific API configuration where deployment requires runtime separation.
- Documentation for CI or Docker files that are not actually present.
- Dependencies included only because the boilerplate lists them.
