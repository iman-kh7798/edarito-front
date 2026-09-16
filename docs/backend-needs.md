# What the frontend needs from the backend (login + password recovery)

Written while wiring `pages/login` against the real `../edarito-backend`. Login
itself is fully wired and working (see below). This file is only the gaps —
hand it to whoever owns the backend.

## 1. Self-service password recovery — doesn't exist yet

`../edarito-backend` has no self-service "forgot password" endpoint. It only
has:

- `POST /api/auth/me/change-password/` — **authenticated**, needs the
  _current_ password (`AuthService.change_password`).
- `POST /api/personnel/{id}/reset-password/` — **admin-only**, no OTP.

Neither covers "I'm logged out and forgot my password," which is the flow
`features/auth/password-recovery` implements against three placeholder
routes (`shared/api/routes.ts`: `PASSWORD_RESET_REQUEST_URL`,
`PASSWORD_RESET_VERIFY_URL`, `PASSWORD_RESET_CONFIRM_URL`) that currently 404. The screen still works end-to-end in the UI (it degrades gracefully on
request-failure so the flow can be built/tested without a backend), but
nothing is actually persisted until these exist.

### What the legacy panel actually does (captured live via chrome-devtools-mcp against `https://stage.edarito.com/`, 2026-09-16)

1. User enters their **national code** in the same username-shaped field.
   Request observed: `POST https://stageapi.edarito.com/api/v1/forgetPass`
   body `{"national_id": 21298726}` (note: **national ID, not the login
   username/personnel code** — different identifier).
2. Response: `{"hashedMobile":"0930*****62","remind":179}` — a masked phone
   number and a resend-cooldown in seconds. An SMS with a 6-digit code is
   sent to that phone.
3. User enters the 6-digit code (auto-submits on the 6th digit, no separate
   "verify" click needed from the user's perspective).
4. On success, a "set new password" screen appears: **a single password
   field** (no confirm/repeat field), with hint text "رمز عبور باید بدون
   فاصله و شامل ۶ کاراکتر و ترکیبی از حروف و اعداد باشد" (min 6 chars, must
   mix letters + digits, no spaces).
5. Did not capture the final "success" step or the verify/confirm request
   payloads — proceeding past the code step would have actually reset the
   password on a real (stage) account, so we stopped there. Re-check those
   two payloads live before finalizing the contract if it matters.

### Proposed contract (please confirm/adjust, don't assume this is final)

```
POST /api/auth/password/reset/request/
  { "username": "0021298726" }          # see open question below
  -> 200 { "masked_phone": "0930***062", "retry_after_seconds": 179 }
  -> 429 if asked again before retry_after_seconds elapses

POST /api/auth/password/reset/verify/
  { "username": "0021298726", "code": "123456" }
  -> 200 { "reset_token": "<short-lived opaque token>" }
  -> 400 on wrong/expired code

POST /api/auth/password/reset/confirm/
  { "reset_token": "...", "password": "newPass1" }
  -> 204
  -> 400 on invalid/expired token or a password that fails validation
```

### Open questions (need a product/backend decision, not a frontend guess)

- **Identify by `username` or `national_code`?** The legacy panel keys this
  off national ID, but on the new `User` model `national_code` is
  `null=True, blank=True` — not guaranteed to be set for every account. Login
  uses `username`. Recommend keying recovery off `username` too for
  consistency, unless there's a reason (e.g. SSO/import data) national code
  is more reliable — please confirm.
- **Password policy mismatch.** The legacy panel's own copy promises "≥ 6
  characters, letters + digits, no spaces." But
  `config/settings/base.py` → `AUTH_PASSWORD_VALIDATORS` (used by the
  existing authenticated change-password endpoint) enforces Django's
  `MinimumLengthValidator` (**8** chars, not 6) and `NumericPasswordValidator`
  (rejects all-digit passwords, but doesn't require a letters+digits mix).
  The frontend currently validates client-side against the _legacy_ rule
  (≥6, must contain both a letter and a digit) to match what the old panel
  tells the user — but if `password/reset/confirm/` ends up reusing the same
  `validate_password()` as change-password, an 6–7 character password that
  passes our client-side check will be rejected server-side. Please pick one
  policy and tell us which, so the client-side rule and the copy shown to the
  user can match what the server will actually accept.
- **SMS delivery** — who sends it (which provider), and is there a sandbox/
  dev mode so this can be tested without a real SMS spend?

## 2. Multi-organization / multi-position login step

The legacy panel has a "choose your job position" step after password entry
when an account has more than one organization/position (even a single-option
account still shows the picker). The new `User` model has exactly one
`organization` FK + one `position` string — no way to represent multiple.
**The new frontend intentionally does not build this step** (login goes
straight from password → home). Flagging in case multi-org support is
planned — if so, the login flow will need a third step and a supporting
endpoint (e.g. "my available positions").

## 3. Support button destination

`shared/ui` already has a `SupportButton` (headset FAB, bottom-left of every
auth screen, matching the legacy panel's corner widget) — it's now mounted in
`AuthLayout`, but has no `href`/`onClick` wired up. The legacy panel's
equivalent is a third-party chat widget (Aiocom, loaded via an iframe) — is
there an equivalent support channel (chat widget, phone number, mailto) to
point this at, or should it stay inert for now?

## What's already confirmed working (no action needed)

- `POST /api/auth/login/`, `GET /api/auth/me/`, `POST /api/auth/refresh/`
  (SimpleJWT rotation), `POST /api/auth/logout/` — all wired and tested
  end-to-end against a local backend instance (login → protected route →
  reload persistence → forced 401 → silent refresh → retry, all verified via
  chrome-devtools-mcp).
