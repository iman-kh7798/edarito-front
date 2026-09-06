# Security And Audit

This boilerplate uses separate scanners for separate risk classes. GitLab runs them in the first of three ordered pipeline stages.

## Local Audit

Run:

```bash
npm run audit
```

The command uses `npm audit --audit-level=moderate`. Treat high and critical vulnerabilities as release blockers unless there is a documented false positive.

## Security Stage

- `npm audit` checks the resolved Node dependency graph.
- Semgrep CE runs `semgrep scan --config auto --error` for source-level patterns.
- Trivy scans dependencies, committed secrets, and supported configuration files; high and critical findings fail the job.
- SonarQube runs its server-managed quality gate when `SONAR_TOKEN`, `SONAR_HOST_URL`, and `SONAR_PROJECT_KEY` are configured.

These tools are complementary. A pass from one does not replace the others.

## CI Audit

GitLab runs the security jobs before linting and testing. Semgrep and Trivy use their official container images. SonarQube is explicitly skipped until all three required protected CI variables exist; a skipped job is not a passing analysis.

For scanner configuration or finding triage, use the repository skills:

- `agent-skills/semgrep-security/`
- `agent-skills/sonarqube-analysis/`

## Dependency Hygiene

- Prefer small, actively maintained packages.
- Avoid adding dependencies for features available in the platform.
- Remove packages when removing the feature that needed them.
- Keep lockfile changes reviewed.
- Run `npm run validate:all` before release branches.

## Secrets

- Do not commit `.env` files.
- Store GitLab secrets in protected, masked CI/CD variables.
- Do not bake secrets into Docker images.
- Use runtime configuration for environment-specific values.
