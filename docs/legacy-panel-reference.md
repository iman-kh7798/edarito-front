# Legacy panel reference (design & UX source of truth)

Captured 2026-09-16 by logging into `https://stage.edarito.com/` (stage
credentials in `CLAUDE.md`) and walking through its screens with
`chrome-devtools-mcp`. This is the **production/staging "اداریتو" (Edarito)
by Kavano** panel — an old Angular/Material app (`c-*` BEM classes,
`MuiFormControl`/`MuiInputBase` etc. — Material-UI-flavoured, not our new
Tailwind kit). We are **not** porting its code, only its information
architecture, flows and visual language. Cross-check new screens against the
live stage site, not just this document — this is a snapshot and may drift.

Cross-reference `docs/backend-api-reference.md` for what the new backend can
actually support — several things below are legacy-only (see "Known gaps"
there) and need a product decision before being rebuilt.

## Product identity

- Title bar: "اتوماسیون" (Automation). Footer: "Copyrighted by kavano.co
  2024". Kavano logo (envelope/rooster-tail glyph) center-top on auth
  screens.
- Fully RTL, Persian UI copy, Jalali calendar dates everywhere
  (`۲۲ تیر ۱۴۰۵` style, Persian digits).
- Auth screen background: animated diagonal gradient (purple → teal),
  matches `loginpage.html` at the repo root and the frontend's existing
  `auth-gradient` token/utility — the new frontend's login already follows
  this.

## Login flow (multi-step, single screen)

1. **Username** step: numeric input (`maxlength=10`, `pattern="[0-9]+"`,
   `inputmode="numeric"`) labeled "نام کاربری" — this is the personnel code.
   A "رمز عبور خود را فراموش کرده‌ام!" (forgot password) link/expandable
   menu sits below. Submit is a left-pointing chevron icon button.
2. **Password** step: same layout, back-arrow to return to username, a
   show/hide (eye) toggle inside the field. Submit chevron again.
