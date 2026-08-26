# TypeScript Source

`src/` is the default application source. It is the recommended version for production work because it uses strict TypeScript, typed API responses, and type-safe React Query hooks.

## Entry Points

- `main.tsx` mounts React into `#root`.
- `app/App.tsx` wires global providers, layout, routing, global styles, and Axios setup.
- `app/routers/AppRouter.tsx` owns route registration.

## Folder Contract

```text
src/
├── app/        # Application composition: router, providers, layouts
├── pages/      # Route-level screens
├── widgets/    # Reusable page sections and layout widgets
├── features/   # User actions and workflows
├── entities/   # Business entities and entity-level API/hooks
└── shared/     # Generic code: API client, configs, styles, utilities
```

## Import Rules

Use the `@/` alias for source imports:

```ts
import { api } from "@/shared/api/apiClient";
```

Layer dependencies should flow downward:

- `app` can import every layer.
- `pages` can import `widgets`, `features`, `entities`, and `shared`.
- `widgets` can import `features`, `entities`, and `shared`.
- `features` can import `entities` and `shared`.
- `entities` can import `shared`.
- `shared` can import only `shared`.

Prefer public entry files such as `index.ts` for cross-folder imports. Keep deep imports inside the owning slice unless the module is intentionally public.

## API Pattern

- Put endpoint constants in `shared/api/routes.ts`.
- Put the configured Axios instance in `shared/api/apiClient.ts`.
- Put entity APIs under `entities/<name>/api`.
- Put feature APIs under `features/<name>/<action>/api`.
- Type request DTOs and responses at the API boundary.

## Hooks

- Use React Query for server state.
- Keep query keys close to the API they describe.
- Keep mutation side effects, such as invalidation or token updates, inside the feature model hook.

## Tests

- Put unit tests next to the module with `*.unit.test.ts` or `*.unit.test.tsx`.
- Put integration tests next to the composed behavior with `*.integration.test.tsx`.
- Put browser flows in `e2e/*.spec.ts`.
- Use Testing Library queries that match what the user sees.

Examples:

- `shared/lib/storage.unit.test.ts`
- `app/routers/AppRouter.integration.test.tsx`

## Styling

Global CSS and Tailwind entry files live under `shared/styles`. Component-specific styles should stay near the component unless they are reusable tokens or utilities.
