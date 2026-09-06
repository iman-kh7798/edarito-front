---
name: kavano-frontend-agent-skill
description: Assess, plan, and refactor an existing React frontend into the Kavano Vite, TypeScript, and Feature-Sliced Design standard while preserving behavior. Use for legacy modernization, architecture migration, boundary cleanup, auth/API normalization, test migration, or adoption of the Kavano frontend boilerplate. Do not use for unrelated feature work or visual redesigns.
---

# Kavano Frontend Agent Skill

Modernize legacy frontends toward the Kavano frontend standard without turning an architecture migration into an uncontrolled rewrite.

## Required context

Read [references/kavano-standard.md](references/kavano-standard.md) for every task that changes code or proposes a target architecture.

Then read only the references needed for the request:

- Assessment or planning: [references/migration-playbook.md](references/migration-playbook.md)
- Implementation: [references/migration-playbook.md](references/migration-playbook.md) and [references/verification.md](references/verification.md)
- CI, security, linting, or test-gate work: [references/quality-gates.md](references/quality-gates.md)
- Installation, publishing, OpenAI, or Anthropic usage: [references/platform-distribution.md](references/platform-distribution.md)
- Skill composition or dependency selection: [references/companion-skills.md](references/companion-skills.md)

If shell access is available, run `bash scripts/audit_frontend.sh <project-root>` for a read-only baseline. Confirm important findings directly before basing changes on them.

## Companion skills

If a trusted Feature-Sliced Design skill is available, load it before deciding layer or slice boundaries. The Kavano frontend standard wins where it intentionally narrows an FSD choice. If no FSD skill is installed, continue using the bundled standard; do not block the migration.

Use other installed skills only when their normal trigger applies. Testing skills may guide test migration; security skills require an explicit security review or a security-specific task; Figma skills apply only to design work. Never install a third-party skill, access an external service, or expand into an audit without authorization.

## Operating contract

- Inspect before editing: framework, language, package manager, entry points, routes, state, API/auth, tests, CI, deployment, aliases, line endings, and current Git changes.
- Establish a passing baseline when practical. If the baseline already fails, record the failures and avoid claiming the migration caused or fixed them without evidence.
- Preserve user-visible behavior, URLs, API contracts, persisted data, accessibility semantics, and supported environments unless the user requests a change.
- Use incremental, coherent slices. Keep the app buildable and reviewable after each migration batch when the project permits it.
- Prefer TypeScript as the target. Retain JavaScript only when migration cost or project constraints justify it, and record the boundary.
- Preserve user changes and avoid destructive Git operations. Do not edit generated/vendor files unless they are the actual source of truth.
- Treat the boilerplate as a maintained standard, not a file-copy exercise. Do not propagate placeholders, dead dependencies, duplicate source trees, or documentation for capabilities that do not exist.

## Migration workflow

1. Inventory the current system and record baseline commands and failures.
2. Produce a current-to-target map for folders, routes, state, API modules, and shared UI. Identify risky seams and circular dependencies.
3. Choose a migration sequence with explicit acceptance criteria. For large projects, start with `app`, route-level `pages`, and truly generic `shared`, then extract reused entities, features, and widgets from real usage.
4. Establish cross-cutting foundations: source alias, strictness policy, line endings, lint/format checks, test projects, API configuration, and environment handling.
5. Move one coherent business or route slice at a time. Add a public API, update imports, run focused checks, and remove obsolete code only after consumers have moved.
6. Normalize auth, server state, and client state without changing backend contracts. Make loading, error, refresh, and logout behavior explicit.
7. Enforce boundaries mechanically where the project supports it. Fix violations based on ownership, not by hiding them with broad exceptions.
8. Run focused checks after each batch and the full validation suite at the end. Review the diff for accidental behavior changes and stale files.
9. Deliver a concise migration report: completed scope, preserved behavior, checks run, baseline-vs-final status, known risks, and next safe batch.

## Three-stage quality workflow

For implementation work, apply the relevant gates in this order: security, linting, then testing. A stage must report its actual result before the next stage is treated as authoritative. Remote or credentialed scanners are required only when the repository and environment configure them; do not invent tokens, weaken a gate, or claim a skipped scanner passed.

## Stop and ask

Ask for direction when a choice would materially change behavior, public contracts, framework, authentication strategy, supported browsers, package manager, deployment platform, or the amount of legacy code removed. Do not ask about choices that can be discovered from the repository or safely preserved.

## Completion criteria

Complete only the requested scope. Its boundaries must be explainable, critical behavior must remain covered, line endings must be deterministic, relevant checks must pass or have documented pre-existing failures, and documentation must match reality. For a multi-stage migration, finish a coherent batch and provide the next dependency-ordered batch rather than leaving the repository between architectures.
