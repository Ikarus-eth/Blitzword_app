# Continuous River Song search scenes — 10 October 2026

The user accepted the 4096×2731 Crystal Ferry preview as a usable quality reference, then requested four new main-game pictures starting with The Sleeping Waterwheel. This release replaces the ninth-task artwork and twelve clues for `stone-dam`, `mist-lamps`, `high-nest` and `river-heart`. Each is one continuous landscape, with three questions on the same image. The Crystal Ferry preview remains a review asset; its production task is unchanged in this four-chapter release.

## Artwork and clue design

Four coherent base scenes are refined through nine overlapping crops per scene, preserving camera, positions, object identities and counts. Registration and overlapping edge alignment join the detail passes into 4096×2731 images; these are assembled images, not native single-pass 4K output. There are no panel frames or independently composed quadrants. Built-in ImageGen: four base generations plus 36 detailed crop edits. Production WebP exports retain the full dimensions. Exact prompts, source provenance and final hashes are in `river-search-prompts.json` and `river-search-art-manifest.json`.

The maps show a working mill village, misty tree village, dragon sanctuary above waterfalls, and river festival. Questions mix distributed counting, animal behaviour, spatial relationships, tracing a hose or kite string, and finding a pair of animals around a particular nest. Normal clue text gives no map quadrant; optional hints provide a search strategy. Answers include short phrases as well as written numbers and colours. The text is short but is not claimed to use only the original 200 words. Main-game word/clue listening remains available; no recordings were commissioned.

## Integration and progress

The existing ninth step, zoom/pan viewer, written choices and explicit submission remain. Clicking the picture cannot answer. A wrong answer costs exactly one shared quest life; the existing zero-heart retreat and retry rules remain. The four mission IDs and twelve question-slot IDs are retained so already earned first-solve XP cannot be earned again by the new artwork. Previously solved slots and completed chapters remain complete. Replay exposes the new content without duplicating rewards.

A map revision clears only an obsolete pending choice, wrong-choice lock and clue-help flags when loading an older map save. It retains solved slots, answers/history, hearts, XP, quest position and reward records, including a quest parked in Word trails. Once migrated, new pending choices persist on reload normally.

The main game loads `river-search-data.js` after the original shared data. The standalone Hidden Atlas page deliberately keeps its original five images and matching English/German clue set. Its German option is temporary and page-only; this release does not introduce mismatched translations or mutate its independent save.

## Verification

Artwork answer evidence, automated tests, browser results and deployment status are recorded below after checking the final exports. Physical iPad behaviour and child difficulty/enjoyment require actual playtesting.

### Visual answer audit of final 4096×2731 exports

Coordinates below are approximate positions in the 1536×1024 base composition (multiply by 8/3 for the final artwork). Full scenes and selected full-resolution details were inspected after assembly and WebP export.

| Chapter | Clue | Visible evidence | Answer |
| --- | --- | --- | --- |
| Waterwheel | Apple carriers | Squirrels at roof (120,70), orchard (1450,150), bridge (80,640), each with a red apple | Three |
| Waterwheel | Sleeping white cat | Cat inside blue wheelbarrow at (1215,765) | In a blue cart |
| Waterwheel | Trace red hose | Continuous line from pump (710,580) to spray over yellow flowers (985,920) | Yellow flowers |
| Mist | Ribbon birds | White birds at (160,70), (130,500), (1425,115), each holding blue ribbon | Three |
| Mist | Resting fox | Fox (580,450) beneath the curved wooden footbridge | Under a bridge |
| Mist | Clothing in boat | Two distinct green boots beside the net in red boat (830,720) | A pair of boots |
| Nest | Sleeping dragons | Blue at (135,105) and gold at (1350,850), heads resting down; other dragons upright | Two |
| Nest | Striped dragon’s toy | Red/pink, black-striped dragon touching blue ball (1160,430) | A blue ball |
| Nest | Animals near mixed egg nest | Blue birds and squirrels on the rocks around the green/purple egg nest (220,850) | A blue bird and a squirrel |
| River | Red sails | Three boats near (150,130), (1100,410), (810,825) | Three |
| River | Dog’s carried object | Brown dog (1470,725) carries green item; shape is ambiguous, so wording deliberately does not call it a shoe | Green |
| River | Red kite owner | String from kite (1450,50) down to girl in yellow (1335,450); blue kite has a different owner | The girl in yellow |

Counts refer to depicted objects, not intended prompt counts. Optional hints may narrow the search, but the ordinary clue gives no quadrant label. Decorative details are generated illustrations; the inspected clue evidence is what determines the answers.

### Local validation

All 361 unit tests and 116 UI-flow groups pass. Fifteen isolated Chrome journeys complete all five maps at 1180×820, 390×844 and 844×390, checking actual image dimensions, written-only selection, one-life penalties, reload and completion. Real two-finger events, expanded view and retained zoom also pass. Tablet overview and phone zoom screenshots were visually inspected. [Browser evidence](river-search-browser-checks.json). Physical iPad/Safari remain untested. Deployment is verified: [PR #160](https://github.com/Ikarus-eth/Blitzword_app/pull/160), merge `1120d87d2851802f757542ba0ce4c27b0d529a17`, [successful Pages run](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38045792789). All seven runtime/art files returned HTTP 200 and match the tested source byte-for-byte ([hash evidence](RIVER_SEARCH_DEPLOYMENT.json)). The same fifteen map journeys pass on the live site in isolated profiles ([live evidence](river-search-live-checks.json)).


Current standalone update (10 October 2026): the Hidden Atlas now shares the four continuous 4096×2731 River Song maps and their twelve varied questions, with temporary German translations and no voice. Crystal Ferry is unchanged. See [release notes](SHARED_CONTINUOUS_RELEASE.md).
