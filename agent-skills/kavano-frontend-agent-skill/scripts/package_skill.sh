#!/usr/bin/env bash
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
skill_root=$(dirname -- "$script_dir")
default_output="$skill_root/../kavano-frontend-agent-skill.zip"
output_path="${1:-$default_output}"
output_dir=$(dirname -- "$output_path")

if ! command -v zip >/dev/null 2>&1; then
  printf 'error: zip is required to package the skill\n' >&2
  exit 2
fi

if [ ! -f "$skill_root/SKILL.md" ]; then
  printf 'error: SKILL.md is missing from %s\n' "$skill_root" >&2
  exit 2
fi

if [ ! -d "$output_dir" ]; then
  printf 'error: output directory does not exist: %s\n' "$output_dir" >&2
  exit 2
fi

output_dir=$(CDPATH= cd -- "$output_dir" && pwd)
output_file="$output_dir/$(basename -- "$output_path")"
temporary_file="$output_file.tmp.$$.zip"

cleanup() {
  rm -f -- "$temporary_file"
}
trap cleanup EXIT INT TERM

(
  cd "$skill_root"
  zip -qr "$temporary_file" . -x '*.DS_Store'
)

mv -f -- "$temporary_file" "$output_file"
trap - EXIT INT TERM

printf 'created: %s\n' "$output_file"
if command -v sha256sum >/dev/null 2>&1; then
  checksum_file="$output_file.sha256"
  (
    cd "$output_dir"
    sha256sum "$(basename -- "$output_file")" > "$(basename -- "$checksum_file")"
  )
  printf 'checksum: %s\n' "$checksum_file"
  cat "$checksum_file"
fi
