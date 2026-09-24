# BlitzWord current status — 24 September 2026

This page tracks current implementation and remaining work. Dated release notes preserve historical behavior and test results; their old limitations are not automatically current tasks. Latest approved user decisions take precedence over earlier plans. A difference between approved behavior and code remains a discrepancy, not a new product decision.

The [original curriculum workbook](../curriculum/README.md), maintained documentation and approved production assets are now in GitHub. No standing ChatGPT project attachments are required. The old setup, battle-scroll and teaching-card mockups are retired; see the [project maintenance guide](PROJECT_DESCRIPTION_UPDATE.md).

## Implemented

| Area | Current behavior | Details |
|---|---|---|
| Curriculum | 200 distinct workbook targets; seven campaigns with five chapters each; continued review after completion. | [Core 200](CORE200_RELEASE.md) |
| Chapter pacing | A battle is one enemy; a chapter is one map field; a campaign is one five-chapter map. New chapters require at least ten active minutes, three reading victories, a completed number duel and learning objectives. Extra battles fill the remaining time; a living battle cannot auto-complete. | [XP and pacing](SUCCESS_XP_RELEASE.md) |
| Growth and naming | XP-only evolution at 3,000 / 8,900 / 13,400 XP. First growth unlocks naming. Successful reading, word milestones, delayed recall, reliable speed and chapter accuracy earn XP. After ten active daily minutes, a one-time 20 XP bonus and visible ×1.75 answer-XP multiplier last for the rest of that date. | [XP and pacing](SUCCESS_XP_RELEASE.md) |
| Chapter scenery | 35 distinct chapter backgrounds; 28 newly generated illustrations and seven retained scenes. Active story/encounter IDs determine scenery; campaign maps retain their established art. | [Scenery mapping and verification](CHAPTER_SCENERY_RELEASE.md) |
| Chapter stories and labels | 34 illustrated transitions after the guided first encounter; narrated introduction, one child-read sentence, optional Listen and child confirmation. Pause/Home/Rest/reload preserve progress. Labels identify the actual campaign and chapter. | [Chapter stories](CHAPTER_STORIES_RELEASE.md) |
| Choices and number duels | Close distractors, multiple-choice-only multiplication, 60 seconds, net +1/−1 scoring, PR-based target, compact results and defeat reactions. Three reading wins plus a won duel earn one non-stacking shield. | [Choices and shields](CHOICES_SHIELD_RELEASE.md) |
| Combat and presentation | Mage staff/lightning, Pip assists/final blows, answer-locked reactions, cancellation and reduced motion; teaching-image framing, enemy names and Easier-left/Same-right defeat choices. | [Combat](COMBAT_REACTIONS.md), [child feedback](SEPT23_CHILD_FEEDBACK.md) |
| Game controls | Fullscreen button, handlers and notice removed at the user’s request. The existing flexible toolbar closes the gap; sound, pause and Home remain. Home Screen presentation and learner saves are unchanged. | [Product specification](BLITZWORD_PRODUCT_SPEC.md) |
| Soundscape | Approved adaptive forest music and effects are integrated and deployed, with scene changes, speech priority and independent saved controls. | [Soundscape](SOUNDSCAPE_RELEASE.md) |
| Narration | 990 exact-text clips are mapped at runtime and deployed. Representative QA reviewed 42 clips; six bad clips were replaced with user-approved recordings, all five gate phrases are enabled, and the final Pip-evolution line is slower. Build `narration-approved-20260924-r1`. | [Narration release](NARRATION_RELEASE.md) |

## Outstanding work and ownership

- Narration recovery and targeted QA replacement are integrated: all 990 exact-text corpus clips are now approved for runtime. The user reviewed 42 representative clips, rejecting six and approving six targeted replacements; all 12 extra earlier-Tom word samples were good. Chapter-story and some composite shield-correction phrases still use device speech where no exact clip exists. Static target highlighting remains; accurate recorded word-boundary highlighting, exhaustive listening and physical iPad gameplay playback remain unfinished. Pages run `35955320563` passed 128/128 tests and reported a successful deployment for `9b7cbbc265131fc47eba7f81c7714e3d09eaff8a`; the deployed artifact was inspected and contains the six approved replacement hashes, all 990 runtime mappings, and build marker `narration-approved-20260924-r1`. Direct HTTP verification of the public Pages origin remains unavailable in this execution environment.
- Enemy artwork expansion and creature-specific health ranges belong to the user's parallel thread. They are not changed by this documentation task. At this checkpoint, five base creature designs share tier-based health bands.
- The 35 chapter backgrounds are deployed and verified against source bytes. Rendered tablet/phone scenery QA remains blocked because the browser could not verify its admin-enforced security policy; [chapter scenery](CHAPTER_SCENERY_RELEASE.md) records the exact limit and isolated review fixtures.
- Physical iPad behavior and listening remain unverified. XP pacing is calibrated by deterministic simulations, not observed child play.
- An additional dragon after full growth is an optional future idea, not an approved unfinished feature. Pip remains a provisional child-facing label; no commercial rename is established. Native App Store packaging remains a later phase after web iteration.

