# Dragon path — 10 October 2026

A standalone reading/search mini-game at `assets/wimmelbild/`, reachable from **Dragon path** on the creature-campaign chapter home and the original Word-trails map.

## The journey

1. Harbour: read the order and choose the big tree as the first destination.
2. Tree village: combine red door, white owl and gold bell. Similar doors have a raven or a lantern instead.
3. Dragon valley: distinguish red/pink scales, black stripes and a long tail from dragons with short tails, white spots or blue scales.
4. Castle treasury: combine green chest, gold moon, open red book and white cat below. The other chests have a star or a closed book.

Each correct confirmed choice opens the next scene automatically. Wrong choices keep the same scene and explain which attribute to recheck. Written options and measured picture hotspots select the same candidates; no answer is submitted by panning/pinching. There is no timer, health loss, XP grant or change to main learning evidence. Scenes are visually richer and targets generally smaller, rather than increasing decoding difficulty steeply. Instructions and options remain ordinary HTML, never baked into the artwork.

## Access and support

- Portrait stacks picture and clue; landscape keeps both visible side by side.
- Pinch, drag, mouse wheel, +/−, reset-to-fit, and arrow-key pan. Magnification is bounded at 1–5×; zoom preserves its focal point and bounds panning.
- Big picture expands the scene; button or Escape returns to the clue.
- Tap a clue word for device speech and definitions for selected support words. Listen reads the entire clue and question. No paid narration; voice availability is browser-dependent.
- Hints stay optional. No colour alone identifies a selected answer (border, pressed state, marker and confirmation text also change).
- Finished scenes remain visitable, completion survives reload, and replay explicitly resets only this mini-game.

## Save isolation

`blitzword.wimmelbild.v1` stores only this journey. Main learner data is never read or written. Main home saves/suspends before navigation, and refuses navigation on a blocked/failed save. The mini-game reports storage failures and permits an explicitly warned in-memory continuation. Corrupt saves are not overwritten; a confirmed reset is available. Changed saves in another tab block writes until reload. Only a contiguous solved prefix unlocks scenes. The mini-game save is independent and **not included in main-game backups**.

## Artwork

Four built-in ImageGen scenes, native 1536×1024, WebP quality 94 (about 3.7 MB total). Clue features and hit regions checked against actual output. No existing approved cast identity is replaced. Zoom magnifies the native art; it does not provide additional source resolution. See `art-prompts.json` for exact prompts, dimensions and SHA-256 hashes.

## Validation

- 338 unit tests, including journey progression/replay, malformed save handling, hit-region geometry, zoom invariants, standalone UI reload/completion, quota errors and cross-tab overwrite rejection.
- 113 existing/main UI flow groups, including launches from both homes and failed-save navigation rejection.
- Isolated Chrome at 1180×820, 1024×768, 390×844 and 844×390: all four stages, wrong-answer feedback, hints, zoom/reset, expand/collapse, reload, completion and both main-home launches.
- Real browser two-touch events via Chrome DevTools Protocol exercise pinch; a drag must never select an answer. A measured image tap selects the correct door.
- Screenshots inspected for tablet and phone. The reading pane resets to the top on scene changes, and confirmation stays accessible.
- No physical iPad/Safari or human playtest claim. Puzzle enjoyment and duration are not yet measured.

Deployed through the unchanged main → GitHub Pages workflow in PR #150. Pages run 38033694209 succeeded. All 14 live runtime/art files match tested source; `DEPLOYMENT.json` records hashes. `live-browser-checks.json` records the successful live repetition of all four viewport journeys, two-finger zoom and both launchers.
