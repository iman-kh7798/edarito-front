# CLAUDE.md

Guidance for working in this repository. Read `AGENTS.md`, `docs/architecture.md`,
`docs/backend-api-reference.md`, `docs/legacy-panel-reference.md`,
`docs/backend-needs.md`, and `src/README.md` alongside this file.

## Ground rules for working here

1. **Build a design system first, implement against it.** Every screen is
   composed from the shared token set (`src/shared/styles/tokens.css`) and
   the shared UI kit (`src/shared/ui/*`, catalogued below) — components must
   be **reusable** rather than bespoke-per-screen wherever the same control
   (field, button, OTP box, countdown, …) recurs. Add a new shared component
   before duplicating markup for a one-off need.
2. **After building or changing any screen/feature, connect to the running
   app with `chrome-devtools-mcp` and actually exercise it** (navigate, fill
   forms, click through the flow, check the console/network) before calling
   the work done. The UI must visually and behaviorally track the legacy
   panel's design (`docs/legacy-panel-reference.md`) — cross-check live
   against `https://stage.edarito.com/` with `chrome-devtools-mcp`, not just
   the snapshot doc. The legacy panel itself had real responsive bugs, so
   **check every changed screen at several viewport widths** (e.g. ~320,
   375, 768, 1024, 1920) — don't assume desktop-only is enough. If anything
   is off — visually (spacing, RTL, colors, responsiveness) or functionally
   (broken flow, wrong API call, console error) — go back and fix it, then
   re-verify with `chrome-devtools-mcp` again. Do not report a feature as
   finished on the basis of type-checks/tests alone.
3. **Do not add tests unless the user explicitly asks.** (Existing tests
   still need to keep passing — don't break them.)
4. **Never take a default/guessed action when something is ambiguous or
   underspecified** (which screen it belongs to, exact copy, an edge case the
   legacy panel and the backend disagree on, a design detail not covered by
   `docs/legacy-panel-reference.md`, etc.). Stop and ask the user instead of
   picking an option on your own. This applies even under otherwise
   autonomous/auto-mode instructions. When the gap is specifically something
   the backend needs to add/change, write it up in
   `docs/backend-needs.md` (proposed contract + open questions) instead of
   inventing the contract silently — see that file for the current example
   (self-service password recovery).
5. **Code must be optimized and follow best practice**: no redundant
   re-renders/requests, narrow types over `any`, colocate state with the
   component/hook that owns it, prefer the existing patterns in this repo
   (see "Architecture" and "Design system" below) over introducing new ones.
6. **Bias toward less agent token spend where it doesn't cost correctness**:
   prefer targeted `Read`/`Grep` over re-reading whole trees, batch
   independent tool calls, reuse a doc snapshot (e.g.
   `docs/legacy-panel-reference.md`) instead of re-crawling the live legacy
   site when the snapshot already answers the question, and keep replies
   concise. Flag it to the user if you spot a structural way to cut cost
   (e.g. a doc that should be captured once and reused). See
   `../CLAUDE.md` for the full workspace-wide token-optimization checklist
   (never bulk-read `node_modules`/`dist`/`coverage`, delegate wide
   exploration to `Explore`, prefer `codebase-memory` graph queries for
   structural questions, don't re-run full `npm run validate` after every
   small edit, etc.) and the dev-server port-reuse rule below.
7. **Reuse the running dev server — don't open a new port every session.**
   Before running `npm run dev`, check whether port 5173 is already
   listening (`ss -ltnp | grep 5173`). If it is, that's a dev server from
   this or an earlier session — use it (point `chrome-devtools-mcp` at
   `http://localhost:5173`) instead of starting a second Vite instance on 5174. Only start a fresh one if nothing is listening, or the existing
   process is confirmed stale.

## What this project is

**اداریتو (Edarito)**, built by **Kavano**, is a Persian/RTL internal office
automation system (سامانه اتوماسیون اداری) — the digital equivalent of an
organization's internal mail room: formal letters/memos with an official
numbering scheme, sender/recipient routing, referral chains, and personal
archiving, aimed at company staff (پرسنل) organized into a hierarchical org
chart (سازمان).

This repo has two projects:

- `edarito-frontend-v2` (this one) — the **new** frontend being built from
  scratch, matching the **existing production/staging design system** (see
  `docs/legacy-panel-reference.md`, captured by exploring
  `https://stage.edarito.com/`) but implemented against the **new backend**
  in `../edarito-backend` (see `docs/backend-api-reference.md` for what that
  backend currently exposes — it does not yet cover every legacy feature).
- `../edarito-backend` — a Django REST backend being built in parallel,
  currently covering auth/personnel/organizations/letters only (see
  `docs/backend-api-reference.md`).

The legacy/staging panel is the **design and UX source of truth** for this
rewrite: same core flows (letter inbox, compose, thread/referral view,
personal folders, personnel directory), reimplemented on the new stack
described below. Where the legacy panel has a feature the new backend
doesn't support yet, don't invent it silently — ask (see "Ground rules"
above).

### Stage panel access (reference only)

For comparing behavior/design against the legacy panel during development:

- URL: `https://stage.edarito.com/`
- Username: `0021298726`
- Password: `dz6gkf`
- After password, the account has multiple job positions — pick
  "کارمند30 کاوانو | شرکت کاوانو" to land on the real dashboard.

This is a stage account for reference only — do not commit new/rotated
credentials here without the user's say-so, and don't reuse this account for
anything beyond visually/behaviorally cross-checking the rewrite.

## Frontend stack

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
  `useLoginMutation`, wired to the real `POST /api/auth/login/`: stores both
  `access`/`refresh` (`shared/lib/storage`), seeds the `entities/user` `me`
  query cache from the response's `user`, and navigates to `/`.
- **`features/auth/password-recovery`** — `PasswordRecoveryForm` +
  `usePasswordRecoveryFlow`. Steps: `username` → `code` (OTP, auto-submits on
  the 6th digit, resend `Countdown`) → `password` (single field, no confirm —
  matches the legacy panel exactly) → `done`. The three mutations point at
  `PASSWORD_RESET_*_URL`, which **the backend does not implement yet** — see
  `docs/backend-needs.md`. The flow degrades gracefully (advances past a
  failed request) so it can still be built/tested end-to-end without that
  backend work landing first.

No sign-up flow exists by design — login and password recovery only.

### API wiring

`src/shared/api/routes.ts` holds the real backend paths (`/api/auth/...`,
proxied in dev by `vite.config.ts`'s `server.proxy` to
`http://127.0.0.1:8000`). `LOGIN_URL`, `INFO_URL`, `REFRESH_URL`,
`LOGOUT_URL` are wired and verified end-to-end against a local backend
instance. `PASSWORD_RESET_*_URL` are **proposed** paths pending backend work
(`docs/backend-needs.md`). `entities/user` maps the backend's snake_case
`CurrentUserSerializer` (`api/userDto.ts`) to the camelCase `User` domain
type — extend that mapper, not ad-hoc field access, when new user fields are
needed. `accounts.User` uses Django's default integer PK (`id: number`), not
the UUID `BaseModel` used elsewhere in the backend.

## Gotchas

- Tailwind colours: if a class like `text-foo` does nothing, add the token to
  `tokens.css` — the default palette is intentionally off.
- `shared` must never import from `features` / `entities` / `widgets` / `pages` /
  `app`.
- Steiger + ESLint both run in `validate` and CI; fix ownership violations at the
  source rather than adding ignores.