### Approved plan — 23 September 2026

The user approved these points on 23 September 2026. Build them one at a time in this order: 1, 2, 3, 4, 6, 7, 8. After each point, stop, report and wait for the user's "go" ([working rules](../CLAUDE.md)). Status of every point: **approved, not started**. The evidence comes from a read-only handover review; re-check it against current `main` before acting on it.

| # | Point | Status |
|---|---|---|
| 1 | Durable saves: 1b backup file first, then 1a smaller save | 1b deployed and verified live on 24 September 2026; the user saved an iPad backup. The save-problem dialog also offers the backup file. 1a deployed and verified live on 24 September 2026 (build `compact-save-20260924-r1`) |
| 2 | Rotating distractor pools (option b) | Approved, not started |
| 3 | Scheduling bug fix plus daily cap and refill (option a) | Approved, not started |
| 4 | Contrast correction and adaptive teaching depth (a + b) | Approved, not started |
| 5 | Narration | Representative QA complete; six bad clips replaced, approved and deployed; all five gate phrases enabled. Remaining story/composite gaps, exhaustive listening and physical iPad review stay open |
| 6 | Story sentences a child can read (option c) | Approved, not started; sentence list needs approval before building |
| 7 | Speed suggestions, two new steps, per-word quick status | Approved, not started |
| 8 | Parent view: word map, tricky list, weekly retention | Approved, not started |

**1. Durable saves.** Two releases with a stop in between.
- Evidence: every answer is stored forever. The whole save is rewritten every second while playing and duplicated as `_backup`. At 15 min/day the save grows by about 60k characters per day; with the duplicate it passes Chromium's measured 5.2M-character localStorage limit around day 40 (around day 14 at 45 min/day). At the limit `save()` throws and play blocks.
- 1b first: Parents gets "Save backup file", which downloads the full save as a dated file and must work on iPad Safari, and "Restore from file", which validates with the existing `migrate()`, keeps the current save in a backup key before replacing it and asks the parent to confirm. Release it, then stop so the user can save a backup from the iPad.
- 1a next: keep per-word summaries and the last ~500 raw answers. Roll older answers into daily and per-word totals that keep what point 8 needs: attempts, correct answers, counts of each wrong choice, which letter positions differed, response-time statistics and review results. Save on meaningful events, at most every ~10 s for the time ledger, and on pause and page hide, instead of every second. Keep one backup copy of the compact save. Migrate existing saves in place with no loss of XP, dragon forms, cleared chapters, word states, number-duel records, shields or settings. A test simulates 90 days at 45 min/day and fails if the save passes ~1M characters.

**2. Rotating distractor pools (option b only).**
- Evidence: each word always gets the same three distractors. Picking the option most similar to the other three (lowest total edit distance, an adjacent swap counting as one edit) is right 90% of the time on the 200 practice sets without seeing the word; chance is 25%. Children also check the first and last letter, so same-position sets such as night/light/right/might are rejected: one letter solves them.
- Build: 5–7 candidates per word; draw 3 per question so that every drawn set meets all of these: (i) the target's first letter alone, last letter alone, first and last letters together, and word length each match at least 2 of the 4 options; (ii) across all words, the "middle option" guess is right no more than ~35% of the time; (iii) real words and pronounceable non-words are preferred, and a non-word is never a curriculum word. Questions already saved keep their options. Automated tests check (i) and (ii) over all 200 words across many sampled draws. The reading-check items have the same weakness: report their scores and ask the user before changing them.

