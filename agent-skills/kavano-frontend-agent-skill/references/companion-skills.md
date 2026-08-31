# Companion Skills

The Kavano Frontend Agent Skill is the policy and migration orchestrator. Companion skills provide specialized methods when they are installed and relevant.

## Feature-Sliced Design

Preferred capability: a trusted FSD/feature-slicing skill aligned with the current Feature-Sliced Design specification.

One discoverable ecosystem option is:

```text
npx skills add https://github.com/ccheney/robust-skills --skill feature-slicing
```

Treat third-party skills as executable instructions: review their full contents and source reputation before Kavano adoption. Do not auto-install this dependency during a project migration. If unavailable, the bundled Kavano frontend standard contains enough FSD guidance to proceed.

## Testing

Use a trusted testing skill when the request includes test migration, test design, browser verification, or flaky-test diagnosis. Useful capability categories include:

- web application testing across unit, integration, and end-to-end levels;
- Playwright best practices for selectors, isolation, fixtures, and CI;
- verification-before-completion workflows.

Prefer official or well-established sources and review all files before installation. The Kavano Frontend Agent Skill still controls scope and acceptance criteria.

## Security

Use security skills only for an explicit security scan, finding validation, fix, or hardening request. Ordinary architecture migration should preserve auth behavior and avoid introducing regressions, but it is not automatically a security audit.

## Design and accessibility

Use Figma/design-to-code skills only when a design source is part of the request. Use accessibility-specific testing or review capabilities when accessibility validation is explicitly requested or when the migration changes interaction semantics.

## Conflict resolution

1. User requirements and repository constraints.
2. Kavano frontend standard and accepted architecture decisions.
3. Specialized companion skill guidance.
4. Generic ecosystem recommendations.

If a companion recommends a different framework, state model, auth contract, or deployment choice, stop and surface the conflict instead of silently broadening the migration.