3. **Position picker** (only if the account has more than one job
   position/organization — this account has one listed even though it's a
   single option): shows the user's avatar + full name, then a list of
   "position | organization" rows to choose from (e.g. "کارمند30 کاوانو |
   شرکت کاوانو"). **The current backend has no equivalent** — `User` has one
   `organization`/`position` (see backend-api-reference.md) — flag this to
   the user before deciding whether the new frontend needs this step at all.

After choosing a position, the SPA loads the dashboard and shows one-off
modal announcements (release notes, incident notices) that must be dismissed
("متوجه شدم" button) before interacting further.

## App shell / navigation

Three fixed regions:

- **Left rail** (far left edge): a vertical strip of small circular avatars
  — appears to be a quick-contacts/favorites strip (not yet explored in
  depth; confirm purpose before rebuilding). A "لیست افراد در دسترس" (people
  icon, top-left corner) links to the personnel directory (`/allow-receivers`).
- **Right rail** (far right edge, on the brand gradient): global actions,
  top to bottom — ارسال نامه (compose, `+`), پیشخوان (dashboard/inbox grid
  icon), تنظیمات فردی (personal settings gear), جلسه آنلاین (online
  meeting, puzzle icon). Clicking the gear (or really any of these) expands
  a full-height gradient flyout panel from the right showing: user
  identity block (name, position, "تغییر رمز عبور" change-password link,
  "خروج" logout link) followed by the same nav items as labeled text links
  (ارسال نامه، پیشخوان، تنظیمات فردی، متون سریع، مدیریت پوشه‌ها، جلسه
  آنلاین).
- **Top bar** (inbox screen): a row of tabs — پیشخوان (inbox, default) |
  ارسال شده (sent) | ذخیره شده (saved/drafts) | بایگانی (archive) | همه
  نامه‌ها (all letters, with search). Plus a compose shortcut icon, a
  search icon (expands an inline search box: "برای جستجو در متن نامه از =
  قبل از نوشتن عبارت استفاده کنید" — prefix a term with `=` to search
  full-text), a filter icon, and an overflow (⋯) menu.

## Letter list (پیشخوان / ارسال شده / بایگانی / همه نامه‌ها)

Chronological, grouped under sticky Jalali-date pill headers (e.g.
"۲۲ تیر ۱۴۰۵"). Each row:

- Sender avatar (photo) + sender full name (bold) + position (muted,
  smaller, next to name).
- Subject (bold, second line).
- One-line preview: `"<last replier> : <message text>"`, truncated.
- Letter number (small, muted, left side in this RTL layout) — the
  `YYYYMMNNNNN` format from the backend — next to a timestamp
  `HH:MM | D Month YYYY`.
- A per-row "⋮" overflow button (top-left of the row) — quick actions,
  not yet inventoried; check it live before assuming its contents.
- An attachment-clip icon appears on rows that have attachments.
- Pagination at the bottom is numbered (1, 2, 3, …, 13, Next/Prev), not
  infinite scroll.

Special pinned item: an "اطلاعیه" (announcement) section header above the
first date group, showing a broadcast message from "کاوانو" with its own
icon — visually distinct from normal letters (see "Known gaps" in
backend-api-reference.md — nothing backend-side marks a letter as this kind
of broadcast).

## Compose (`/send-mail`)

- Header shows current user's name/position/avatar (top-right).
- Left icon column: "افراد" (people/org picker) and a save (floppy disk)
  icon for drafts.
- Fields, top to bottom: **گیرندگان** (recipients — free text/typeahead
  entry, with a "+person" icon to add from a group/org picker), **موضوع
  نامه** (subject).
- Rich text body editor toolbar: insert quick-text ("متن سریع"), link,
  ordered/unordered list, paragraph alignment, text color, bold/italic/
  underline, font-size dropdown ("کوچک" = small).
- Footer bar: **ارسال** (send, primary teal button) on the right (RTL
  "start"); on the left: forward/share icon, paperclip (attachments),
  briefcase icon (purpose unconfirmed — possibly classification/importance
  — verify live), star icon (mark important?).
- No visible explicit To/Cc split in the compose UI captured so far, but the
  **letter detail view does show a Cc list** (see below) — worth
  double-checking whether compose has a separate Cc entry point (e.g. behind
  the "+person" icon) before concluding it's To-only.

## Letter detail / thread (`/conversation/{id}`)

- Header: subject (large) + "شماره نامه: <number>" (right-aligned, muted).
  Toolbar icons: refresh, print, search.
- Each message in the thread is a card: timestamp (top-right of card),
  sender name (bold) + position (muted) with avatar, then metadata lines:
  - **ارسال به:** (To) — recipient name(s), styled as link(s).
  - **رونوشت:** (Cc) — separate list, also styled as links. Confirmed
    present in a real letter (`/conversation/260677`) — this is a genuine
    To/Cc split the backend does not currently model.
  - Formatted body text (rich text — bold, paragraphs, line breaks as
    authored).
- A reply/forward in the thread can be either a **plain reply** or an
  **ارجاع (referral)**: a referral card shows "ارجاع به: <name>" plus a
  **collapsed quoted-original block** ("نمایش بیشتر" / show more) — i.e.
  routing the letter to someone else with an instruction, quoting what came
  before. This is the classic Iranian office-automation "ارجاع" pattern and
  is visually/semantically distinct from a same-level reply. The backend's
  `Letter.parent` doesn't currently distinguish reply vs. referral — flag
  before implementing.
- Did not locate the action toolbar for replying/forwarding/archiving from
  this view in this pass (may be a hover state or below the fold on a
  longer thread) — **re-check live** when building this screen instead of
  assuming it's absent.

## Personal folders (`/category-management`)

"لیست پوشه‌ها" (folder list) — simple right-aligned list view, currently
empty for this account ("هیچ مقداری وجود ندارد" empty state with a folder
glyph). Toolbar: overflow menu, page-size selector, add (+), refresh,
search. Matches the backend's `LetterFolder` (name + color) reasonably well,
except the backend has no folder-edit endpoint (create/delete only) — see
backend-api-reference.md.

## Quick texts (`/quick-text`)

Same empty-state list UI as folder management. These are reusable text
snippets insertable from the compose editor's toolbar ("متن سریع" button).
**No backend support at all today** — a real gap, not just a UI gap.

## Personnel directory (`/allow-receivers`, "دسترسی سریع")

A flat, alphabetically-unsorted (org-relevance-sorted?) list of staff cards:
avatar, full name (bold), position (muted), organization/company (muted,
smaller). This is what recipient pickers on compose draw from — matches
`PersonnelDirectorySerializer` fields (`full_name`, `position`,
`organization_name`, `avatar`) closely, module `personnel_code` not shown in
the UI here.

## Not yet explored (confirm live before building)

- Exact contents of the per-letter "⋮" row menu and the thread-view action
  toolbar (reply/forward/archive buttons).
- The far-left avatar rail's actual purpose.
- The compose screen's "+person" group picker and the briefcase/star icon
  meanings.
- تنظیمات فردی (personal settings) screen contents beyond change-password.
- جلسه آنلاین (online meeting) — likely a separate integrated module, scope
  unclear.
- Mobile/responsive behavior (only checked at desktop viewport this pass).
