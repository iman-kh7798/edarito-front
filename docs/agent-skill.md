# Kavano Frontend Agent Skill

This repository contains the Kavano Frontend Agent Skill used to assess and migrate React projects toward the Kavano Vite, TypeScript, and Feature-Sliced Design standard.

The repository also ships a pinned `feature-slicing` companion and focused `semgrep-security` and `sonarqube-analysis` skills. The Kavano skill orchestrates the three-stage security, linting, and testing workflow.

## Using the skill in this boilerplate

After cloning and installing the project normally, restart the coding-agent session so it refreshes repository instructions.

No separate skill download is required:

- Codex/OpenAI-compatible repository agents use `.agents/skills/kavano-frontend-agent-skill/SKILL.md` and `AGENTS.md`.
- Claude Code discovers `.claude/skills/kavano-frontend-agent-skill/SKILL.md`.

The companion skills use the same adapter layout. Canonical sources live under `agent-skills/`; the `.agents/` and `.claude/` files remain thin pointers.

Example prompts:

```text
$kavano-frontend-agent-skill assess this project and report architecture gaps. Do not edit files.
```

```text
$kavano-frontend-agent-skill plan an incremental migration of the authentication flow.
```

```text
$kavano-frontend-agent-skill migrate only the dashboard route, preserve behavior, and run focused tests.
```

The skill may also activate automatically when a request clearly asks for legacy modernization, FSD migration, boundary cleanup, or auth/API normalization.

## Using the skill in an older project

Clone this boilerplate repository, then copy the complete canonical skill—not the thin repository adapter—into the older project.

For Codex/OpenAI-compatible repository agents:

```bash
mkdir -p /path/to/older-project/.agents/skills
cp -R agent-skills/kavano-frontend-agent-skill \
  /path/to/older-project/.agents/skills/
```

For Claude Code:

```bash
mkdir -p /path/to/older-project/.claude/skills
cp -R agent-skills/kavano-frontend-agent-skill \
  /path/to/older-project/.claude/skills/
```

Commit the copied skill in the older project if every developer and CI agent should use the same reviewed version. Install it in a personal agent directory only when it is an individual developer preference.

## Updating the skill

1. Edit `agent-skills/kavano-frontend-agent-skill/`.
2. Update `VERSION` according to `references/maintenance.md`.
3. Run the package validator and project checks.
4. Regenerate the optional ZIP.
5. Commit the canonical source, adapters, and documentation.
6. Create a reviewed Git tag and update the GitLab wiki page.

Never distribute an unreviewed third-party FSD or testing skill across Kavano. Review and pin companion skills before adding them to the Kavano workflow.

## Official references

- [OpenAI Skills API](https://developers.openai.com/api/reference/python/resources/skills/methods/create)
- [GitLab project wiki](https://docs.gitlab.com/user/project/wiki/)
- [GitLab project wikis API](https://docs.gitlab.com/api/wikis/)
- [GitLab release assets](https://docs.gitlab.com/user/project/releases/release_fields/)
