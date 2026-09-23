# BlitzWord

Multiplication bonus: after each three consecutive reading wins, the defeated enemy offers a 60-second 1–10 times-table challenge. Saved PR, a target of PR − 2 (minimum 1), 1 XP per correct answer before the daily multiplier, and separately tracked active multiplication time are included. See [challenge behavior and tests](docs/MULTIPLICATION_CHALLENGE.md).

An iPad-first English reading game. Play the current web build at https://ikarus-eth.github.io/Blitzword_app/.

## Current playable slice

Setup and hero selection lead to an optional guided battle or the existing adaptive reading check. A battle is one enemy. A chapter is one map field and requires at least ten interaction-confirmed active minutes, three reading wins, a played number duel and its learning objectives. If the duel ends at eight minutes, another battle continues the chapter. Pause/Home/reload preserve it. A campaign is one map of five chapters; seven campaigns contain the existing 200 words. After the story, review chapters continue the daily one-chapter goal.

Growth is XP-only, at 3,000 / 8,900 / 13,400 XP. The child chooses the dragon’s name on its first evolution. Correct reading earns 3 XP; new words, delayed recall, accurate chapters and reliable faster reading earn extra. At ten active minutes each day, a one-time 20 XP reward unlocks a small, static ×1.75 badge and boosted correct-answer XP for the rest of the day. Idle, menus, demo and assessment cannot earn this reward. Existing XP, forms and cleared locations are preserved. See [success XP rules and calibration](docs/SUCCESS_XP_RELEASE.md).

The earlier seven-minute session and day/minute growth gates are superseded. The extended automated run verifies five-hour capacity and continues through all 35 ten-minute chapters; it is not evidence of human enjoyment. Separate deterministic pacing simulations model 15 and 45 active minutes a day. Distinct background art for every individual field and chapter story interludes remain separate outstanding work; this release retains the approved existing scenery.

Home → Parents opens the parent dashboard behind an arithmetic gate. Time is confirmed by meaningful game actions. Thirty seconds without a game action auto-pauses and discards unconfirmed time; menus, results, background tabs and device sleep do not count. Older waiting-inclusive totals remain separately labelled. See `docs/ACTIVE_PLAY_RELEASE.md` for exact timing behavior and limitations.

Progress stays on the device. Every accepted response, active question, health change, teaching return, assessment answer and checkpoint is saved. Existing v1 records migrate in place with a retained backup. The app pauses on backgrounding and reports storage failures instead of claiming unsaved progress was saved. Another open tab cannot silently overwrite a newer save.

This build has no remote analytics, native iOS package, purchases, or guaranteed offline asset cache. Available fixed narration uses local British male recordings; unrecorded text and playback errors use device speech. Targets remain highlighted and underlined during recorded teaching; verified word-boundary timestamps are not available.

## Run and test

Serve this directory with any static HTTP server. No build step or package installation is required.

```
python3 -m http.server 8000
npm ci --ignore-scripts
npm test
```

GitHub Pages deploys `main` after the script and regression checks pass. Use task branches and pull requests. The previous main commit is the rollback point; never reset learner data to roll back artwork or gameplay.

See `docs/BLITZWORD_PRODUCT_SPEC.md` for the larger approved product direction and `docs/TEACHING_SLICE.md` for this slice's content review and asset provenance.

The expanded Core 200 recordings are deferred at the user's request. This release retains the 165 existing recordings; new words and sentences use browser speech immediately, without requests for missing audio files. The recovered recording expansion is preserved separately for a later release.
