# Security And Audit

This boilerplate includes a baseline audit workflow for dependencies and CI.

## Local Audit

Run:

```bash
npm run audit
```

The command uses `npm audit --audit-level=moderate`. Treat high and critical vulnerabilities as release blockers unless there is a documented false positive.

## CI Audit

GitLab runs the `audit` job after install. The job fails when npm reports vulnerabilities at or above the configured audit level.

## Dependency Hygiene

- Prefer small, actively maintained packages.
- Avoid adding dependencies for features available in the platform.
- Remove packages when removing the feature that needed them.
- Keep lockfile changes reviewed.
- Run `npm run validate:all` before release branches.

## Secrets

- Do not commit `.env` files.
- Store GitLab secrets in CI/CD variables.
- Do not bake secrets into Docker images.
- Use runtime configuration for environment-specific values.
