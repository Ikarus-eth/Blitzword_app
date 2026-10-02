# Harder challenge, champion enemies and reading-riddle time — 2 October 2026

Build `challenge-champions-20261002-r1`; story adventures `story-riddle-time-20261002-r1`.

## User request and decisions

The parent reported that the game was "still not challenging enough", that the child only fought the same griffin at the 32-HP ceiling, and asked for reading-riddle time to appear separately in the parent dashboard. He accepted the proposed defaults: a 75–85% target and automatic familiar-word flashes down to 500 ms.

## Why it was too easy (findings on main `ac36672`)

- Adult Storm Griffin (25–32 HP) was the only variant above 30 HP. After a win at 32 HP the result screen offered Easier (31 HP) and Same (32 HP), and both were the griffin.
- The 30 September adaptive rules varied only how many new words open. Exposure never adapted ("No automatic speed increase" was out of scope then).
- Ten hearts against 32 HP were rarely lost. With independent answers and no shield, defeat probability is about 1% at 90% accuracy, 8% at 85%, 30% at 80% and 60% at 75%.

## Rules

**Target band.** The automatic word challenge now aims for 75–85% unaided success (was 80–90%). Stretch starts above 85%, support below 75%. All other adaptive rules (window of 20, minimum sample of 10, early struggle, active-set limits, review priority) are unchanged. 70–80% was not used because ten hearts would lose a 32-HP battle about 60% of the time at 75% accuracy.

**Familiar-word flash speed.** Exposure is now the second automatic difficulty axis.

- Ladder: 1800, 1500, 1200, 950, 800, 650, 500 ms. Each challenge step shows a familiar word one rung faster than the chosen pace. Familiar means `familiar` or at least two unaided correct answers.
- A step is added after 10 counted answers while the window is above 85%, and removed after 5 counted answers while it is below 75% (support). Counted answers are the same records the adaptive band uses: battle answers with valid timing, including help requests, excluding interrupted displays, demo and assessment.
- New and still-unfinished words, demo questions and Crawl (untimed) keep the chosen pace. The saved speed setting never changes, and Ride/Fly locks are unchanged. A pace faster than the ladder (Fly) is never slowed.
- State is `learning.challengePace = {steps, since}`, sanitized on load. Already-prepared questions keep their saved exposure. Records of sped-up questions store `chosenExposureMs` beside the actual `exposureMs`.
- Speed XP and its 20-answer history follow the chosen pace, so the approved XP calibration does not change. The quick-word marker in Parents uses the actual exposure.
- Parents shows the band and the current familiar-word flash time.

**Champion enemies.** 19 families gain a fourth form at 26–32 HP (the Storm Griffin keeps its existing adult 25–32 form): Mighty Thornling, Moss Golem, Root Sprite, Cave Troll, Mushroom Guard, Bark Beetle, Bramble Boar, Reed Serpent, Bog Toad, Crystal Crab, Hollow Owl, Stone Ram, Briar Bat, Snail Knight and Chest Mimic, plus 5 Moon Moths, 5 Acorn Imps, 5 Lantern Wisps and 3 Fern Wolves. IDs are appended as `<family>--4`, so all 60 existing IDs, ranges and saves are unchanged (79 variants in total). All 20 families are eligible from 26 to 32 HP, and the existing balanced rotation meets each family once in twenty 32-HP battles. Champions reuse the existing animated adult artwork and group layouts; no new images were generated. Their names use device speech, like the other unrecorded enemy names.

**Ceiling choice.** After a win at 32 HP the result screen offers two different families at Same strength (no Stronger exists). After a defeat, Easier and Same remain. A pre-existing layout fault let two result cards overflow the panel by about 50 px on 390 px phones; the two columns now shrink and long names wrap.

**Reading-riddle time.** Story adventures had no time record. Each tap (choice, Ready, hint, show, replay, next stop, story tab, Back to map) now confirms the time since the previous tap. Gaps up to two minutes count, because a story page takes longer to read than one flashed word; longer gaps are added to an idle total and excluded. Hidden tabs and the unconfirmed interval before hiding are excluded. Time is saved per local date in the story save (`blitzword_story_pilot_v2`, field `time`, 400 dates kept). Parents reads it without writing: a "Reading riddles, counted separately" total with today's time, and a "Reading riddles" column in Recent days. It is not part of active play, Pip's growth, chapter time, the daily bonus or the backup file. Earlier story visits have no recorded time.

## Verification

- 280 core tests and 99 UI-flow groups pass (main: 274 and 96). New coverage: pace steps up/down, sanitizing, Crawl/demo/interruption exclusions, speed XP on the chosen pace, roster ranges, 20-family rotation at 32 HP, group HP conservation for champion groups, the two-card ceiling, Parents pace text, riddle time display, unreadable story save, story-page timing with hidden and long gaps.
- Existing tests changed on purpose: variant count 60 → 79 (two tests); band edges 80–90% → 75–85%; the accepted Stride offer now expects the faster familiar-word flash; the story save gains `time`; the Parents band text; the 30-minute pacing model's daily ceiling 1,400 → 1,600 XP with a new 7,700–8,030 seven-day bound. The model's seven-day total is 7,806 XP against 7,870 before; word milestones bunch on model day 5 (1,511 XP).
- `tests/challenge-browser.cjs`: 27 isolated Chromium checks at 1180×820, 820×1180 and 390×844 with zero page errors. They cover six champion encounters (5-member groups, the 3-wolf pack, single Mighty creatures), the ceiling cards fitting their panel, the Parents stat/column/pace line and tap-timed story time. Screenshots were reviewed. [Results](CHALLENGE_CHECKS.json).
- Not verified: physical iPad/Safari, a real child's accuracy under the new band, and whether 500 ms is comfortable for this child.
