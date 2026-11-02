#!/usr/bin/env bash
# Hand results to the PRIVATE studio repo, the only place rendered media lives.
# This public repo never keeps finished videos, narration, music or hero clips: not in
# commits, not on a previews branch here, not as run artifacts. Everything goes to the studio.
#
# Needs env STUDIO_TOKEN (fine-grained token, contents read/write on the studio repo). Never printed.
# STUDIO_REPO overrides the target (default b18tuna-beep/designed-otherwise-studio).
#
# Usage:
#   tools/ci/studio.sh release <tag> <file>...            create the release if needed (prerelease) and upload/replace files
#   tools/ci/studio.sh fetch <tag> <dest-dir> [pattern]   download release assets (optionally only those matching pattern)
#   tools/ci/studio.sh drop <tag> <asset-name>...         delete assets from a studio release (temporary chunks)
#   tools/ci/studio.sh preview <dest> <file>...           small previews onto the studio `previews` branch
set -euo pipefail
STUDIO_REPO="${STUDIO_REPO:-b18tuna-beep/designed-otherwise-studio}"
if [ -z "${STUDIO_TOKEN:-}" ]; then
  echo "::error title=STUDIO_TOKEN::secret missing; results cannot be handed to $STUDIO_REPO" >&2
  exit 1
fi
export GH_TOKEN="$STUDIO_TOKEN"
here="$(cd "$(dirname "$0")" && pwd)"
cmd="${1:?release|fetch|drop|preview}"; shift

case "$cmd" in
  release)
    tag="$1"; shift
    gh release view "$tag" -R "$STUDIO_REPO" >/dev/null 2>&1 || \
      gh release create "$tag" -R "$STUDIO_REPO" --title "$tag" --notes "Rendered by ${GITHUB_REPOSITORY:-designed-otherwise} run ${GITHUB_RUN_ID:-local}. Private." --prerelease >/dev/null
    gh release upload "$tag" -R "$STUDIO_REPO" "$@" --clobber
    echo "studio release $tag: $(for f in "$@"; do basename "$f"; done | tr '\n' ' ')"
    ;;
  fetch)
    tag="$1"; dest="$2"; pat="${3:-}"
    mkdir -p "$dest"
    if [ -n "$pat" ]; then
      gh release download "$tag" -R "$STUDIO_REPO" -D "$dest" -p "$pat" --clobber
    else
      gh release download "$tag" -R "$STUDIO_REPO" -D "$dest" --clobber
    fi
    ;;
  drop)
    tag="$1"; shift
    for a in "$@"; do gh release delete-asset "$tag" "$a" -R "$STUDIO_REPO" --yes || true; done
    ;;
  preview)
    PREVIEW_REPO="$STUDIO_REPO" PREVIEW_TOKEN="$STUDIO_TOKEN" bash "$here/../publish_preview.sh" "$@"
    ;;
  *)
    echo "unknown command $cmd" >&2; exit 1 ;;
esac
