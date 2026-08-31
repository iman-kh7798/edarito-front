# Migration Playbook

Use this reference for assessments, migration plans, and implementation sequencing.

## 1. Establish the baseline

Record:

- framework, build tool, package manager, runtime versions, and source roots;
- current Git changes and generated/vendor directories;
- entrypoints, router shape, layouts, providers, and route guards;
- state ownership: remote cache, global client state, local state, persisted state;
- API clients, endpoint definitions, auth/session flow, interceptors, and error normalization;
- test commands, CI checks, deployment build, and known failures;
- aliases, path casing, import cycles, boundary violations, and line endings.

Run the smallest reliable baseline first. Do not start with package upgrades unless upgrades are part of the request.

## 2. Produce an architecture map

Map current ownership to target ownership. Use evidence from imports and consumers instead of folder names alone.

| Current responsibility                   | Typical target               |
| ---------------------------------------- | ---------------------------- |
| Root entrypoint, providers, router       | `app`                        |
| Route component/screen                   | `pages/<route>`              |
| Reused large page section/layout block   | `widgets/<domain>`           |
| Reused user interaction                  | `features/<domain>/<action>` |
| Reused business concept                  | `entities/<entity>`          |
| HTTP client, generic UI, focused utility | `shared/<segment>`           |

Record uncertain files instead of guessing. A component used on one page may stay in that page; reuse is not automatically a widget or feature.

## 3. Define batches

Prefer dependency-ordered batches:

1. Baseline tooling and source alias.
2. `app` composition and route-ready `pages`.
3. Focused `shared` foundations used by migrated pages.
4. Reused entities and user interactions extracted from real duplicated usage.
5. Reused widgets and layout blocks.
6. Mechanical boundary enforcement and stale-code cleanup.
7. Full verification and documentation alignment.

Each batch needs:

- explicit in-scope routes or domains;
- behavior that must remain unchanged;
- expected file moves and public contracts;
- focused tests/checks;
- a stopping point where the app still builds;
- rollback/recovery notes for risky auth, routing, or state changes.

## 4. Move code safely

- Add the target slice and explicit public API.
- Move a coherent module with its tests and styles.
- Update consumers; use relative imports inside the slice and aliases across slices.
- Run focused type, lint, and behavior checks.
- Remove the old file only after no consumers remain.
- Search for stale paths, duplicate implementations, and invalid barrels.
- Avoid repo-wide formatting mixed into architectural moves.

Temporary adapters are acceptable when they keep a large migration deployable. Give each adapter a removal condition and do not present it as the final architecture.

## 5. Handle cross-cutting concerns

### Authentication

Trace login, current-user lookup, refresh, retry, logout, protected navigation, persistence, and failed-session behavior as one flow. Preserve backend semantics. Add tests before restructuring a flow that lacks coverage.

### State

Classify state before moving it. Remote cache belongs in React Query; local ephemeral state stays near the UI; global client state needs a concrete multi-consumer reason. Do not move all legacy state into one new global store.

### Shared

Start conservatively. Move code into `shared` only when it is business-agnostic and reused or foundational. Move page-only code back into the page instead of creating a universal dumping ground.

### TypeScript

For JavaScript projects, choose an explicit strategy: boundary-first TypeScript, route-by-route conversion, or JavaScript retention. Avoid enabling strict flags that create thousands of unrelated errors in the same batch; stage strictness and prevent new violations.

## 6. Planning-only output

When the user requests a plan rather than implementation, deliver:

- current-state summary;
- target-state summary;
- major risks and unknowns;
- dependency-ordered batches with acceptance criteria;
- validation strategy;
- decisions requiring user or backend ownership.

Do not modify files in planning-only mode.
