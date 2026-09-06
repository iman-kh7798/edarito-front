# Three-Stage Quality Gates

Use this workflow for CI changes and for implementations whose verification touches security, linting, or tests. Preserve the repository's existing tools when they provide an equivalent maintained gate.

## 1. Security

Run independent checks for independent risk classes:

- `npm audit` checks the resolved dependency graph.
- Semgrep performs pattern-based source analysis. Load the `semgrep-security` companion for configuration or finding triage.
- Trivy scans dependencies, committed secrets, and supported configuration files.
- SonarQube applies the server-managed security and code-quality profile. Load the `sonarqube-analysis` companion for scanner or quality-gate work.

Do not treat one scanner as proof that the others would pass. Remote Semgrep and SonarQube services require their documented tokens and URLs. If credentials are absent, skip only the credentialed job through explicit CI rules and report that it was not run.

Block on confirmed high or critical vulnerabilities by default. Keep narrower severity thresholds or justified false-positive suppressions explicit, local, and reviewable.

## 2. Linting

Run ESLint, Steiger, and the Prettier check. ESLint owns code rules and accessibility checks; Steiger owns FSD structure and public APIs; Prettier owns formatting. Fix ownership violations rather than bypassing them with broad ignores.

Kavano permits focused Steiger exceptions where its documented app-layer organization differs from upstream FSD. Each exception must name the exact rule and explain the repository convention it preserves.

## 3. Testing

Run focused tests first, then the relevant unit and integration projects, production type-check/build, and affected Playwright flows. CI may split these into parallel jobs inside the testing stage.

Coverage is evidence, not a replacement for meaningful assertions. When SonarQube consumes LCOV, generate the report before analysis and keep the configured path synchronized with Vitest.

## Reporting

Report each stage separately with commands and outcomes. Distinguish a pass, a pre-existing failure, a configured skip, and a tool that could not run. Never label the full workflow green when a required stage did not execute.
