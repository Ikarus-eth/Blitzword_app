# Creature campaigns — 3 October 2026

The user approved three changes after the original game lost its novelty: light deduction riddles in the main loop, a persistent collection book, and short fights arranged into missions with meaningful endings. Two new campaigns are the default home after the reading check. Original campaigns remain available as **Word trails**, with their existing progress preserved.

## Playable content

| Campaign | Missions | Story objective |
| --- | --- | --- |
| The Lost Forest Lights | The First Spark; The Moon Post; The Root Workshop; The Owl’s Watch; The Laughing Vault; The Heart of the Oak | Recover six light seeds and wake the old oak. |
| The River That Lost Its Song | The Message in the Reeds; The Crystal Ferry; The Sleeping Waterwheel; The Lamps in the Mist; The Nest Above the Falls; The River Sings Again | Recover six water bells and reopen the river gates. |

Each campaign has a first mission, two branch choices, two later branch choices, and a finale. River song unlocks when all six forest missions are finished. A mission has four short reading fights (8, 9, 10 and 12 successful unaided hits), four authored riddles and one treasure. A loss retries the same encounter without removing prior clues or treasures. An unfinished mission resumes exactly; complete missions can be replayed.

The 48 riddles mix object tracking, two-constraint deduction, spatial clues, action sequencing, number rules and small multi-step arithmetic. Three or four choices replace the former two-picture checks in the default campaign loop. Action puzzles require an ordered sequence. Text stays visible, options shuffle once and keep that order across reopening, and there is no riddle timer. A wrong answer returns to the clues. Listening, a hint and a worked solution (after an attempt) prevent a dead end. First-answer evidence is never replaced by retries or replay. Later help and assisted solutions are recorded separately. Riddle difficulty is authored and increases across the journey; the existing reading-word and flash-pace adaptation continues independently.

The Creature Book contains all 20 current enemy families, with three visible stamps: **discovered** on meeting, **secret learned** after a clue, and **guardian won** after a later challenge. Every stamp is reachable across the two campaigns. Dark silhouettes, location clues and “Find this path” give a reason to explore. A discovered creature can be invited to camp. Collection is deterministic: no random drops, purchases or duplicate grind. New species can be introduced later with new missions and matching approved art.

## Two-hour scope and limits

This is approximately **two hours across both campaigns**, not two hours per campaign or a requirement to play without breaks. There are 48 fights, 468 successful reading hits, 48 riddles and 12 mission endings. At 80% reading accuracy and 8 seconds per answer, reading fights model about 78 minutes; 45 seconds per riddle adds 36 minutes; introductions and treasure transitions at about 30 seconds per mission add 6 minutes: **120 minutes total**. A typical mission is about 10 minutes under those assumptions.

The estimate is a pacing model, not a measured child session or evidence of enjoyment. Faster reading at 90% accuracy/6 seconds and 30-second riddles models about 82 minutes; slower reading at 75%/10 seconds and 75-second riddles models about 170 minutes before defeat retries and longer teaching. There is no minimum time gate or waiting task. Every mission ends with a natural rest point and all intermediate steps save. A child's first sessions are the evidence needed to tune difficulty and duration.

## Save and curriculum compatibility

The main save remains `blitzword_state_v1`, schema version 2. The additive `expedition` object carries mission progress, partial choices, first/last riddle evidence, collection, companion and riddle timing. Switching between missions and Word trails stores the inactive battle/teaching/story/number-duel/session context; XP, word history and adaptive learning are shared. Legacy chapter wins and ten-minute requirements do not advance from mission fights. Historical creature encounters backfill discoveries only; victories and studied stamps are not invented. Backup/restore includes all new progress.

Riddle time is interaction-confirmed separately, up to two minutes per interval, without growth XP or daily-bonus credit. Longer gaps, background time and the final unconfirmed interval on reload are excluded. Parents combines mission-riddle time with the separate Story adventures pilot time while explaining that the old pilot still has its own save. Main reading time and all established learning evidence retain their existing rules.

`content.js` and the original curriculum workbook are unchanged. The optional original multiplication duel remains in Word trails; the new missions use untimed arithmetic inside their clues. Existing small-Pip battle motion, approved enemy animations, hero preference saves, chosen dragon name and evolution rewards remain in place. Mission paintings depict the mage and Small Pip as a fixed illustrated cast; the battle renderer and camp use the learner's earned form.

## Artwork and fal.ai

Twelve integrated 1248×832 story paintings are saved in `assets/adventures/`. They use the selected male mage, Pip B and the approved creature designs as references. Illustrations are shown uncropped inside missions; small map thumbnails may crop. Puzzle-answer information lives in the text/cards or explicit diagrams, not in generated artwork. The collection uses approved battle artwork. [Prompts](art-prompts.json), [request provenance](art-requests.json), [fal.ai setup](../FAL_AI_IMAGES.md).

## Verification

- Full deterministic playthrough of both campaigns: 48 riddles, 468 successful hits, all 20 discoveries/secrets/guardian stamps, no legacy chapter clearing.
- Save/reopen and context-switch checks retain legacy question IDs/choices, partial ordering, first incorrect choices, hints/listening, worked solutions, collection and favourite; backup round-trip retains them.
- Loss/retry, locked paths, independent word progression and separate riddle timing tested.
- Clean `npm ci --ignore-scripts` and `npm test` passed: 289 unit tests and 103 UI flow groups. [Machine-readable checks and hashes](VERIFICATION.json). Existing unit and UI regression suite retained. Older UI cases deliberately select Word trails; new cases cover the default adventure hub and mission flow.
- Browser review uses the isolated, memory-only `tests/review-app.html?scene=mission-hub`, `mission-riddle`, `mission-order` and `mission-complete` fixtures. It does not modify learner storage.
- Tablet landscape (1024×768), tablet portrait (768×1024), and phone (390×844) reviewed. Physical iPad testing and a child's two-hour pacing observation remain unverified.

Deployed through [PR #121](https://github.com/Ikarus-eth/Blitzword_app/pull/121), commit `f319eb872ab01aee129f0c8076050fd7c16e6f23`, and successful [Pages run 37126185768](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/37126185768). All 19 runtime/artwork files match tested hashes, including the build marker and all twelve illustrations. [Deployment evidence](DEPLOYMENT.json), [CURRENT_STATUS](../CURRENT_STATUS.md).
