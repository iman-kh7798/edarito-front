---
name: semgrep-security
description: Configure and run Semgrep source security analysis, or triage Semgrep findings, in JavaScript and TypeScript repositories. Use for Semgrep CLI, rulesets, CI jobs, suppressions, and scan-result review; do not use as a substitute for dependency or runtime scanning.
---

# Semgrep Security

Use Semgrep as pattern-based SAST. Preserve the repository's security policy and CI provider conventions.

## Workflow

1. Inspect the source languages, existing Semgrep config, CI triggers, ignore files, generated paths, and baseline status.
2. Choose the operating mode explicitly:
   - Semgrep CE: `semgrep scan --config auto --error .` for a broad bootstrap, or reviewed local/ruleset configs for repeatable policy.
   - Semgrep AppSec Platform: `semgrep ci` only when `SEMGREP_APP_TOKEN` and repository onboarding already exist.
3. Scan source, not generated output or dependencies. Keep exclusions narrow and aligned with `.gitignore` unless generated code requires an explicit exception.
4. Validate every reportable finding against the source and reachable application path. Record rule ID, source, sink, impact, confidence, and remediation.
5. Suppress only demonstrated false positives. Prefer a scoped rule-path exclusion; use `nosemgrep` only on the exact line with a durable reason.
6. Re-run the same command after a fix and report the actual exit status. Do not claim other scanners passed.

Never add or expose tokens, upload source to a service without authorization, silently disable telemetry policy, or weaken failure behavior to make CI green.

Official references:

- https://semgrep.dev/docs/semgrep-ci/sample-ci-configs
- https://semgrep.dev/docs/cli-reference
