#!/usr/bin/env bash
set -eu

project_root="${1:-.}"

if [ ! -d "$project_root" ]; then
  printf 'error: project root is not a directory: %s\n' "$project_root" >&2
  exit 2
fi

cd "$project_root"

printf '# Frontend migration baseline\n\n'
printf 'root: %s\n' "$(pwd)"

if [ -f pnpm-lock.yaml ]; then
  printf 'package_manager: pnpm\n'
elif [ -f yarn.lock ]; then
  printf 'package_manager: yarn\n'
elif [ -f bun.lockb ] || [ -f bun.lock ]; then
  printf 'package_manager: bun\n'
elif [ -f package-lock.json ]; then
  printf 'package_manager: npm\n'
else
  printf 'package_manager: unknown\n'
fi

printf '\n## Key files\n'
for candidate in \
  package.json \
  tsconfig.json \
  vite.config.ts \
  vite.config.js \
  eslint.config.js \
  eslint.config.mjs \
  vitest.config.ts \
  playwright.config.ts \
  .gitattributes \
  .editorconfig; do
  if [ -e "$candidate" ]; then
    printf 'present: %s\n' "$candidate"
  else
    printf 'missing: %s\n' "$candidate"
  fi
done

printf '\n## Source layers\n'
for layer in app pages widgets features entities shared; do
  if [ -d "src/$layer" ]; then
    printf 'present: src/%s\n' "$layer"
  else
    printf 'missing: src/%s\n' "$layer"
  fi
done

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  printf '\n## Git status\n'
  git status --short

  printf '\n## Tracked line endings\n'
  git ls-files --eol | sed -n '1,120p'
fi

printf '\n## Package scripts\n'
if [ -f package.json ] && command -v node >/dev/null 2>&1; then
  node -e 'const p=require("./package.json"); for (const [name, command] of Object.entries(p.scripts || {})) console.log(`${name}: ${command}`)'
else
  printf 'unavailable\n'
fi

printf '\n## Migration markers\n'
if command -v rg >/dev/null 2>&1; then
  rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**' --glob '!coverage/**' 'TODO|FIXME|HACK' src 2>/dev/null | sed -n '1,120p' || true
else
  printf 'rg unavailable; inspect TODO/FIXME/HACK markers manually\n'
fi
