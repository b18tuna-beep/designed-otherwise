#!/usr/bin/env bash
# Copy small preview files (audio samples, frame grabs, contact sheets, json) to the orphan
# "previews" branch so Claude can fetch them with git. Never use for full videos or music.
# Retries, because parallel jobs publish at the same time.
# Usage: tools/publish_preview.sh <dest-folder-on-branch> <file>...
# Target: PREVIEW_REPO with PREVIEW_TOKEN (the workflows here point it at the private studio repo
# through tools/ci/studio.sh), falling back to this repo with GITHUB_TOKEN.
set -euo pipefail
dest="$1"; shift
files=()
for f in "$@"; do files+=("$(realpath "$f")"); done
repo="${PREVIEW_REPO:-$GITHUB_REPOSITORY}"
token="${PREVIEW_TOKEN:-${GITHUB_TOKEN:?no token for previews}}"
repo_url="https://x-access-token:${token}@github.com/${repo}.git"
for attempt in 1 2 3 4 5 6; do
  work=$(mktemp -d)
  if git ls-remote --exit-code --heads "$repo_url" previews >/dev/null 2>&1; then
    git clone -q --depth 1 --branch previews "$repo_url" "$work"
  else
    git init -q "$work"
    git -C "$work" checkout -q --orphan previews
    git -C "$work" remote add origin "$repo_url"
  fi
  mkdir -p "$work/$dest"
  cp "${files[@]}" "$work/$dest/"
  git -C "$work" config user.name "designed-otherwise bot"
  git -C "$work" config user.email "noreply@github.com"
  git -C "$work" add -A
  git -C "$work" commit -q -m "Preview: $dest"
  if git -C "$work" push -q origin HEAD:previews; then
    echo "Published ${#files[@]} file(s) to $repo previews:$dest"
    exit 0
  fi
  echo "push collided, retrying ($attempt)"
  sleep $((attempt * 4 + RANDOM % 5))
done
echo "could not publish previews" >&2
exit 1
