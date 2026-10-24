# Turtle Race mini-games — 24 October 2026

The user asked for a short reading race: Pip against a turtle, about 60 seconds, read a simple sentence then tap an answer, with three different quiz-and-score mechanics so the child can choose and the parent can see which one engages him. One may be a fight in which slow or wrong answers cost a life and fast right answers cost the enemy a point. Images and voice-over were to use minimal compute.

## What it is

A standalone page at `assets/turtle-race/` (live: https://ikarus-eth.github.io/Blitzword_app/assets/turtle-race/). Like the Hidden Atlas, it has no setup, no unlock requirement and no link into or out of the main game. It never reads or writes the learner save (`blitzword_state_v1`); its own stats live under `blitzword_turtle_race_v1`.

| Race | Quiz | Scoring | 60-second ending |
|---|---|---|---|
| Turtle Dash | Sentence stays visible; a who/what/where question with three one-word answers | Right = Pip hops one step forward; wrong = one step back (never behind the start) | The turtle crosses the line at exactly 60 s. Pip wins if he reaches the line first |
| Flash Dash | Sentence flashes (starts at 3.0 s), then hides; pick the sentence you read from three that differ by one word | Right within 3 s of the choices = Blitz boost, two steps; slower right = one step; wrong = one step back | Same turtle |
| Shell Duel (fight) | Sentence plus a yes/no question with a visible per-question timer (starts at 7 s) | Right before the timer ends = turtle loses a shell; wrong or too slow = Pip loses one of three hearts | Win at zero shells; lose at zero hearts or when time runs out |

After a wrong answer the correct choice is highlighted and the existing recording of the sentence plays once. The clock pauses when the page is hidden.

Difficulty adapts per race so it stays close: a win adds one step (Dash races) or one shell (Duel); a loss removes one, or two if Pip got less than halfway. Within a run, Flash Dash shortens the flash by 0.15 s after a right answer and lengthens it by 0.4 s after a wrong one (1.2–6 s). The duel timer shortens by 0.3 s after a right answer and lengthens by 0.7 s (wrong) or 1 s (timeout), within 3.5–10 s.

## Content

51 sentences from the Core 200 teaching set, each already recorded (Tom), with one question, the answer word, two wrong words and a yes and a no question. Source: `scripts/turtle-race-items.json`; built into `items.js` by `scripts/build-turtle-race.cjs`, which validates every item and checks each recording exists. Choices are text only; no artwork appears with answers. Questions are not narrated, so the child reads them.

## Parent view

"For parents" on the race-picker page shows, per race: started, finished, left early, won, percent right, average answer time, last played, and the current difficulty. Started minus finished is the clearest disengagement signal. Stats stay on the device and are not part of progress sharing.

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