**3. Scheduling: bug fix plus cap and refill (option a).**
- Bug: after a miss on a word with `reviewStage` 1 or higher, correct answers within 24 h of help never reschedule it, so it stays due and repeats all day. Fix: directly after `} else if (w.reviewStage<0) w.dueAt=now+15000;` add `else if (now>=w.dueAt) w.dueAt=Date.parse(w.lastHelpAt)+DAY;`, with a regression test. Handover simulation of review days: distinct words per day rise from ~20 to ~70; the most any word repeats in a day drops from 9–14 to 3–4.
- Evidence for the cap: one answer takes about 4.4 s of speech and animation plus the child's response, so a 10-minute chapter holds about 75–95 answers over 6 words. In simulation, 35–55% of daily turns go to current-chapter words that are already correct twice and not due until tomorrow.
- Build: after 3 correct answers today, a current-chapter word is skipped for the rest of the day. Freed turns go, in order, to (1) words due for review; (2) older words not seen today, least recently seen first; (3) up to 3 new words from the next chapter, only while recent accuracy is 80% or higher, counted as introduced; (4) if nothing is left, current-chapter words again, one step faster on the ladder 2200/1800/1500/1200/950 ms (Crawl stays self-paced; Ride and Fly stay locked). The 10-minute chapter minimum and all chapter objectives stay unchanged. Re-run the scheduling simulation and report the share of turns on already-secured words and distinct words per day, before and after.

**4. Corrections and teaching (a + b).**
- Evidence: every miss and every "?" opens the full picture card. The computed `q.needsTeaching` is never used.
- 4a contrast correction: show the chosen word above the correct word, letters aligned, with the differing letters highlighted. Speak both words ("You chose rack. The word is rock.").
- 4b adaptive depth using `needsTeaching`: the full picture card appears only for new words, two or more misses in a row, and missed reviews. Otherwise show the contrast and continue. "?" answers show the word without a contrast and follow the same rule.
- Keep: help costs no heart, supported answers are not mastery evidence, and the recheck after two intervening items stays.

**5. Narration.** The separate narration workstream recovered and integrated the existing local corpus. Exact prerecorded phrases play where approved; device speech covers remaining phrases, personalized dragon names and the five gate-family phrases pending pronunciation review. See [the narration release](NARRATION_RELEASE.md).

