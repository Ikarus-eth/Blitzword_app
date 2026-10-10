# Five large chapter maps — 10 October 2026

Implemented for The Crystal Ferry (`crab-ferry`), The Sleeping Waterwheel (`stone-dam`), The Lamps in the Mist (`mist-lamps`), The Nest Above the Falls (`high-nest`) and The River Sings Again (`river-heart`). Each adds a ninth task after its fourth fight/clue pair. Three successive reading questions share one large map, with written answer buttons below the picture. Each wrong submitted answer costs one shared life. Tapping or dragging the picture cannot select an answer; this also applies to the original standalone Dragon path.

## Artwork and reading

Five 3072×2048 WebP maps each combine four independently generated native 1536×1024 sections without enlarging the source pixels. The user explicitly approved this assembly method after the generator returned 1536×1024 for a 4K request. Fine atlas dividers separate the sections. All 20 sections were visually reviewed; [prompts and source hashes](ninth-art-prompts.json), [delivered dimensions and hashes](ninth-art-manifest.json).

Three regions contain closely matching candidates and the fourth adds exploration detail. Each clue requires combining object attributes and then reading a separate answer below. At whole-map scale, small books, flags, cats, marks and containers require closer inspection; pinch, drag, wheel, keyboard and buttons provide up to 8× zoom. Big picture expands the viewer. Choosing an answer never marks or centres an object. Zoom/pan remain through questions and answer selection; reopening preserves question progress but resets the camera. Word listening, whole-clue listening and optional hints remain available. Questions are short, but not claimed to be strictly within the original 200-word vocabulary.

Visual answer audit, using coordinates within each 1536×1024 source section:

| Map / section | Evidence inspected | Answer |
| --- | --- | --- |
| Ferry / upper left | Left ferry: moon sail, two red pennants, chest at (275,471) | Green |
| Ferry / upper right | Second central stall: white owl, gold bell, yellow pears | Blue roof |
| Ferry / lower left | Closed moon chest, red rope, bottle at (718,563) | Blue |
| Waterwheel / upper left | Green door, moon, two pots of red flowers, hut at (575,230) | Blue roof |
| Waterwheel / upper right | Open blue book and gold bell on third workbench | Red jug |
| Waterwheel / lower left | Left moon gate with white cat, flags at (300,347) and (360,349) | Two |
| Mist / upper left | Upper-left red door, white owl, gold bell, no red lamp | Green roof |
| Mist / upper right | Upper-right landing, one gold bell, white cat | Red boat |
| Mist / lower left | Right moon stand, closed blue book | Yellow lantern |
| Nest / upper left | Upper-left red/pink striped dragon has long curling tail | Green crystal |
| Nest / upper right | Upper-left white bird with two blue eggs | Red flag |
| Nest / lower left | Third intact basket, red rope under gold star | Blue book |
| River / upper left | Right blue-wave gate with two red lamps | Yellow lever handle |
| River / upper right | Upper-left moon chest, open red book, white cat | Blue flag |
| River / lower left | Left moon tower with two blue flags | Three bells |

## Saves, health and rewards

Active eligible quests adopt the ninth step. Already completed old quests remain complete; an explicit replay includes the map. Other seven quests retain eight steps. All five maps use the main learner save and backup. Correct map questions use the existing first-solve riddle reward (50 XP, or 88 boosted) and capped foreground riddle-thinking time. Replay cannot earn duplicate XP. No answer reveal is provided.

Wrong submissions deduct exactly one life; the submitted wrong choice is locked until another explicit selection. Duplicate callbacks and stale question IDs cannot charge again or answer the next question. Zero lives opens the existing defeat screen and retries from tracker step seven (the last fight), two steps back. Solved map questions and earned evidence survive that retreat, backup, Word-trails switching and reload.

## Validation

All 351 unit tests and 114 UI flow groups pass on the combined branch. Automated checks cover the complete campaign, all five three-question maps, wrong/duplicate/stale submissions, zero-life retreat, backup/reload, legacy switching, older completion migration, first-solve XP, thinking-time caps, and UI save failures. Browser checks use isolated test learners, all five maps at tablet, phone portrait and phone landscape sizes, genuine two-touch events, picture taps, written choices, reload and completion. [Browser evidence](ninth-browser-checks.json).

Physical iPad interaction and child difficulty/enjoyment have not been tested. [PR #154](https://github.com/Ikarus-eth/Blitzword_app/pull/154) deployed successfully through [Pages run 38038030658](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38038030658). [All fourteen checked live files match](NINTH_DEPLOYMENT.json), and the [live browser checks](ninth-live-checks.json) complete every map at all three screen sizes.
