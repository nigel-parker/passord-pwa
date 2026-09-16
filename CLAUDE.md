# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A dependency-free, vanilla-JS Progressive Web App with two tabs: a generator for easy-to-remember Norwegian-style passwords, and a read-only overview of physical keys loaded from `nokler.csv`. UI text, README and commit context are in Norwegian. No build step, no package manager.

Live site: https://nigel-parker.github.io/passord-pwa/ (GitHub Pages, served from `master`).

## Running locally

Service workers need HTTPS or localhost, so serve the folder rather than opening `index.html` directly:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
# or
npx serve
```

Tests use Node's built-in runner, no install needed:

```bash
node --test                  # all *.test.js
node --test nokler.test.js   # one file
```

There is no lint. Verify UI changes in a browser (Chrome DevTools > Application tab for service worker/manifest checks).

## Architecture

Load order in `index.html` matters: `passord.js`, `nokler.js`, `app.js`, `nokler-ui.js`. Scripts are plain globals, no modules or imports. `app.js` calls `generateMultiple()` and `nokler-ui.js` calls `parseNokler()`.

- `passord.js` – pure password logic, ported from a Groovy original. A password is `Piece1 + Piece2 + '13---'`, where Piece1 is Consonant(upper)+Vowel+Consonant+Vowel and Piece2 is ConsonantPair+Vowel+Consonant. Consonant/vowel/pair alphabets are hardcoded here.
- `nokler.js` – pure CSV parser (`parseCsv`, `parseNokler`), no DOM access. Wrapped in an IIFE that assigns to `globalThis` in the browser and `module.exports` under Node, so `nokler.test.js` can `require` it. Keep it DOM-free.
- `app.js` – DOM wiring: service worker registration (with auto-reload on `controllerchange`, so a new deploy shows after one load), `beforeinstallprompt` install banner, tab switching (active tab remembered in localStorage), rendering the password list, and click-to-copy with an `execCommand` fallback for iOS/non-HTTPS.
- `nokler-ui.js` – fetches `nokler.csv`, parses it and renders the Nøkler tab.
- `sw.js` – service worker. Cache-first for everything except `nokler.csv`, which is network-first with cache fallback. `urlsToCache` lists every asset to precache.
- `manifest.json` – PWA metadata; the two PNG icons are generated from `icon.svg`.

## Key data: nokler.csv

The key overview is edited by hand in `nokler.csv` and deployed by committing and pushing. Format: header row `navn;beskrivelse`, UTF-8. The delimiter is detected from the header line: semicolon if present (Norwegian Excel default), otherwise comma. A field may be double-quoted, and a quoted field may contain commas, line breaks and `""` for a literal quote. Line breaks inside the description are shown in the app. Rows are displayed in file order. Rows with an empty `navn` are skipped.

Because the service worker fetches this file network-first with `cache: 'no-cache'` (bypassing the browser HTTP cache, since Pages sends `max-age=600`), changing only the CSV does not require a cache bump. The Pages CDN may still serve the old file for up to ten minutes after a push. The repo is served publicly from GitHub Pages, so keep the contents non-sensitive.

## Service worker cache versioning

`CACHE_NAME` in `sw.js` (currently `passord-v6`) must be bumped whenever any cached code asset changes (HTML, CSS, JS, manifest, icons). Those are served cache-first, so without a bump installed clients keep serving the old files. The activate handler deletes all caches whose name differs from `CACHE_NAME`. If you add a new static asset, also add it to `urlsToCache`. Test files are not cached and not loaded by `index.html`.
