# AGENTS.md

Vanilla HTML5 canvas Asteroids clone. No framework, bundler, dependencies, tests, or lint config.

## Run

Open `index.html` in a browser, or `npx serve .` and visit `http://localhost:3000`. There is no build step; edit files and reload.

## Layout

- `index.html` — canvas (`800x600`), inline CSS, loads `game.js` as a classic script (not a module).
- `game.js` — entire game, one file, runs in global scope.
- `README.md` — user-facing docs, in Spanish.

## Facts an agent will miss

- `W`/`H` are hardcoded in both `index.html` (canvas attrs) and `game.js` (constants). Change both together or rendering breaks.
- `game.js` executes immediately: top-level `initGame()` and `requestAnimationFrame(loop)` at the bottom. There is no `main()` or export.
- Loop is `requestAnimationFrame` with `dt` clamped to `0.05`; all motion is dt-based. Never move objects by fixed pixels per frame.
- Space is toroidal: use the `wrap(v, max)` helper for any position update.
- `pressed(code)` is a one-shot key read that clears `justPressed`. Use it for discrete events (shoot, restart). Use `keys[code]` for held state (rotation, thrust).
- Game state machine is the `state` variable: `'playing' | 'dead' | 'gameover'`. `update()` early-returns for non-playing states; add new per-state logic in those branches, not the shared body.
- Asteroids are sized `1`–`3`; `RADII`, `SPEEDS`, `POINTS` are indexed by size. `split()` only produces children for `size > 1`.
- UI strings are Spanish (`NIVEL`, `PUNTAJE`). Keep that when adding HUD text.

## Stale docs

`README.md` advertises power-ups and a "estrella fugaz" asteroid type. Neither exists in `game.js`; treat the README as aspirational, not a spec.
