# Repository Agent Instructions

This repository is the Kavano frontend boilerplate and the reference implementation for the Kavano frontend architecture.

For architecture work, legacy-project modernization, Feature-Sliced Design migrations, layer or public-API decisions, auth/API normalization, and migration planning, use the repository skill at `.agents/skills/kavano-frontend-agent-skill/SKILL.md`.

For FSD layer, slice, segment, and public-API decisions, also use the pinned companion skill at `.agents/skills/feature-slicing/SKILL.md`. The Kavano standard wins if the two skills differ.

For Semgrep or SonarQube configuration and finding triage, use `.agents/skills/semgrep-security/SKILL.md` or `.agents/skills/sonarqube-analysis/SKILL.md`, respectively.

Treat `agent-skills/kavano-frontend-agent-skill/` as the canonical skill source. The `.agents/skills/` and `.claude/skills/` files are repository-local adapters and must remain thin pointers to the canonical package.

`src/` is the only application source (strict TypeScript). Preserve unrelated working-tree changes and run the relevant checks, with `npm run validate` as the full local validation command.
