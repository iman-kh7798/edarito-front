# JavaScript Source

`src-js/` is the JavaScript version of the boilerplate. It is useful for teams that want the same React architecture without TypeScript.

## Switching The App To JavaScript

The project runs `src/` by default. To run `src-js/`, update:

```html
<!-- index.html -->
<script type="module" src="/src-js/main.jsx"></script>
```

```ts
// vite.config.ts
resolve: { alias: { "@": path.resolve(__dirname, "src-js") } },
```

Then run:

```bash
npm run dev
```

## Folder Contract

```text
src-js/
├── app/        # Application composition: router, providers, layouts
├── pages/      # Route-level screens
├── widgets/    # Reusable page sections and layout widgets
├── features/   # User actions and workflows
├── entities/   # Business entities and entity-level API/hooks
└── shared/     # Generic code: API client, configs, styles, utilities
```

## File Conventions

- Use `.jsx` for React components.
- Use `.js` for API modules, hooks, constants, utilities, and re-exports.
- Use JSDoc for non-obvious function parameters and return values.
- Keep the same public API pattern as TypeScript: expose slice modules through `index.js` files.

## Architecture Rules

Keep dependencies flowing downward:

- `app` can import every layer.
- `pages` can import `widgets`, `features`, `entities`, and `shared`.
- `widgets` can import `features`, `entities`, and `shared`.
- `features` can import `entities` and `shared`.
- `entities` can import `shared`.
- `shared` can import only `shared`.

The ESLint config applies browser globals to JavaScript files, so browser APIs like `localStorage` are valid without inline disables.

## API And Auth

`shared/api/apiClient.js` contains the Axios instance, bearer token injection, and refresh-token retry logic. Keep generic HTTP behavior there. Put business-specific login, logout, and user APIs in `features` or `entities` when you expand the JavaScript source.

## Tests

The active test setup targets the TypeScript source by default. If you switch the app to `src-js/`, mirror the same naming conventions:

- `*.unit.test.jsx` or `*.unit.test.js`
- `*.integration.test.jsx` or `*.integration.test.js`
- `e2e/*.spec.ts` for browser flows

Update `vitest.config.ts` aliases and include patterns when JavaScript becomes the active source.
