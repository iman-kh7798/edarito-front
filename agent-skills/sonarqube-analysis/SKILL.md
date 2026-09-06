---
name: sonarqube-analysis
description: Configure SonarQube analysis and quality gates, or triage SonarQube findings, for frontend repositories. Use for sonar-project.properties, scanner CI jobs, coverage import, quality-gate failures, and GitLab integration; do not use to provision or administer a SonarQube server.
---

# SonarQube Analysis

Integrate a repository with an existing SonarQube Server without changing server-wide policy.

## Workflow

1. Inspect `sonar-project.properties`, source/test roots, exclusions, coverage output, CI triggers, Git depth, and the SonarQube edition/features already available.
2. Keep `SONAR_TOKEN`, `SONAR_HOST_URL`, and environment-specific project keys in protected CI variables. Never commit credentials.
3. Use the official scanner image or the repository's established scanner. In GitLab, set `GIT_DEPTH: "0"`, cache `.sonar/cache`, and run `sonar-scanner -Dsonar.qualitygate.wait=true` when the gate must block merging.
4. Configure only paths that exist. Exclude dependencies, generated output, reports, and intentionally duplicated noncanonical source trees. Import LCOV only when the testing job actually creates it before analysis.
5. For a failure, separate scanner/configuration errors from quality-gate findings. Validate the affected line and rule before changing code or requesting a narrow, documented exception.
6. Re-run analysis and report the project key, commit, gate status, and any skipped coverage or branch/MR feature honestly.

Do not start a local server, change a global quality profile, create tokens, or assume Developer/Enterprise branch features without authorization.

Official reference:

- https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/ci-integration/gitlab-ci-cd
