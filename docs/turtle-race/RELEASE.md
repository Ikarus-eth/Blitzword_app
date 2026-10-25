# Turtle Race mini-games — 24 October 2026

The user asked for a short reading race: Pip against a turtle, about 60 seconds, read a simple sentence then tap an answer, with three different quiz-and-score mechanics so the child can choose and the parent can see which one engages him. One may be a fight in which slow or wrong answers cost a life and fast right answers cost the enemy a point. Images and voice-over were to use minimal compute.

## What it is

A standalone page at `assets/turtle-race/` (live: https://ikarus-eth.github.io/Blitzword_app/assets/turtle-race/). It has no setup or unlock requirement. Since 24 October 2026 the game's home hub has a Turtle race button and the race picker has a Home link back. It never reads or writes the learner save (`blitzword_state_v1`); its own stats live under `blitzword_turtle_race_v1`.

| Race | Quiz | Scoring | 60-second ending |
|---|---|---|---|
| Turtle Dash | Sentence stays visible; a who/what/where question with three one-word answers | Right = Pip hops one step forward; wrong = one step back (never behind the start) | The turtle crosses the line at exactly 60 s. Pip wins if he reaches the line first |
| Flash Dash | Sentence flashes (starts at 3.0 s), then hides; pick the sentence you read from three that differ by one word | Right within 3 s of the choices = Blitz boost, two steps; slower right = one step; wrong = one step back | Same turtle |
| Shell Duel (fight) | Sentence plus a yes/no question with a visible per-question timer (starts at 7 s) | Right before the timer ends = turtle loses a shell; wrong or too slow = Pip loses one of three hearts | Win at zero shells; lose at zero hearts or when time runs out |

After a wrong answer the correct choice is highlighted and the existing recording of the sentence plays once. The clock pauses when the page is hidden.

Difficulty: superseded on 25 October 2026 by five chosen turtles per race (below). The original automatic adaptation is removed.

## Content

51 sentences from the Core 200 teaching set, each already recorded (Tom), with one question, the answer word, two wrong words and a yes and a no question. Source: `scripts/turtle-race-items.json`; built into `items.js` by `scripts/build-turtle-race.cjs`, which validates every item and checks each recording exists. Choices are text only; no artwork appears with answers. Questions are not narrated, so the child reads them.

## Parent view

"For parents" on the race-picker page shows, per race: started, finished, left early, won, percent right, average answer time, last played, and per race the open level plus wins and races per level. Started minus finished is the clearest disengagement signal. Stats stay on the device and are not part of progress sharing.

## Compute used

- Images: none generated. `pip.webp` (approved Small Pip B, `assets/battle-motion/pip-friendly-b.png`) and `turtle.webp` (approved Brook Turtle cutout, `assets/enemies/approved-20261010/atlas-03.png`) are downscaled crops. The track, finish line, duel arena, fireball and wave are CSS.
- Sentence audio: all 51 reuse existing recordings.
- Voice-over: 18 George lines (titles, how-to-play, go, boost, too slow, win/lose), 638 characters in two ElevenLabs batches (`eleven_multilingual_v2`, voice `JBFqnCBsd6RMkjVDRZzb`, approved settings). Account usage reported 84,230 / 121,026 characters before and after (the provider's counter had not yet updated). Generation ran from the generation-only branch `claude/turtle-race-narration-20261024` (Actions run 40079494410); the paid artifact was retrieved by a second, provider-free run (40079624501) because the session could not reach Actions artifact storage. No paid retries. Receipts: `docs/narration-turtle-race/receipts/`, summary: `NARRATION_GENERATION.json`. That branch must not be merged.
- Sound effects are synthesized in the browser.

## Verification

- 11 new unit tests (`tests/turtle-race.test.js`): item validity and recordings, one-word flash swaps, yes/no balance, each scoring rule, the 60-second turtle, adaptation and limits, stats and quits, deck coverage, voice receipts, and no access to the main save. Full suite: 430 unit/backend tests and all UI-flow groups pass.
- Headless Chromium plays all three races to a result at 1194×834, 834×1194 and 390×844 with no page errors; separate runs cover the turtle winning an idle race, duel timeouts costing hearts, and leaving mid-race counting as "left early". All 53 audio files decode in the browser.
- Not verified: physical iPad and Safari audio, touch feel, and whether the timings suit the child. Nobody has listened to the new George lines yet.

## Deployment

PR #198 merged as `c8649ce7700f904aeba371023d54727eeda0695f`. Pages run 40081466652 passed tests and deployed. Verification run 40081677005 (branch `claude/turtle-race-live-check`, not for merging) fetched all nine live turtle-race page, art and voice files and found each identical to the merged source.

## Five turtles per race — 25 October 2026

The user asked for difficulty levels he can move up through slowly, so he gets some wins first, in all three games. Each race now has five fixed turtles: Sleepy, Little, Brave, Speedy and Champion. Only Sleepy is open at first. Beating the hardest open turtle opens the next one, with a "New turtle unlocked" banner and fanfare. The child chooses which open turtle to race on the intro screen; the game never moves him up by itself. After a win the result offers "Try the [next turtle]" next to "Same turtle again"; after a loss above level 1 it offers the easier turtle next to "Try again". The race picker shows one star per turtle beaten.

| Level | Turtle Dash | Flash Dash | Shell Duel | Sentences |
|---|---|---|---|---|
| 1 Sleepy | 4 steps, no slipping back | 5 steps, 5 s flash, boost within 5 s, no slipping back | 3 shells, 12 s per question, 5 hearts | up to 5 words (28) |
| 2 Little | 6 steps, no slipping back | 7 steps, 4 s flash, boost within 4 s, no slipping back | 4 shells, 10 s, 4 hearts | up to 5 words |
| 3 Brave | 8 steps | 9 steps, 3 s flash, boost within 3 s | 5 shells, 8 s, 3 hearts | up to 6 words (47) |
| 4 Speedy | 10 steps | 11 steps, 2.5 s flash, boost within 3 s | 7 shells, 6.5 s, 3 hearts | all 51 |
| 5 Champion | 12 steps | 13 steps, 2 s flash, boost within 2.5 s | 9 shells, 5 s, 3 hearts | all 51 |

Settings stay fixed within a run. Earlier stats are kept, but everyone starts at Sleepy Turtle because the old automatic difficulty does not map onto the new levels. No new images or recordings: turtle names are read, not narrated.

Verification: 13 Turtle Race unit tests (level ordering, sentence pools, per-level scoring, unlock and choice rules, old-profile repair). Full suite: 432 unit/backend tests and 124 UI-flow groups pass. Headless Chromium loads a yesterday-format profile without errors. At 1194×834, 834×1194 and 390×844 it wins Sleepy, unlocks and races Little, and unlocks Brave in all three races. It also checks that a loss offers the easier turtle. The intro fits without scrolling at 1194×834, 1024×768 and 834×1194; phones scroll. Physical iPad is not verified.

## Race time on the Parents dashboard — 25 October 2026

The user asked for race time to count in active reading time on the main Parents dashboard. The race page now records active race time per local day under `time.days` in its own save. The clock runs only while a race is on screen; the countdown, results and hidden-page time are excluded. Time is credited as it happens, so leaving or closing mid-race still counts. Saves from before this change are backfilled from finished races in their history (at most 60). The main dashboard adds race time to "Active play today" and "Total active play". It also has a "Turtle race reading time" card and a "Turtle race" column under Recent days. Race time does not count towards the daily XP boost, and the dashboard only reads the race save. An unreadable race save shows "Unreadable" and is left unchanged. Main build `race-time-20261025-r1`. Tests: 433 unit/backend tests and 125 UI-flow groups pass; a headless browser journey covers backfill, a quit mid-race and the dashboard totals.
