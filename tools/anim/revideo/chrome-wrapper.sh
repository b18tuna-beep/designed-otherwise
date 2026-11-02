#!/usr/bin/env bash
# Revideo always adds --single-process, which crashes current Chrome builds in
# headless Linux. This wrapper drops that one flag and runs the real Chrome.
args=()
for a in "$@"; do [ "$a" = "--single-process" ] || args+=("$a"); done
exec "${REAL_CHROME:?set REAL_CHROME to the Chrome binary}" "${args[@]}"
