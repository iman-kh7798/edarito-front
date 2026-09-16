# Backend API reference (current state)

Snapshot of what `../edarito-backend` (Django + DRF) actually implements today,
read directly from its source (`apps/*`) on 2026-09-16. This is **not** the
full feature set of the legacy panel (`docs/legacy-panel-reference.md`) — it's
what the new frontend can build against right now. Re-read the backend source
before relying on this if it's been a while; update this file when the
backend gains or changes endpoints.

Base path: `/api/`. Auth: JWT (SimpleJWT) via `Authorization: Bearer <token>`.

## apps/accounts — auth & "me"

`/api/auth/`

| Method & path              | Notes                                                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST login/`              | username + password → `{ access, refresh, user }`. `user` is `CurrentUserSerializer`. Generic error message on failure (no user-enumeration). |
| `POST refresh/`            | SimpleJWT refresh.                                                                                                                            |
| `POST logout/`             | body `{ refresh }`, blacklists it. Auth required.                                                                                             |
| `GET me/`                  | current user profile (`CurrentUserSerializer`).                                                                                               |
| `PATCH me/`                | update own `first_name`, `last_name`, `email`, `phone_number` only — nothing organizational/administrative.                                   |
| `POST me/change-password/` | `{ old_password, new_password, new_password_confirm }`.                                                                                       |
| `POST me/avatar/`          | multipart, `{ avatar }`.                                                                                                                      |

`User` model (`apps.accounts.models.User`, extends `AbstractUser`) — this is
"personnel": `personnel_code`, `national_code`, `phone_number`, `position`
(free-text job title), `organization` (FK → Organization, nullable), `role`
(`admin` | `user`), `avatar`. **No multi-organization/multi-position support**
yet — the legacy panel's "pick a job position after login" step (see
legacy-panel-reference.md) has no backend equivalent here; a user has exactly
one `organization` + one `position` string.

## apps/organizations — org chart

`/api/organizations/` — **admin only** (`IsAdminRole`). Standard REST
(list/retrieve/create/update/partial_update/destroy) via DRF router.

`Organization`: `name`, `code` (unique), `org_type` (`headquarters` |
`deputy` | `general_department` | `department` | `unit`), `parent` (self FK,
nullable → tree), `is_active`. List supports `?is_active=true|false`.
Non-admin users only ever see their own org via `organization_name` on
`/api/auth/me/` — there's no "browse the org chart" endpoint for regular
users yet.

## apps/personnel — staff CRUD & directory

`/api/personnel/`

| Method & path                          | Access                 | Notes                                                                                                                                                                                                                                                             |
| -------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET/POST personnel/`                  | admin only             | list (`?is_active=`) / create.                                                                                                                                                                                                                                    |
| `GET/PUT/PATCH/DELETE personnel/{id}/` | admin only             | full profile incl. `role`, `organization`, `is_active`, `is_staff`.                                                                                                                                                                                               |
| `POST personnel/{id}/reset-password/`  | admin only             | `{ new_password, new_password_confirm }`, no old password needed.                                                                                                                                                                                                 |
| `GET directory/?q=`                    | any authenticated user | lightweight search (`PersonnelDirectorySerializer`: `full_name`, `personnel_code`, `position`, `organization_name`, `avatar`) — this is what backs the recipient-picker on compose. Scoped to the searching user's org (see `PersonnelService.search_directory`). |

## apps/correspondence — letters (the core feature)

`/api/letters/`

| Method & path                                           | Notes                                                                                                                                                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET letters/?box=received\|sent\|archived&folder=<id>` | `box` defaults to `received`. `archived` + `folder` lists one personal folder's threads.                                                                                                                                    |
| `GET letters/{id}/`                                     | single letter.                                                                                                                                                                                                              |
| `POST letters/`                                         | multipart. `{ subject?, body, recipient_ids: number[], attachments?: File[], parent_id? }`. `subject` required only when `parent_id` is absent (replies/referrals inherit the root subject). Max attachment size 10MB each. |
| `GET letters/{id}/thread/`                              | full thread (root + replies/referrals), filtered to ones the current user can see.                                                                                                                                          |
| `POST letters/{id}/archive/`                            | `{ folder_id }` — archives the **whole thread** (by `thread_id`, not the single letter) into a personal folder.                                                                                                             |
| `POST letters/{id}/unarchive/`                          | removes the thread from archive.                                                                                                                                                                                            |
| `GET/POST folders/` , `GET/DELETE folders/{id}/`        | personal `LetterFolder` CRUD: `{ name, color }` (`color` must be `#RRGGBB`). No update endpoint (no PUT/PATCH) — only create/delete.                                                                                        |

Key model facts (`apps/correspondence/models.py`):

- **Numbering**: only root letters (`parent=None`) get a `number`, format
  `YYYYMMNNNNN` (4-digit Jalali year + 2-digit Jalali month + 5-digit
  sequence within that month), assigned atomically via a separate
  `LetterNumberCounter` row per (year, month) — O(1), no counting existing
  letters. Replies/referrals are numberless; the UI should show the **root's**
  number for context (`thread_number` in `LetterSerializer`).
  Matches the numbers seen in the legacy panel (e.g. `14050400207`).
- **No distinct "reply" vs "referral" (ارجاع) type** — both are just a
  `Letter` with `parent` set. The legacy panel visually distinguishes a
  reply from a referral/forward (see legacy-panel-reference.md); the backend
  does not carry that distinction as data today. If the redesign needs to
  show "ارجاع به: X" vs a plain reply, that's a **UI-only inference or a gap
  to flag**, not something the API currently labels explicitly — confirm
  with the user/backend rather than assuming.
- **`recipients` is a single flat list — no To/Cc split.** The legacy panel
  shows `ارسال به` (To) and `رونوشت` (Cc) as separate lists on a letter (see
  legacy-panel-reference.md). This backend has no Cc concept; all recipients
  are equivalent members of `recipients`. Don't build a To/Cc UI against this
  API without confirming — it's a real gap.
- Per-recipient `is_read` is tracked (`Letter.read_by`). Sender is always
  considered to have read their own sent letters.
- **Archiving is per-thread, per-user**, via `LetterArchive` (unique on
  `(user, thread_id)`) — archiving any letter in a thread archives the whole
  thread for that user only; other participants' archive state is
  independent.
- Attachments: `LetterAttachment` (`file`, `original_filename`), one-to-many
  on `Letter`.

## apps/core — shared infra

`BaseModel` (UUID PK + `created_at`/`updated_at`, used by every domain
model), `IsAdminRole` permission, centralized DRF exception handling
(`core/exception_handlers.py` — service-layer errors become standard HTTP
error responses, not caught ad hoc in views), a `run_async` helper used by
every viewset to call into async service functions, custom pagination.

## Known gaps vs. the legacy panel (don't build UI assuming these exist)

Confirmed absent from the backend as of this snapshot — flag to the user
before designing a screen around any of these:

- Multi-organization / multi-position per user (the legacy "choose your job
  position" post-login step).
- To vs Cc recipient split on letters.
- An explicit reply-vs-referral (ارجاع) letter type/label.
- Quick texts (متون سریع) — canned/reusable text snippets for composing.
- Broadcast/system-wide announcement letters (the legacy "اطلاعیه" pinned
  items) as a distinct concept — nothing in the model distinguishes these
  from a regular letter to many recipients.
- Editing a `LetterFolder` after creation (name/color) — only create/delete.
- Any org-chart browsing endpoint for non-admin users.
- Online meeting integration (جلسه آنلاین) seen in the legacy panel's nav.
