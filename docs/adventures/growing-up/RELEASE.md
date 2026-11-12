# Pip Grows Up and riding Pip — 12 November 2026

Rules: [product spec](../../BLITZWORD_PRODUCT_SPEC.md#pip-grows-up-and-riding-pip--approved-12-november-2026).

## Why now

Artus's encrypted progress report captured on 12 November 2026 at 07:48 Bali time showed 32,173 XP with Pip at Big Pip. Over the previous days he earned roughly 1,000–1,700 XP a day, so the 44,000 XP pause is expected around 19–21 November (an estimate, not a schedule).

## Story

Four story-only parts, 982 words, 12 questions. Source: [story-source.js](story-source.js); meanings for new words: [glossary-source.js](glossary-source.js); build: `node docs/adventures/growing-up/build-campaign.js` writes `assets/adventures/pip-grows/campaign.js`.

1. **The Little Red Egg**: Pip glows by the fire; they remember the warm red egg under an old tree and baby Pip's first word, "Breakfast?"
2. **Little Pip**: the dark forest and the light seeds, the kind shark, ringing the river bells.
3. **Big Pip**: bumping his head on the door, the snow stars, finding Jet in the storm cave, Grandma's cake, carrying the beaver's boat.
4. **Hop On!**: Grandma and Jet bring a saddle that is too big at first; flying is "not yet"; Pip is ready to grow.

Checked against the 12 November report: 88.6% of the 1,177 word tokens (story and questions) are words Artus is learning, has secured or has kept, or names (Moon Key: 87%). The rest are tappable, mostly with a meaning.

## Pictures

fal.ai `fal-ai/nano-banana/edit`, two batches through the existing `mission-art.yml` workflow: [art-batch-1.json](art-batch-1.json) (13 images) and [art-batch-2.json](art-batch-2.json) (three retakes: Pip's glow on part 1 page 1, the bag with only the tail out, and Grandma drawn as a dragon). 16 images at about $0.04 each, roughly $0.64 in all (an estimate from the published price, not an invoice). Raw outputs and request records are in `generated/`.

- 10 new story pictures in `assets/adventures/pip-grows/` (cover, part 1, part 3 page 1, part 4).
- Part 2 and part 3 pages 2–4 are memories and reuse earlier pictures (mist lamps, kind shark, river bells, first spark, Thunder Mountain cave and home, the Moon Key boat).
- Rider: `rider-b` was cut out locally with rembg (isnet-general-use) and saved as `assets/battle-rider/rider.webp` (777 × 617). `rider-a` and `rider-c` were not used because Pip had no wings in them. The rider's Pip is drawn a little differently from the saddled growth-panel art.

## Voice

Free local Kokoro af_heart clips through `story-voice.yml`: [voice-request.json](voice-request.json) (486 clips: 264 words, 210 meanings, 12 questions), made by [make-voice-request.js](make-voice-request.js). Until the clips are in the build, the reader falls back to speech.

## Implementation

- `content.js`: stages Small 0 / Big 15,000 / Ride on Pip 45,000 / Flying Pip 70,000; `growth` gate config; evolution lines and frames for riding.
- `adventure-core.js`: `growthHeld`, `growthDue`, `growthOpen`, `growthRead`, `growthNext`; growth missions unlock by XP; other new quests are locked during the hold; parking and resuming a waiting quest; two-step progress for story-only parts.
- `game-core.js`: XP hold in `awardXP`; unboosted growth story XP capped at 44,999 until the last right answer; the stage loop will not enter the riding stage before the story is read.
- `adventure-ui.js`: camp banner, sixth tab, gate panel before a waiting quest's fight, read intro, completion that returns to the parked quest, "Watch Pip grow".
- `app.js` and `adventures.css`: rider painting, rider layout per viewport, team attack (lightning plus fire breath, blaze at three in a row or the winning hit), growth captions.

## Checks

- `npm test`: 477 unit/backend tests and 133 UI-flow groups pass (new: `tests/pip-grows.test.js`, one UI-flow group).
- `tests/pip-grows-browser.cjs` in headless Chromium at 1194 × 834, 820 × 1180 and 390 × 844: banner, gate and parking, reader, last answer, evolution, completion, return to the parked quest and a riding fight; no page errors or sideways scrolling.
- Riding layout screenshots at 1024 × 768, 1194 × 834, 1366 × 1024, 820 × 1180, 390 × 844, 844 × 390 and 667 × 375, with and without a quest animal and two shields. On phone landscape the staff tip can touch the quest box; the base layout is already tight there.
- `tests/visual-regressions-browser.cjs` and `tests/moon-key-browser.cjs` still pass.
- Not verified: physical iPad, Safari/WebKit, listening to the new clips.
