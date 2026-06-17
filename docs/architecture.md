# Architecture

This boilerplate follows a Feature-Sliced Design style structure. The goal is to keep application wiring, screens, business workflows, domain entities, and generic utilities separate enough that the project can grow without turning imports into a knot.

## Layers

```text
app -> pages -> widgets -> features -> entities -> shared
```

Dependencies should point from left to right. A lower layer must not know about a higher layer.

## Layer Responsibilities

`app`
: Application composition: providers, router, layouts, app-level setup.

`pages`
: Route-level screens. Pages compose widgets, features, entities, and shared utilities.

`widgets`
: Reusable page sections such as header, sidebar, footer, and larger UI blocks.

`features`
: User actions and workflows such as login, logout, filtering, creation, or submission.

`entities`
: Business objects such as user, account, project, invoice, or product. Entity APIs and entity-level query hooks live here.

`shared`
: Generic code with no business ownership: API client, configs, styles, storage helpers, validators, date helpers, and low-level utilities.

## Public APIs

Each slice should expose stable imports through its `index.ts`, `index.tsx`, or `index.js` file. Prefer:

```ts
import { useMeQuery } from "@/entities/user";
```

Avoid importing from another slice's private internals unless that file is intentionally part of the public contract.

## API Rules

- `shared/api/apiClient` owns Axios setup, auth header injection, and generic retry behavior.
- `shared/api/routes` owns endpoint constants.
- `entities/*/api` owns entity-level reads and writes.
- `features/*/*/api` owns workflow-specific calls.
- `shared` must not import from `features`, `entities`, `widgets`, `pages`, or `app`.

## React Query Rules

- Query keys should be exported near the API they identify.
- Queries should be enabled only when their required input exists.
- Mutations should invalidate or update related queries in their model hook.
- Do not store server state in Zustand; use React Query for that.

## State Rules

- Use React state for local UI state.
- Use React Query for server state.
- Use Zustand only for client state that must be shared across distant components.
- Keep persisted auth token handling isolated in `shared/lib/storage`.

## Styling Rules

- Global styles and tokens live in `shared/styles`.
- Keep component-specific styling close to the component.
- Prefer design tokens and shared utilities over one-off values when the value is reused.

## Adding A Feature

1. Create `features/<feature>/<action>/`.
2. Add `api/` for network calls if needed.
3. Add `model/` for hooks, schemas, and state.
4. Add `ui/` for user-facing components.
5. Export only the public pieces through an index file.
6. Run `npm run validate`.
