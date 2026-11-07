#!/usr/bin/env bash
# Builds every framework edition into /react, /vue, /svelte and /angular at the site root.
set -euo pipefail
cd "$(dirname "$0")"
(cd core && npx -y tsx test/minesweeper.test.ts)
# The vanilla site uses a plain-JS build of the shared Shut Down dialog
npx -y esbuild core/src/shutdown.ts --bundle --format=iife --global-name=WebdowsShutdown --target=es2017 --outfile=../js/shutdown.js --log-level=warning
for ed in react vue svelte; do (cd "$ed" && npm ci --silent && npm run build); done
(cd angular && npm ci --silent && npx ng build)
