# Frontend Boilerplate

Default key for token is `access_token` and you can change it in `shared/lib/storage.ts`

TODO: parts are the main changing parts

Use Capital-case for types and interfaces

## Features

This boilerplate contains:

1. Auth strategy
2. Datepicker helpers
3. Routing strategy
4. ApiCall strategy
5. Store strategy for apis(react-query) and models(zustand)
6. Validation schemas for forms using zod

## Code Quality & Linting

This project uses ESLint and Prettier to maintain code quality and consistency.

### Linting Tools

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files only

### Available Scripts

```bash
# Run ESLint to check for errors
npm run lint

# Run ESLint and automatically fix issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Pre-commit Hooks

The project uses Husky to run lint-staged before each commit. This ensures:

- All staged `.ts`, `.tsx`, `.js`, `.jsx` files are linted and formatted
- All staged `.json`, `.css`, `.scss`, `.md` files are formatted
- Only staged files are checked (faster commits)

### ESLint Configuration

The ESLint configuration enforces:

- **Import ordering**: Imports are automatically sorted and grouped (external → internal → parent → sibling → index)
- **Feature-Sliced Design boundaries**: Enforces proper layer dependencies
- **TypeScript best practices**: Type-safe imports, no unused variables
- **Prettier integration**: Code formatting rules

#### Import Order Rules

1. External packages (react, react-router, etc.)
2. Internal imports (@/shared, @/entities, etc.)
3. Parent directory imports
4. Sibling imports
5. Index imports

Each group is separated by a blank line and sorted alphabetically.

#### Layer Dependencies (Feature-Sliced Design)

The project follows Feature-Sliced Design architecture with strict layer rules:

- `app` → can import from: processes, pages, widgets, features, entities, shared
- `pages` → can import from: widgets, features, entities, shared
- `widgets` → can import from: features, entities, shared
- `features` → can import from: entities, shared
- `entities` → can import from: shared
- `shared` → can import from: shared only (and features for API interceptors)

### Fixing Linting Issues

1. **Automatically fix most issues**:

   ```bash
   npm run lint:fix
   ```

2. **Format all files**:

   ```bash
   npm run format
   ```

3. **Check specific files**:
   ```bash
   npx eslint src/path/to/file.tsx
   ```

### Common Issues & Solutions

- **Import order errors**: Run `npm run lint:fix` to auto-fix
- **Boundary violations**: Check that you're importing from allowed layers
- **Unused variables**: Remove them or prefix with `_` (e.g., `_unusedVar`)
- **Type import errors**: Use `import type` for type-only imports

### Configuration Files

- `eslint.config.js`: ESLint rules and configuration
- `.prettierrc`: Prettier formatting rules
- `tsconfig.eslint.json`: TypeScript config for ESLint
- `.husky/pre-commit`: Pre-commit hook script
- `package.json`: lint-staged configuration