**6. Story sentences a child can read (option c).**
- Evidence: only 62% of the words in the 34 child-read story sentences have been taught when the sentence appears; 26 of 34 contain untaught words; "I read it" is unchecked.
- Build: rewrite the 34 sentences so every word is taught before that chapter (the dragon's name is fine). Where that is impossible in early chapters, allow at most one untaught word, which the child can tap to hear. Replace "I read it" with a two-picture question, "Which picture shows what you read?", using existing approved images only: teaching atlases, chapter scenery and character art. List any sentence without a fitting picture instead of generating art. The question never blocks progress: a wrong pick shows the right picture and continues, earns no XP and is recorded for the parent view.
- Gate: show the user all 34 sentences with their picture pairs for approval before building.

**7. Speed (all three).**
- 7a: between battles, suggest a speed change as in spec section 9: one step slower below ~80% independent accuracy on familiar words, one step faster above ~90%, based on at least 20 recent answers. The child can say no. Words with concentrated errors get word-level help first.
- 7b: add 1500 ms and 1200 ms steps between Walk (1800 ms) and Run (950 ms). The Speed panel must highlight the step actually in use, including the reading-check default; today it shows Walk even at 1500 ms. Propose names and simple line icons for the two new steps at the stop.
- 7c: per-word "quick" status: correct in under ~1.5 s at 950 ms or faster. Words that are accurate but slow stay in review. Show quick status in the parent view.

**8. Parent view (all three).**
- 8a: a map of the 200 words coloured new / learning / secured / kept after 7 days / kept after 30 days, with a quick marker. Tapping a word shows its history.
- 8b: tricky list: the most common mix-ups (target → chosen, with count), where in the word errors happen (start / middle / end, vowel / consonant), and the slowest words.
- 8c: weekly retention: the share of words answered correctly on the first try when last seen at least a day ago.
- Put learning at the top of the parent screen and sound settings at the bottom.

### Parked — do not build

- **9. Rewards and pacing:** discuss with the user first. Evidence: a won battle gives about +9 XP against a 3,000 XP first stage. `scripts/calibrate-xp.cjs` line 19 assumes one answer per 24 s, but the measured cycle is about 6–10 s. At 8–10 s, the same model gives first growth on day 7–8 instead of 14 and full growth on day 32–37 instead of 70, at 15 min/day. Ideas on the table: a spellbook of word cards that upgrade with retention; visible steps inside each growth stage; thresholds recalibrated from real answer logs.
- **10. Number duel:** later. Evidence: age is collected but unused; all 100 facts from 1×1 to 10×10 come up at random with −1 per wrong answer; picking the middle number scores 41%. Ideas: levels by age and results, per-fact tracking, balanced distractors.
- **Options not chosen:** offline cache (1c); same-position distractor sets (2a, rejected); font or case change on the flash (2c); rolling word pool (3b); test-out (3c); splitting the 8 look-alike pairs that share a chapter; sound-it-out cards (4c); say-it moments (6a); meaning duels (6b).

## Smaller save (point 1a) — 24 September 2026

The save now keeps the newest 500 reading answers, 200 teaching and 200 help events, 50 sessions and 30 duels in full. Older entries roll into an `archive` of daily and per-word totals; see the [product specification](BLITZWORD_PRODUCT_SPEC.md) for exactly what is kept. Parents totals include the archive. Existing saves compact in place on their first load. The play tick saves at most every 10 seconds instead of every second; answers, pause and leaving the page still save at once. Pip's alternating assist now counts archived answers, so its rhythm is unchanged.

Fixed with it: `AdventureStore.save()` copied the previous save to `_backup` before writing the new one. Near the storage limit, that copy could not fit, so the first compacted save would fail. The new save is now written first; if the copy then does not fit, the older backup stays.

Measured with the calibration play loop at 6 seconds per answer (worst case) and 45 minutes a day:

| Day | Before | After |
|---|---:|---:|
| 7 | 1,659,214 characters | 591,485 |
| 30 | 6,926,992 | 657,775 |
| 90 | 20,810,308 | 718,773 |

Before, the save plus `_backup` passed Chromium's 5.2M-character localStorage limit around day 14 at 45 minutes a day (around day 40 at 15 minutes). After day 14 the save grows about 1,100 characters a day.

Build marker `compact-save-20260924-r1`; the `game-core.js`, `storage.js` and `app.js` cache versions are updated.

Tests: all 125 core tests and all 43 UI-flow groups pass locally. New coverage:
- a 90-day, 45-minutes-a-day simulation that fails above 1,000,000 characters;
- migration of a full-history save with an unchanged profile, dragon, story, rewards, settings, time, word states, duel best and Parents totals, where archive plus raw equals the original per word, per day and per wrong choice, and loading again changes nothing;
- hand-built cases for review results, retention gaps, letter positions, response times, duel facts and session time;
- first-load compaction through the store, and a storage mock with a quota where the first compacted save must still fit;
- the 10-second save rhythm and Pip's assist parity in the UI.

In real Chromium at an iPad-sized viewport, a 3,254,320-character full-history save loaded in about 0.3 s. It compacted to about 639,000 characters for each of the save and `_backup`, kept 23,685 XP and the final dragon form, and Parents still showed 3780 / 4200 unaided answers correct. The next answer played normally with no page errors.

Limits: not tested on an iPad. A `_before_restore` copy made before this release is not compacted; the next restore replaces it. Parents does not show the archive yet; that is point 8.

Deployment: merged as `cff24b1a485da5cb3db0746d97e70176726ccca4` in [PR #44](https://github.com/Ikarus-eth/Blitzword_app/pull/44). [Pages run 35943643825](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35943643825) succeeded, including deployment. At 01:36 UTC on 24 September 2026 the live page reported build `compact-save-20260924-r1`, and the live `index.html`, `app.js`, `game-core.js` and `storage.js` matched that commit byte for byte.

## Text-selection error fix — 24 September 2026

A selection that starts on a text node made the document `selectstart` and `contextmenu` handlers throw `event.target.closest is not a function`, so they skipped their check. They now use the text node's parent element. Text in Parents and in inputs stays selectable; child screens still block selection. Build marker `selection-fix-20260924-r1`; the `app.js` cache version is updated.

Tests: all 119 core tests and all 40 UI-flow groups pass locally. A new UI flow dispatches selection and context-menu events from text nodes and elements; it failed with the same error before the fix. In real Chromium, clicks, double-clicks and a triple-click on map and Parents text produced no page errors, and Parents text could still be selected.

Deployment: merged as `387058cda06a081b5a462e82142445371f5f3286` in [PR #43](https://github.com/Ikarus-eth/Blitzword_app/pull/43). [Pages run 35942430146](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35942430146) succeeded, including deployment. At 01:20 UTC on 24 September 2026 the live page reported build `selection-fix-20260924-r1`, and the live `index.html` and `app.js` matched that commit byte for byte.

## Backup file on the save-problem dialog — 24 September 2026

When a save fails because storage refuses it, for example when it is full, the grown-up dialog now offers **Save backup file**. It exports the progress still held in memory, including the change that could not be saved. It is not offered when another tab saved newer progress or when the save cannot be read.

Fixed with it: real browser quota errors are `DOMException`s with a numeric `code`. `AdventureStore.save()` passed any error with a `code` through unchanged, so a full device never became the app's storage problem: the dialog showed the raw browser message and offered Reload saved progress, which would discard the unsaved progress. Quota errors now become the storage problem: plain message, Try saving again, Save backup file, no Reload. Build marker `backup-dialog-20260924-r1`; the `app.js`, `storage.js` and `styles.css` cache versions are updated.

Tests: all 119 core tests and all 39 UI-flow groups pass locally, including a real `DOMException` quota error and the dialog exporting unsaved progress. In real Chromium at iPad-sized landscape and portrait viewports, with `localStorage.setItem` forced to throw the quota error, the dialog showed the button and downloaded the in-memory progress.

Deployment: merged as `444e182e463ad174e10256ee42928293fc091c23` in [PR #42](https://github.com/Ikarus-eth/Blitzword_app/pull/42). [Pages run 35942185132](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35942185132) succeeded, including deployment. At 01:17 UTC on 24 September 2026 the live page reported build `backup-dialog-20260924-r1`, and the live `index.html`, `app.js`, `storage.js` and `styles.css` matched that commit byte for byte.

## Backup file (point 1b) — 24 September 2026

Parents → Backup now has **Save backup file** and **Restore from file**; see the [product specification](BLITZWORD_PRODUCT_SPEC.md) for the rules. Build marker `backup-file-20260924-r1`; the `app.js`, `storage.js` and `styles.css` cache versions are updated.

Tests: JavaScript syntax checks, all 117 core tests and all 38 UI-flow groups pass locally. New coverage: file name and contents, refused files, the confirmation text, the kept copy, full storage, another tab's newer save, share, cancel and download paths, and reset erasing the kept copy. A real Chromium run at iPad-sized landscape and portrait touch viewports downloaded a backup, restored a different backup after the confirmation dialog, restored the downloaded file back, and refused a non-backup file without changes.

Limits: not tested on an iPad or in WebKit. The share-sheet path is covered only by test doubles, because headless Chromium has no Web Share. When a save fails, the save-problem dialog covers the Parents screen; the dialog now offers its own Save backup file (next section). Clicking text inside the Parents screen raised a console error from the existing `selectstart` handler (the target can be a text node); fixed on 24 September 2026, see below.

Deployment: merged as `378e6899e0206f2d70d0e6cce04bc46d0ba873a4` in [PR #36](https://github.com/Ikarus-eth/Blitzword_app/pull/36). [Pages run 35938536020](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35938536020) succeeded for that commit, including the deployment step. At 00:29 UTC on 24 September 2026 the live [web app](https://ikarus-eth.github.io/Blitzword_app/) reported build `backup-file-20260924-r1`, and the live `index.html`, `app.js`, `storage.js` and `styles.css` matched that commit byte for byte. The functional browser run used the same files from a local server; Chromium in this environment does not trust the network proxy's certificate for the live site.

## Fullscreen removal — 23 September 2026

Removed the fullscreen control, notice and browser API handlers. JavaScript syntax checks, all 110 core tests and 33 UI-flow groups pass locally. This records implementation and local testing; the Pages workflow records deployment separately.

## Previous verified release checkpoint

The chapter-scenery implementation merged as `a9d39efef14200dd9494b8c779182cc64ec9e73d` in [PR #28](https://github.com/Ikarus-eth/Blitzword_app/pull/28). [Pages run 35833726978](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35833726978) completed successfully for that exact commit, including the deployment step. At that checkpoint, the live [web app](https://ikarus-eth.github.io/Blitzword_app/) reported build `chapter-scenery-20260923-r1`, scenery marker `35-chapters-20260923-r1`, and the unchanged soundscape marker `forest-v2-20260923`.

All 110 core tests and 33 UI-flow groups passed. All 35 background files decode, have distinct hashes and map to the existing stable chapter IDs. Live HTTP 200 responses and source-byte equality were verified for all 35 backgrounds plus seven app/review files on 23 September 2026; see [the deployment record](CHAPTER_SCENERY_DEPLOYMENT.json). These checks establish integration and delivery, not rendered layout quality. Actual browser viewport checks were blocked by the browser security-policy service; no physical iPad test occurred.

That documentation checkpoint added no runtime or asset changes. The fullscreen-removal update uses build marker `remove-fullscreen-20260923-r1` and updates the stylesheet/script cache versions. The previous checkpoint remains available in Git history and the dated chapter-story and soundscape release notes.
