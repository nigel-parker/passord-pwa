# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A dependency-free, vanilla-JS Progressive Web App that generates easy-to-remember Norwegian-style passwords. UI text, README and commit context are in Norwegian. No build step, no package manager, no test runner.

Live site: https://nigel-parker.github.io/passord-pwa/ (GitHub Pages, served from `master`).

## Running locally

Service workers need HTTPS or localhost, so serve the folder rather than opening `index.html` directly:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
# or
npx serve
```

There are no lint or test commands. Verify changes in a browser (Chrome DevTools > Application tab for service worker/manifest checks).

## Architecture

Load order in `index.html` matters: `passord.js` is loaded before `app.js`, and `app.js` calls `generateMultiple()` as a global. There are no modules or imports.

- `passord.js` – pure password logic, ported from a Groovy original. A password is `Piece1 + Piece2 + '13---'`, where Piece1 is Consonant(upper)+Vowel+Consonant+Vowel and Piece2 is ConsonantPair+Vowel+Consonant. Consonant/vowel/pair alphabets are hardcoded here.
- `app.js` – DOM wiring: service worker registration, `beforeinstallprompt` install banner, rendering the password list, and click-to-copy with an `execCommand` fallback for iOS/non-HTTPS.
- `sw.js` – cache-first service worker. `urlsToCache` lists every asset to precache.
- `manifest.json` – PWA metadata; the two PNG icons are generated from `icon.svg`.

## Service worker cache versioning

`CACHE_NAME` in `sw.js` (currently `passord-v3`) must be bumped whenever any cached asset changes (HTML, CSS, JS, manifest, icons). The fetch handler is cache-first, so without a bump installed clients keep serving the old files. The activate handler deletes all caches whose name differs from `CACHE_NAME`. If you add a new static asset, also add it to `urlsToCache`.
