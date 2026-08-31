# Repository Agent Instructions

This repository is the Kavano frontend boilerplate and the reference implementation for the Kavano frontend architecture.

For architecture work, legacy-project modernization, Feature-Sliced Design migrations, layer or public-API decisions, auth/API normalization, and migration planning, use the repository skill at `.agents/skills/kavano-frontend-agent-skill/SKILL.md`.

Treat `agent-skills/kavano-frontend-agent-skill/` as the canonical skill source. The `.agents/skills/` and `.claude/skills/` files are repository-local adapters and must remain thin pointers to the canonical package.

Use `src/` as the canonical TypeScript application unless a task explicitly targets `src-js/`. Preserve unrelated working-tree changes and run the relevant checks, with `npm run validate` as the full local validation command.
