# Huge expert maps — 14 October 2026

The original clue set and answer audit below are historical. The user’s subsequent clarity correction is recorded in [the direct-search revision](clarity/RELEASE.md).

Deployed and verified in the standalone [Hidden Atlas](https://ikarus-eth.github.io/Blitzword_app/assets/map-quest/).

Two new 6144×4096 maps, **The Clockwork Harbour** and **The Archive Beneath the World**, each have six expert riddles with six written answer choices. They appear first in the picker, alongside all five existing maps. All twelve riddles, choices and optional hints have German translations. These are designed for substantially harder observation: cryptic landmark clues, multi-location comparison, constrained counting, ordered colours and a clock calculation. Difficulty has not been measured with adult players.

## Art and delivery

The user explicitly approved assembling separately generated detail sections with image-processing tools. Built-in ImageGen produced two 1536×1024 base compositions and sixteen overlapping 1536×1024 detail passes per map. Registration, local edge alignment and feather blending fit them to 6144×4096. The passes are fitted to 1728×1152 placements; this is an assembled 6K canvas, not native single-pass 6K generation. Both continuous panoramas and final answer crops were visually inspected. [Exact prompts, dimensions, source hashes and assembly transforms](prompts.json); [assembly procedure](assemble.py).

Production maps use full-resolution quality-94 WebP; 768×512 thumbnails keep the picker from loading both full-size maps. Expert maps allow 24× zoom; classic maps and main-game searches retain their 8× maximum. The shared viewer change is an optional parameter with the old default. Picture taps do not submit answers. Zoom and position remain stable during answer selection and next-clue navigation.

## Rules and saves

The core and UI derive completion, retry, replay, validation and progress labels from each map’s question count. All original map IDs, content and the `blitzword.hidden-atlas.v1` key remain. Existing three-clue completions remain complete; new six-clue saves survive the fourth, fifth and sixth riddles. Four lives per map, one life per wrong confirmed answer, solved-riddle retention at zero lives, explicit retry, optional hints and replay remain. Main learner saves, XP, curriculum and main-game quest data are untouched. Standalone expert data is loaded only by this page.

## Final-image answer audit (spoilers)

Coordinates below refer to the 1536×1024 overview; multiply by four for the production image. Audit crops come from the final exported WebPs, not the generation prompts.

| Map / riddle | Visible evidence | Answer |
| --- | --- | --- |
| Harbour 1 | Red-hatted fiddler on steps near (585,895); pink-clad flautist at snail fountain near (1380,900) | Violin, then flute |
| Harbour 2 | Standing musician in small boat near (870,750), beneath elephant-side bridge | Curved brass wind instrument |
| Harbour 3 | One gull on lifting beam near (83,570), two on market awnings near (295,638) and (384,665); flying birds and globe bird excluded | Three |
| Harbour 4 | Near blue banner by wheel and pink canopy near (808,390), with wings, feet and curling tail | Winged dragon |
| Harbour 5 | Group of three short terracotta chimney pots near (1505,213); tall brick chimneys excluded | Three |
| Harbour 6 | Tiny gold bird ornament on vessel beside fiddler’s steps near (536,944) | Little bird |
| Archive 1 | Two owls outside helmet on its gallery; three passengers inside gold lift beside tortoise | Five |
| Archive 2 | Thick hands on fish clock near (314,322) show 10:00; two hours earlier | Eight o’clock |
| Archive 3 | Red parrot on suspended perch near (1250,370); large terrestrial globe on gallery above | Parrot and globe |
| Archive 4 | Four book spines in front stack between red chair and lantern near (240,870); rear stack excluded | Four |
| Archive 5 | Narrow glass cylinder on lower workbench near (1083,984) | Blue, then yellow |
| Archive 6 | Small owl on railing between spiral stair and wall lamp near (998,648), above lower skeleton | Owl |

[Harbour answer evidence](clockwork-harbour-answer-details.jpg) · [Archive answer evidence](underground-archive-answer-details.jpg).

## Verification

418 unit/backend tests and 123 UI-flow groups passed. New coverage verifies six-riddle save restoration, completion only after six, retry after five solved riddles, replay, German coverage, and preserved classic maps. Sixteen browser journeys passed across English/German and four viewports (1180×820, 390×844, 844×390 and 1024×768): all answers, final image dimensions, 24× zoom, one-life penalties, zero-life retry, reload after the third clue, replay, complete-save restoration, translations and preserved classic/main saves. [Browser evidence](browser-checks.json). Expanded-view/answer-navigation checks and classic three-clue completion also pass at 390, 844 and 1024 pixels; classic zoom remains capped at 8×. Long pinned clues remain scrollable so expanded maps retain usable space. Deployment verification follows below. Physical iPad/Safari and adult playtesting remain unverified.

## Deployment

With explicit user approval, [PR #194](https://github.com/Ikarus-eth/Blitzword_app/pull/194) merged as `616484d51d4ad963a0df67c15857d96585d92d40`. [Pages run 38555664622](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38555664622) succeeded. All twelve public runtime/art files returned HTTP 200 and SHA-256 hashes matching the merged source. [Deployment evidence](DEPLOYMENT.json).

All sixteen expert browser journeys also passed against the public URL: both maps, both languages, four viewports, every riddle, 24× zoom, retry/replay and save preservation. [Live browser evidence](live-checks.json).
