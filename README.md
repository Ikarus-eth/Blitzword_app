# BlitzWord

An iPad-first English reading game. Play the current web build at https://ikarus-eth.github.io/Blitzword_app/.

See [current implementation and outstanding work](docs/CURRENT_STATUS.md) first. Older release notes describe their own milestones, not the current backlog.

For ChatGPT project setup, use the [project maintenance guide](docs/PROJECT_DESCRIPTION_UPDATE.md). No standing project attachments are required: documentation, approved production assets and the [original curriculum workbook](curriculum/README.md) are maintained in GitHub. Old setup, battle-scroll and teaching-card mockups are retired.

## Current gameplay

Setup and hero selection lead to an optional guided battle or the existing adaptive reading check. A battle is one enemy. A chapter is one map field and requires at least ten interaction-confirmed active minutes, three reading wins, a played number duel and its learning objectives. If the duel ends at eight minutes, another battle continues the chapter. Pause/Home/reload preserve it. A campaign is one map of five chapters; seven campaigns contain the existing 200 words. After the story, review chapters continue the daily one-chapter goal.

Growth is XP-only, at 3,000 / 8,900 / 13,400 XP. The child chooses the dragon’s name on its first evolution. Correct reading earns 3 XP; new words, delayed recall, accurate chapters and reliable faster reading earn extra. At ten active minutes each day, a one-time 20 XP reward unlocks a small, static ×1.75 badge and boosted correct-answer XP for the rest of the day. Idle, menus, demo and assessment cannot earn this reward. Existing XP, forms and cleared locations are preserved. See [success XP rules and calibration](docs/SUCCESS_XP_RELEASE.md).

The earlier seven-minute session and day/minute growth gates are superseded. The extended automated run verifies five-hour capacity and continues through all 35 ten-minute chapters; it is not evidence of human enjoyment. Separate deterministic pacing simulations model 15 and 45 active minutes a day. All 35 chapters now require at least 350 active minutes in total for a new learner.

Chapter stories are implemented for the 34 entries after the guided first encounter. Each has an illustrated introduction using the existing speech system, followed by one simple untimed sentence for the child to read and confirm. Pause, Home, Rest and reload preserve progress. The chosen dragon name appears in stories, and map/progress labels identify the actual campaign and chapter. See [chapter stories](docs/CHAPTER_STORIES_RELEASE.md). All 35 fields now have distinct backgrounds: 28 new illustrations and seven retained scenes. See [chapter scenery](docs/CHAPTER_SCENERY_RELEASE.md) for mapping, provenance and verification.

Number duels use multiple choice only, with factors 1–10 and a 60-second clock. Correct answers score +1; wrong answers score −1. PR uses net score, and the opponent target is max(1, PR − 2). Correct answers earn 1 base XP before the daily multiplier; multiplication time is tracked separately. Three consecutive reading wins followed by a won duel earn one non-stacking shield that absorbs the next damaging reading mistake. See [number-duel rules](docs/MULTIPLICATION_CHALLENGE.md) and [choices, defeat and shields](docs/CHOICES_SHIELD_RELEASE.md).

The adaptive forest soundscape is implemented and deployed: scene music, accents, result cues and independent saved audio controls. Reading presentation and teaching suppress music/effects, narration takes priority, and pause/background stop pending playback. See [soundscape behavior](docs/SOUNDSCAPE_RELEASE.md).

Home → Parents opens the parent dashboard behind an arithmetic gate. Time is confirmed by meaningful game actions. Thirty seconds without a game action auto-pauses and discards unconfirmed time; menus, results, background tabs and device sleep do not count. Older waiting-inclusive totals remain separately labelled. See `docs/ACTIVE_PLAY_RELEASE.md` for exact timing behavior and limitations.

Progress stays on the device. Every accepted response, active question, health change, teaching return, assessment answer and checkpoint is saved. Existing v1 records migrate in place with a retained backup. The save keeps the newest 500 answers in full and rolls older ones into daily and per-word totals, so it stays under about 1M characters after 90 days at 45 minutes a day. Parents → Backup saves the whole save as a dated file (on iPad through the share sheet) and restores one after a check and the parent's confirmation; the replaced progress stays on the device. The app pauses on backgrounding and reports storage failures instead of claiming unsaved progress was saved. Another open tab cannot silently overwrite a newer save.

This build has no remote analytics, native iOS package, purchases, or guaranteed offline asset cache. Available fixed narration uses local British male recordings; unrecorded text and playback errors use device speech. Targets remain highlighted and underlined during recorded teaching; verified word-boundary timestamps are not available.

## Run and test

Serve this directory with any static HTTP server; playing the app requires no compilation or installed dependencies. Automated tests require the dependencies installed by `npm ci`.

```
python3 -m http.server 8000
npm ci --ignore-scripts
npm test
```

GitHub Pages deploys `main` after the script and regression checks pass. To confirm what is live, compare the `blitzword-build` meta tag on the live page with `index.html` on `main`. Use task branches and pull requests. The previous main commit is the rollback point; never reset learner data to roll back artwork or gameplay.

See [the product specification](docs/BLITZWORD_PRODUCT_SPEC.md) for approved direction and [Core 200](docs/CORE200_RELEASE.md) for curriculum and asset provenance. The older six-word teaching slice is retained as historical documentation.

Recovered prerecorded narration is integrated: all 990 recovered exact-text clips are now mapped at runtime. A 42-clip representative listening QA found six bad clips; `on`, `creature`, `i`, `it`, standalone `gate`, and the final Pip-evolution line were replaced with user-approved recordings. The other four gate recordings were approved and enabled, and 12 additional older-Tom word samples were all good. Chapter-story and some composite shield-correction phrases still use device speech, and recorded word-boundary highlighting, exhaustive listening and physical iPad playback remain outstanding. See [the narration release](docs/NARRATION_RELEASE.md). Enemy artwork and creature-specific health ranges remain assigned to the user's parallel thread.
