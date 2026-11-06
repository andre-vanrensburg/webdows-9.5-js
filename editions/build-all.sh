#!/usr/bin/env bash
# Builds every framework edition into /react, /vue, /svelte and /angular at the site root.
set -euo pipefail
cd "$(dirname "$0")"
(cd core && npx -y tsx test/minesweeper.test.ts)
for ed in react vue svelte; do (cd "$ed" && npm ci --silent && npm run build); done
(cd angular && npm ci --silent && npx ng build)
