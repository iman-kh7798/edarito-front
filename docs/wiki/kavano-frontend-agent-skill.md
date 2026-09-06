---
title: Kavano Frontend Agent Skill
---

# Kavano Frontend Agent Skill

The Kavano frontend boilerplate contains a reusable agent skill for assessing and incrementally migrating legacy React projects to the Kavano Vite, TypeScript, and Feature-Sliced Design standard.

Version 2.1 adds an explicit three-stage quality workflow: security, linting, then testing. The repository also includes a pinned `feature-slicing` companion and focused `semgrep-security` and `sonarqube-analysis` skills.

## Use in the boilerplate

Clone or pull the boilerplate and restart the coding-agent session. No ZIP download is required.

Example:

```text
$kavano-frontend-agent-skill assess this project and create a migration plan only.
```

Codex/OpenAI-compatible agents use `.agents/skills/kavano-frontend-agent-skill/`. Claude Code uses `.claude/skills/kavano-frontend-agent-skill/`. Both point to the canonical source under `agent-skills/kavano-frontend-agent-skill/`.

The companion skills use the same adapter pattern. Kavano policy remains authoritative when the third-party FSD companion differs from a repository convention.

## Use in an older project

Copy the complete canonical directory from the boilerplate:

```bash
mkdir -p /path/to/older-project/.agents/skills
cp -R agent-skills/kavano-frontend-agent-skill \
  /path/to/older-project/.agents/skills/
```

For Claude Code, copy it to `.claude/skills/kavano-frontend-agent-skill` instead.

Commit the copied directory in the older project when the team should share the same pinned version.

## Optional downloadable ZIP

The ZIP is required only for API or GUI uploads. It is not needed for normal repository usage.

Generate it from the boilerplate:

```bash
bash agent-skills/kavano-frontend-agent-skill/scripts/package_skill.sh
```

This creates:

```text
agent-skills/kavano-frontend-agent-skill.zip
agent-skills/kavano-frontend-agent-skill.zip.sha256
```

These are generated release files and should not be committed. Attach them to a reviewed GitLab release when developers need a download.

## Ownership

- Canonical source: `agent-skills/kavano-frontend-agent-skill/`
- Version: `agent-skills/kavano-frontend-agent-skill/VERSION`
- Full developer guide: `docs/agent-skill.md`
- Repository agent policy: `AGENTS.md`

Update the canonical source, validate it, tag the reviewed commit, and then refresh this wiki page.
