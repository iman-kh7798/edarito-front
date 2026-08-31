# OpenAI and Anthropic Distribution

The canonical artifact is the complete `kavano-frontend-agent-skill/` directory. Keep `SKILL.md`, `references/`, `scripts/`, and `agents/openai.yaml` together.

For Kavano ownership, releases, and behavioral evaluations, use [maintenance.md](maintenance.md).

From the skill directory, run `bash scripts/package_skill.sh` to produce a clean sibling zip with `SKILL.md` at the archive root. Pass an output path as the first argument when release automation needs a different destination.

## OpenAI

### Codex

Install the directory into the user's Codex skills directory, normally `$CODEX_HOME/skills/kavano-frontend-agent-skill` or `~/.codex/skills/kavano-frontend-agent-skill` when `CODEX_HOME` is unset. Restart the relevant session so skill discovery refreshes.

`agents/openai.yaml` provides optional Codex UI metadata. Keep its display name, short description, and default prompt aligned with `SKILL.md`.

### OpenAI API agents

The OpenAI Skills API accepts the skill as a directory upload or a single zip archive. Upload the directory contents with `SKILL.md` at the skill root. Version releases rather than mutating a published artifact without review.

Official reference: `https://developers.openai.com/api/reference/python/resources/skills/methods/create`

## Anthropic

### Claude Code

For a project-scoped skill, place the complete directory at:

```text
.claude/skills/kavano-frontend-agent-skill/SKILL.md
```

For a personal skill, use:

```text
~/.claude/skills/kavano-frontend-agent-skill/SKILL.md
```

Claude Code discovers custom skill directories automatically. Keep the skill exactly one directory below `.claude/skills` for repository discovery.

### Claude API, managed agents, and claude.ai

Upload the complete custom-skill directory as a zip or as the supported collection of files, then attach the returned skill identifier according to the product's current API. For claude.ai, custom skill uploads are user-scoped; verify current Team/Enterprise governance before treating them as centrally managed Kavano policy.

Official references:

- `https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview`
- `https://platform.claude.com/docs/en/managed-agents/skills`

## Portable release checklist

- `SKILL.md` is at the archive root and contains valid `name` and `description` frontmatter.
- The name is lowercase kebab-case, no longer than 64 characters, and contains no vendor-reserved words.
- The description says what the skill does and when to use it.
- All relative reference/script links resolve with exact case.
- No secrets, local absolute paths, generated reports, or repository-specific credentials are included.
- Scripts are read-only unless their mutation is the explicit purpose, validate their target paths, and use LF endings.
- The OpenAI validator passes.
- A clean-room dry run on a representative legacy repository produces a useful plan without changing files when asked only to assess.
- Release notes record Kavano-standard changes and companion-skill compatibility.
