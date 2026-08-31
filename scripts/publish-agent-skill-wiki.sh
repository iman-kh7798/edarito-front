#!/usr/bin/env bash
set -eu

apply=false
if [ "${1:-}" = "--apply" ]; then
  apply=true
elif [ "$#" -gt 0 ]; then
  printf 'usage: %s [--apply]\n' "$0" >&2
  exit 2
fi

: "${GITLAB_URL:?Set GITLAB_URL to the self-managed GitLab base URL}"
: "${GITLAB_PROJECT_ID:?Set GITLAB_PROJECT_ID to the numeric project ID}"
: "${GITLAB_TOKEN:?Set GITLAB_TOKEN to a token allowed to update the project wiki}"

case "$GITLAB_PROJECT_ID" in
  *[!0-9]*)
    printf 'error: GITLAB_PROJECT_ID must be numeric\n' >&2
    exit 2
    ;;
esac

if ! command -v curl >/dev/null 2>&1; then
  printf 'error: curl is required\n' >&2
  exit 2
fi

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repository_root=$(dirname -- "$script_dir")
source_file="$repository_root/docs/wiki/kavano-frontend-agent-skill.md"
wiki_slug="kavano-frontend-agent-skill"
wiki_title="Kavano Frontend Agent Skill"
api_base="${GITLAB_URL%/}/api/v4/projects/$GITLAB_PROJECT_ID/wikis"

if [ ! -f "$source_file" ]; then
  printf 'error: wiki source is missing: %s\n' "$source_file" >&2
  exit 2
fi

printf 'GitLab: %s\n' "${GITLAB_URL%/}"
printf 'project: %s\n' "$GITLAB_PROJECT_ID"
printf 'wiki page: %s\n' "$wiki_slug"
printf 'source: %s\n' "$source_file"

if [ "$apply" != true ]; then
  printf 'dry run only; rerun with --apply to create or update the wiki page\n'
  exit 0
fi

status_code=$(curl \
  --silent \
  --output /dev/null \
  --write-out '%{http_code}' \
  --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "$api_base/$wiki_slug")

case "$status_code" in
  200)
    request_method="PUT"
    request_url="$api_base/$wiki_slug"
    ;;
  404)
    request_method="POST"
    request_url="$api_base"
    ;;
  *)
    printf 'error: GitLab returned HTTP %s while checking the wiki page\n' "$status_code" >&2
    exit 1
    ;;
esac

curl \
  --fail \
  --silent \
  --show-error \
  --request "$request_method" \
  --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  --data-urlencode "title=$wiki_title" \
  --data-urlencode "content@$source_file" \
  --data "format=markdown" \
  "$request_url" >/dev/null

printf 'published wiki page: %s\n' "$wiki_slug"
printf 'open the project in GitLab and go to Plan > Wiki to view it\n'
