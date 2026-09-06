# CLAUDE.md

Guidance for working in this repository. Read `AGENTS.md`, `docs/architecture.md`,
and `src/README.md` alongside this file.

## What this project is

Kavano / Edarito frontend: a React 19 + TypeScript SPA built with Vite, Tailwind
CSS v4, React Router, TanStack Query, Axios and Zod, organised with
**Feature-Sliced Design**. The UI is **RTL / Persian first**.

`src/` is the only application source. `src-js/` has been removed — do not
recreate it.

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # tsc -b && vite build (type-check + prod build)
npm run lint           # ESLint (flat config, FSD boundaries, a11y, import order)
npm run lint:fsd       # Steiger — Feature-Sliced Design checks
npm run format:check   # Prettier
npm run validate       # lint + lint:fsd + format:check + tests + build
```

Node 24 is required (`.nvmrc`). Run `npm run validate` before handing work back.
Tests exist (Vitest / Playwright) but **do not add tests unless asked**.

## Architecture (FSD)

Layers, importable only downward: `app → pages → widgets → features → entities → shared`.

- **app** — providers, router, layouts, `setupAxios`, global styles.
- **pages** — route screens. `pages/login` hosts the whole auth screen.
- **widgets** — reusable page blocks. `widgets/auth-layout` is the gradient shell.
- **features** — user actions. `features/auth/{login,logout,refresh,password-recovery}`.
- **entities** — domain models. `entities/user`.
- **shared** — infra with no domain knowledge: `shared/ui` (UI kit), `shared/api`,
  `shared/lib`, `shared/configs`, `shared/styles`.

Rules enforced by ESLint (`eslint-plugin-boundaries`, `import/no-internal-modules`)
and Steiger:

- Cross-slice imports go through the slice's `index.ts` public API
  (`@/features/auth/login`), never a deep path.
- One `index.ts` per slice. **No segment barrels** (`ui/index.ts`, etc.).
- `shared/ui` and `shared/lib` expose a **per-item** public API
  (`@/shared/ui/button`, `@/shared/lib`).
- Inside a slice use relative imports; never import your own `index.ts`.
- `@/*` maps to `src/*`. Import order is autofixable: builtin → external →
  internal (`@/`) → parent → sibling, blank line between groups, alphabetised.
- Named exports only. Folders `kebab-case`, components `PascalCase.tsx`.
- Segment names are purpose-based: `ui`, `model`, `api`, `lib`, `config`.

## Design system

### Tokens — `src/shared/styles/tokens.css`

Tailwind v4 `@theme`. The **default Tailwind palette is disabled**
(`--color-*: initial`); every colour must be a token. Tokens are exposed as
utilities: `--color-brand-500` → `bg-brand-500` / `text-brand-500` /
`border-brand-500`.

| Group           | Tokens                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| primitives      | `white`, `black`, `transparent`, `current`                                                             |
| neutral ramp    | `neutral-50 … neutral-900`                                                                             |
| brand           | `brand-50/100/300/500/600/700` (`brand-500` = primary action / support FAB)                            |
| semantic        | `primary`, `primary-strong`, `danger` (form errors), `success`, `warning`, `info`                      |
| surfaces        | `bg`, `fg`, `muted`, `border`, `card` (dark values under `[data-theme="dark"]`)                        |
| auth screen     | `auth-from` / `auth-via` / `auth-to` (gradient), `auth-panel`                                          |
| on the gradient | `on-gradient`, `on-gradient-muted`, `on-gradient-faint`, `on-gradient-line`, `on-gradient-line-strong` |
| radius          | `--radius-sm/md/lg/xl` → `rounded-*`                                                                   |
| type            | `--font-sans` (Vazirmatn, loaded in `index.html`) → `font-sans`                                        |
| elevation       | `--shadow-sm/md/fab` → `shadow-*`                                                                      |

`src/shared/styles/utilities.css` adds `.auth-gradient` (the full-bleed brand
gradient), `.card`, `.container-x`. Dark mode: `<html data-theme="dark">`.

### UI kit — `src/shared/ui/<component>/`

All components are RTL-aware, theme-token styled, and controlled. Import each
from its own path.

| Import                       | Purpose                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@/shared/ui/button`         | `Button` — `variant` `solid \| text \| link`, `tone` `brand \| on-gradient \| neutral`, `size`, `loading`, `iconStart/iconEnd`, `fullWidth`       |
| `@/shared/ui/icon-button`    | `IconButton` — icon-only, **required `label`**, `tone`, `size`, `loading`                                                                         |
| `@/shared/ui/text-field`     | `TextField` — floating-label underline input, `onChange(value)`, `error`, `hint`, `tone` `on-gradient \| surface`, `endAdornment`, `focusOnMount` |
| `@/shared/ui/password-field` | `PasswordField` — `TextField` + show/hide toggle                                                                                                  |
| `@/shared/ui/otp-input`      | `OtpInput` — N single-digit boxes, paste / arrow / backspace, `onComplete`, `error`, `focusOnMount`                                               |
| `@/shared/ui/countdown`      | `Countdown` — `seconds` (restarts on change), `onComplete`, Persian digits by default                                                             |
| `@/shared/ui/spinner`        | `Spinner` — `size`, inherits `currentColor`                                                                                                       |
| `@/shared/ui/icon`           | `BackArrowIcon`, `CheckIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `EyeIcon`, `EyeSlashIcon`, `HeadsetIcon` — 1em `currentColor` SVGs           |
| `@/shared/ui/logo`           | `KavanoLogo`, `PartnerLogos` — `currentColor`, size via `w-*`                                                                                     |

Conventions when adding a component: one folder per component with
`Component.tsx` + `index.ts`; props extend the native element props where it
wraps one; expose `on<Thing>` value callbacks (not raw events) for form
controls; never use the `autoFocus` DOM attribute (a11y lint) — take a
`focusOnMount` prop and focus via a ref effect; `class` composition via
`cn` from `@/shared/lib`.

### RTL / Persian

- `index.html` sets `lang="fa" dir="rtl"`; `AuthLayout` re-asserts `dir="rtl"`.
- Digit helpers in `@/shared/lib`: `faToEnDigits`, `enToFaDigits`, `onlyDigits`.
- Iranian Zod validators live in `@/shared/lib/validation/iran`.
- Keep user-facing copy in Persian; code, identifiers and comments in English
  (short Persian comments are acceptable, matching existing files).

## Auth screen — `pages/login`

One route, `/login` (see `app/routers/AppRouter.tsx`), renders `AuthLayout`
and switches between two feature forms via local `mode` state:

- **`features/auth/login`** — `LoginForm` + `useLoginFlow`. Steps:
  `username` → `password`. Numeric username (≤ 10 digits). Calls
  `useLoginMutation` (`shared/lib/storage` holds the token, `entities/user`
  `me` query is invalidated on success).
- **`features/auth/password-recovery`** — `PasswordRecoveryForm` +
  `usePasswordRecoveryFlow`. Steps: `username` → `code` (OTP + resend
  `Countdown`) → `password` (new + confirm) → `done`. Three mutations wrap the
  sample endpoints; the flow degrades gracefully so the UI works without a
  backend.

No sign-up flow exists by design — login and password recovery only.

### Endpoints to replace

`src/shared/api/routes.ts` holds sample paths. Point these at the real API:
`LOGIN_URL`, `INFO_URL`, `REFRESH_URL`, `PASSWORD_RESET_REQUEST_URL`,
`PASSWORD_RESET_VERIFY_URL`, `PASSWORD_RESET_CONFIRM_URL`. Align the DTOs in
`features/auth/*/api` with the backend contract (e.g. `LoginDTO` currently
`{ username, password }`).

## Gotchas

- Tailwind colours: if a class like `text-foo` does nothing, add the token to
  `tokens.css` — the default palette is intentionally off.
- `shared` must never import from `features` / `entities` / `widgets` / `pages` /
  `app`.
- Steiger + ESLint both run in `validate` and CI; fix ownership violations at the
  source rather than adding ignores.
