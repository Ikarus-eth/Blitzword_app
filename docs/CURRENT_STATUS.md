# BlitzWord current status — 25 September 2026

This page tracks current implementation and remaining work. Dated release notes preserve historical behavior and test results; their old limitations are not automatically current tasks. Latest approved user decisions take precedence over earlier plans. A difference between approved behavior and code remains a discrepancy, not a new product decision.

The [original curriculum workbook](../curriculum/README.md), maintained documentation and approved production assets are now in GitHub. No standing ChatGPT project attachments are required. The old setup, battle-scroll and teaching-card mockups are retired; see the [project maintenance guide](PROJECT_DESCRIPTION_UPDATE.md).

Documentation reconciled against main `6e7bf84adfa169f0f858c023b5225490acba1967` and the recorded releases. Latest verified runtime build: `enemy-groups-20260925-r2` ([enemy deployment verification](enemies/GROUP_ENCOUNTERS_DEPLOYMENT.json), [latest live byte verification](heroes/ARCHER_ARMS_DEPLOYMENT.json)); the narration completion draft is not merged or deployed. The earlier cleanup changed documentation only. It closes stale assessment/story/gate approval notices, reconciles current growth/speed rules and removes the obsolete lowercase README that conflicted on case-insensitive filesystems. Historical release evidence is retained.

## Implemented

Archer movement study — 25 September: **r1 and r2 are visually rejected by the user.** The r2 screenshots show disconnected hands, exposed sleeve ends, split arms and both hands appearing to belong to one arm. These are structural artwork/attachment defects, not minor seams. The existing source and live-byte tests verified code behavior/publication, not acceptable character anatomy. The r2 review page remains deployed as `archer-study-20260925-r2`; it is not approved for production or expansion to other heroes. See [the failure assessment and proposed replacement workflow](heroes/ARCHER_ARM_CORRECTION.md#visual-rejection-and-reassessment). The user subsequently approved pursuing one authored 2D archer attack exported as complete character frames. The [animator brief](heroes/ARCHER_ANIMATOR_BRIEF.md), approved reference, rejected examples and local handoff archive are prepared. No animator has been commissioned and no replacement animation exists yet; choosing the animation creator remains unresolved. An optional generated-video proof was considered, but the connected Runway Free workspace has no video capability. The existing production build is unchanged. The production hero renderer, approved character identities and learner saves remain unchanged. Historical publication evidence: [PR #91](https://github.com/Ikarus-eth/Blitzword_app/pull/91), merge `d4470ce961dc620cb4965b7ec8265c578cc67f2c`, [successful Pages run](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36091677491), [live hashes](heroes/ARCHER_ARMS_DEPLOYMENT.json).

| Area | Current behavior | Details |
|---|---|---|
| Campaign Home layout | Edge-to-edge campaign art remains. Deployed and verified: tap the current chapter's gold number/full name to continue; no separate Home/Play panel or empty daily quota. Lower-left parent gear with worded subtraction, speed-icon dropdown and tappable hero portrait reduce clutter. | [Map controls](MAP_CONTROLS_RELEASE.md), [initial fullscreen release](FULLSCREEN_MAP_RELEASE.md) |
| Curriculum | 200 distinct workbook targets; seven campaigns with five chapters each; continued review after completion. | [Core 200](CORE200_RELEASE.md) |
| Chapter pacing | A battle is one single- or group-creature encounter; a chapter is one map field; a campaign is one five-chapter map. New chapters require at least ten active minutes, three reading victories, a completed number duel and learning objectives. Extra battles fill the remaining time; a living battle cannot auto-complete. | [XP and pacing](SUCCESS_XP_RELEASE.md) |
| Growth and naming | XP-only evolution at 15,000 / 45,000 / 70,000 XP, with ten visible steps per stage. First growth unlocks naming. Whole XP rewards retain accuracy, speed and word/retention bonuses. Ten active minutes earns 20 XP, boosts correct answers and adds up to 50 returning XP from recent practice days. Existing XP and forms stay earned. | [Whole XP, pacing and verification](XP_PACING_RELEASE.md) |
| Pip evolution scenes | Each earned growth (15,000 / 45,000 / 70,000 XP) opens a recorded intro, Watch, a 2.6 s glow and 1.8 s reveal with four new Pip illustrations, then two untimed sentences with optional Listen and I read it. It waits for combat and a pending number duel; Pause/Home/Rest/reload preserve the phase; no XP, learning evidence or active time; Watch again replays the current form. | [Evolution scenes](EVOLUTION_RELEASE.md) |
| Chapter scenery | 35 distinct chapter backgrounds; 28 newly generated illustrations and seven retained scenes. Active story/encounter IDs determine scenery; campaign maps retain their established art. | [Scenery mapping and verification](CHAPTER_SCENERY_RELEASE.md) |
| Chapter stories and labels | 34 illustrated transitions after the guided first encounter; approved prior-word sentences, a saved two-picture meaning check, optional sentence/word listening and Parents results. No XP, health, mastery or chapter-time credit. Pause/Home/Rest/reopen retain the pending scene and battle. | [Story picture checks](STORY_PICTURES_RELEASE.md) |
| Choices and number duels | Rotating wrong answers: each practice word has 5–7 reviewed candidates and each question draws three that pass the letter, length and one-letter checks; the reading check uses 26 fair fixed sets with shuffled positions ([reviewed table](ASSESSMENT_CHOICES_RELEASE.md)). Multiple-choice-only multiplication, 60 seconds, net +1/−1 scoring, PR-based target, compact results and defeat reactions. Three reading wins plus a won duel earn one non-stacking shield. | [Rotating wrong answers](#rotating-wrong-answers-point-2--24-september-2026), [choices and shields](CHOICES_SHIELD_RELEASE.md) |
| Scheduling (point 3) | Deployed and verified: correct rechecks reschedule after recent help; three independent correct answers cap ordinary current-field practice for the day; freed turns use due reviews, older unseen words, up to three next-field previews at ≥80% recent accuracy, then one faster exposure step. | [Scheduling rules, simulation and verification](SCHEDULING_RELEASE.md) |
| Corrections and teaching (point 4) | Chosen word above target, aligned letter differences and narration of both; full picture teaching for new words, repeated misses and missed reviews. Help shows only the target and keeps the same teaching rule. | [Correction release and verification](CORRECTIONS_RELEASE.md) |
| Speed guidance and quick words (point 7) | Voluntary suggestions after 20 eligible familiar-word answers; Stride (1500 ms), Jog (1200 ms), effective-pace highlighting and per-word historical quick evidence in Parents. Review schedules and Ride/Fly locks remain. | [Speed release and verification](SPEED_GUIDANCE_RELEASE.md) |
| Parent learning view (point 8) | All 200 words with five evidence states, separate quick markers, search/filter and saved histories; common mix-ups, slow-word timings and twelve weekly first-check retention rows. Missing older evidence is explicit; sound settings are last. | [Parent view release and verification](PARENT_LEARNING_RELEASE.md) |
| Combat and presentation | Mage staff/lightning, Pip assists/final blows, answer-locked reactions, cancellation and reduced motion; teaching-image framing, enemy names and Easier-left/Same-right defeat choices. | [Combat](COMBAT_REACTIONS.md), [child feedback](SEPT23_CHILD_FEEDBACK.md) |
| Word-mask spiral | Static golden ribbons with a warm glow and star sparks match the user's new reference. The shared battle/reading-check mask remains 180 × 110 px and identical for every target. | [Reference](BLITZWORD_REFERENCE_IMAGES.md#golden-word-mask-spiral--24-september-2026), [verification](#golden-spiral--24-september-2026) |
| Layered enemies and health timing | Twenty selected enemy families use transparent painted parts and articulated 2D reactions. Visible health and shield consumption wait for impact; damage and observations remain saved immediately. | [Enemy release and source assets](enemies/LAYERED_ENEMIES_RELEASE.md) |
| Game controls | Fullscreen button, handlers and notice removed at the user’s request. The existing flexible toolbar closes the gap; sound, pause and Home remain. Home Screen presentation and learner saves are unchanged. | [Product specification](BLITZWORD_PRODUCT_SPEC.md) |
| Soundscape | Continuous low battle music through words and choices, restrained flute/percussion, gentle speech ducking and independent saved controls. Deployed and verified; release checks follow below. | [Soundscape](SOUNDSCAPE_RELEASE.md) |
| Narration | 1,029 exact-text clips are mapped and Pages-deployed: 990 recovered/core, four Pip-evolution, 34 chapter-story introductions and one reusable shield prefix. The user listened to all 35 new George clips and approved all of them. Current child-read story sentences, new enemy introductions and comparison corrections still need the completion batch; personalized names remain local. Production manifest `recorded-voice-20260924-r5`; completion remains in draft PR #80. | [Narration release](NARRATION_RELEASE.md) |

## Group encounters — 25 September 2026

User authorization: implement the previously discussed HP ranges, groups and growth forms, deploy and confirm. Build `enemy-groups-20260925-r2` adds 60 curated variants across the 20 families. Groups have two, three or five separately rendered creatures; one shared HP bar and one collective attack; defeated members retreat at the 660 ms impact and stay defeated through pause/reload. Baby/small, young and adult rigs change head/limb/wing/tail proportions and golem foliage. Three-HP training encounters and in-progress legacy saves remain intact. Eligible variants rotate using bounded visit counts so later families are not starved.

Local verification: 244 core tests and 86 UI-flow groups pass, including group health conservation, all member counts, save/reload, impact timing, shields, final blows and reduced motion. Chromium passed 24 full/partial group layouts at four tablet/phone sizes and all 60 family/stage renders, with no page errors or learner-storage writes. Physical iPad/Safari remains untested. The feature release was deployed in [PR #90](https://github.com/Ikarus-eth/Blitzword_app/pull/90), merge `e7d038556af2de8f541b6c5754333f0593a34553`; [Pages run 36091409051](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36091409051) passed. Eight live runtime/review files matched the tested source byte for byte. The `enemy-groups-20260925-r2` follow-up keeps only surviving members in the defeat escape scene. It merged in [PR #92](https://github.com/Ikarus-eth/Blitzword_app/pull/92) as `8fcc99dbc182ca12363ef58315c616e8b8daac17`. The combined main `d4470ce961dc620cb4965b7ec8265c578cc67f2c` preserves the parallel archer correction; [Pages run 36091677491](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36091677491) deployed successfully. At 03:48 UTC, all eight checked live files matched the tested r2 source exactly. [Live verification](enemies/GROUP_ENCOUNTERS_DEPLOYMENT.json). [Rules, HP table and limits](enemies/GROUP_ENCOUNTERS_RELEASE.md).

## Thornling tail crop — 25 September 2026

Build `thornling-tail-20260925-r1` removes the detached green strip behind the Thornling's tail. The tail's atlas viewport included part of the neighbouring mane; a source-coordinate clip now excludes that piece without changing the original PNG, viewport, scale, joints or learner saves. The metadata inspection script preserves this correction when rerun. Runtime and enemy-studio script URLs refresh the crop on reload.

Local verification: all 234 core tests and 83 UI-flow groups passed. Isolated Chromium checks passed neutral, attack, hit, defeat and celebration at tablet and phone sizes, five simultaneous copies with unique clips, and reduced motion, with no page errors. Before/after screenshots show the detached strip removed; the substantial pixel differences are confined to it. Physical iPad/Safari is untested.

Deployed in [PR #82](https://github.com/Ikarus-eth/Blitzword_app/pull/82), merge `6e7bf84adfa169f0f858c023b5225490acba1967`. [Pages #91](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36076816957) succeeded. At 00:26 UTC on 25 September, the live build marker and cache-busted `index.html`, `enemy-art-data.js`, `enemy-art.js` and `tests/enemy-review.html` matched that merge byte for byte. Main was still that commit.

## Reload and Pip crop fixes — 24 September 2026

Deployed and verified. Delayed unload storage events no longer falsely report another tab after immediate reload; genuine competing saves still block safely. Explicit sprite clipping removes neighbouring Pip rows in growth and battle. Learner saves and art are preserved.

[PR #78](https://github.com/Ikarus-eth/Blitzword_app/pull/78), merge `5df0943f7cc8b1d00eff3af46bcda72b5b17e655`; [Pages #88](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36006071413) succeeded. At 13:33 UTC, build `reload-pip-fixes-20260924-r1` and both changed live files matched that merge byte for byte. 232 core tests, 83 UI groups and twelve isolated Chromium scenarios passed. [Release](RELOAD_PIP_RELEASE.md), [verification](BUGS_ASSESSMENT_DEPLOYMENT.json). Physical iPad/Safari remains untested.

## Fair reading-check choices — 24 September 2026

Deployed and verified: all 26 fixed sets pass the letter/length and one-letter checks; the similarity heuristic falls from 90.4% to 24.0%. Saved pending options and all calibration rules are preserved. 234 core tests and 83 UI groups pass. Merged in [PR #79](https://github.com/Ikarus-eth/Blitzword_app/pull/79) as `16001a278665ea5f262117b06a3177f9ae683097`. [Pages #89](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36007428791) succeeded. At 13:47 UTC, build `assessment-fair-20260924-r1` and both changed live files matched that merge byte for byte. [Verification record](BUGS_ASSESSMENT_DEPLOYMENT.json). [Details](ASSESSMENT_CHOICES_RELEASE.md).

## Outstanding work and ownership

- Narration completion is authorized but blocked by ElevenLabs quota. Production retains all 1,029 approved clips. [Draft PR #80](https://github.com/Ikarus-eth/Blitzword_app/pull/80) preserves 320 new segments and one teaching alignment, with tested playback/cancellation changes. The last generation run on 24 September reported `quota_exceeded`: 10,000-credit limit, 26 remaining. This is the last observed allowance, not a fresh account-balance check. The user was asked to increase allowance; 18,534 text characters and 365 alignments remain. Current story sentences are already approved: they need recordings, not another rewrite. The incomplete batch is not deployed. New listening approval and physical iPad playback remain open.
- Device review remains open: physical iPad/Safari audio, interruptions/resume, touch layouts, backup/restore and sustained combat have not been verified. Evolution scenes and selected combat layouts were rendered in Chromium. All 35 scenery files were verified live, but the complete tablet/phone scenery review was not completed; the earlier browser-policy blocker and review fixtures are recorded in [chapter scenery](CHAPTER_SCENERY_RELEASE.md).
- Child-session pacing needs observation under the 15,000 / 45,000 / 70,000 growth thresholds. Current XP pacing evidence comes from deterministic simulations, not a new observed child session.
- Optional user review remains for 18 rare practice distractors ([candidate table in PR #58](https://github.com/Ikarus-eth/Blitzword_app/pull/58)), the implemented Stride/Jog names and icons, and the faint square edge around the evolution illustrations ([details](EVOLUTION_RELEASE.md)). The separate neighbouring-row sprite defect is fixed.
- Number-duel point 10 remains parked: difficulty/adaptation and less guessable choices require discussion. Twenty enemy families are shipped; their approved health ranges, group encounters and age proportions are deployed and verified in the group release described above. The fifteen added enemy names still use device speech pending the narration batch.
- Native iPad/App Store packaging, offline support/progress transfer, purchase/restore, pricing and commercial validation remain later-phase work. The 1,000-word workbook is a future pool; only the Core 200 is playable. Optional phonics, spellbook and an additional dragon after full growth are not approved current tasks. Pip remains a provisional child-facing label; no commercial rename is established.

## Reading the historical records below

The dated release entries preserve the behavior, tests and access limits at each checkpoint. Their old build markers, growth thresholds, approval gates and “next point” instructions are historical, not current work. The outstanding-work list above and the updated plan-status table below determine what remains.

## Golden spiral — 24 September 2026

Build `golden-spiral-20260924-r1` replaces the two-line word mask with tilted golden ribbons, cream light cores, amber glow and static star sparks, following the user's supplied reference. The inline SVG stays 180 × 110 px in the existing shared battle/reading-check renderer. Exposure and choice timing, learning rules, save keys and other artwork are unchanged.

Local verification: `npm ci --ignore-scripts --offline` succeeded; all 205 core tests and 71 UI-flow groups passed. Isolated Chromium previews at 1180 × 820, 820 × 1180, 390 × 844 and 844 × 390 verified four answer choices, fixed mask dimensions, no mask animation (including reduced motion), no horizontal overflow, no page errors and no learner-storage writes. The four layouts were visually reviewed. Physical iPad/Safari remains untested.

Deployed through [PR #70](https://github.com/Ikarus-eth/Blitzword_app/pull/70), merge `1aa99d2e5029add1e8cdc151f0071912c4935a36`. [Pages run 35983064752](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35983064752) passed all checks and its deployment step. At 09:46 UTC on 24 September 2026, live `index.html`, `app.js` and `styles.css` returned HTTP 200 and matched the tested source byte for byte, including build `golden-spiral-20260924-r1`. [Verification record](GOLDEN_SPIRAL_DEPLOYMENT.json). Reload on iPad to load the updated assets. Previous main `2701e0a2712a3f3ae3507afa45dbe95ffc7307c9` is the rollback checkpoint; no save reset is needed.

## Layered enemy release — 24 September 2026

The recovered handover was merged onto current `main` (`e9d64e2`), preserving Pip evolution, all 1,029 narration clips, shield-prefix sequencing, rotating answer choices, compact saves and backup work. Twenty selected enemy families use layered RGBA atlases and the existing DOM/SVG renderer; reading and answer-selection phases remain still. The answer commits health, shield consumption and learning observations immediately, while the visible HUD waits for the shared 1,200 ms reaction impact at 660 ms, settles on cancellation and reveals immediately under reduced motion. All 146 Node tests and 52 UI-flow groups passed locally.

An isolated headless Chromium run checked all twenty atlases, neutral/attack/hit/defeat/celebration states, group previews and reduced motion at 1180×820 and 390×844; actual battle layouts were also rendered at both sizes. There were no page errors. Storm Griffin framing was widened after the review found clipped wing tips. Physical iPad/Safari behavior, sustained frame-rate and child-play evidence remain unverified. Creature-specific HP ranges, combat groups and distinct growth forms are proposals, not release rules. See [the layered enemy release](enemies/LAYERED_ENEMIES_RELEASE.md).

Deployment: merged as `9767f0cd0765af7cec8bbcf3b7e60c26a03f81c5` in [PR #60](https://github.com/Ikarus-eth/Blitzword_app/pull/60). [Pages run 35963694304](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35963694304) passed all checks and its deployment step. At 06:17 UTC on 24 September 2026, 33 live HTTP 200 files matched the tested source byte for byte: all 20 enemy atlases plus 13 runtime/review files. The live build marker is `layered-enemies-20260924-r1`. See the [per-file verification record](enemies/LAYERED_ENEMIES_DEPLOYMENT.json) and [live enemy studio](https://ikarus-eth.github.io/Blitzword_app/tests/enemy-review.html). The previous main commit `e9d64e2` is the rollback checkpoint; no learner data reset is needed.

### Approved plan — 23 September 2026

The original sequence (1, 2, 3, 4, 6, 7, 8) and subsequently authorized point 9 are deployed and verified. The table gives current status; the detailed evidence/build notes below it record the original 23 September plan. Do not restart completed points or treat their earlier approval gates as pending. The later three-priority audit batch separately authorized both bug fixes, fair reading-check choices and narration completion; only narration remains unfinished. Latest explicit user instructions continue to govern the [working rules](../CLAUDE.md).

| # | Point | Status |
|---|---|---|
| 1 | Durable saves: 1b backup file first, then 1a smaller save | 1b deployed and verified live on 24 September 2026; the user saved an iPad backup. The save-problem dialog also offers the backup file. 1a deployed and verified live on 24 September 2026 (build `compact-save-20260924-r1`) |
| 2 | Rotating distractor pools (option b) | Deployed and verified live on 24 September 2026 (build `rotating-choices-20260924-r1`). The follow-up fair fixed reading-check sets are also deployed and verified in PR #79 |
| 3 | Scheduling bug fix plus daily cap and refill (option a) | Deployed and verified live on 24 September 2026 (build `scheduling-refill-20260924-r1`). [Release record](SCHEDULING_RELEASE.md) |
| 4 | Contrast correction and adaptive teaching depth (a + b) | Deployed and verified live on 24 September 2026 (build `contrast-teaching-20260924-r1`). [Release record](CORRECTIONS_RELEASE.md) |
| 5 | Narration | Stable remainder implemented and listening-approved: 34 story introductions + reusable shield prefix. Final recordings for the already-approved child story sentences, new enemy/comparison phrases, word-boundary timing and device review remain open in draft PR #80; last blocked by quota |
| 6 | Story sentences a child can read (option c) | Deployed and verified live on 24 September 2026 (build `story-pictures-20260924-r1`). All 34 pairs approved. [Release record](STORY_PICTURES_RELEASE.md) |
| 7 | Speed suggestions, two new steps, per-word quick status | Deployed and verified live on 24 September 2026 (build `speed-guidance-20260924-r1`). Names/icons proposed for review. [Release record](SPEED_GUIDANCE_RELEASE.md) |
| 8 | Parent view: word map, tricky list, weekly retention | Deployed and verified live on 24 September 2026 (build `parent-learning-20260924-r1`). [Release record](PARENT_LEARNING_RELEASE.md) |
| 9 | Whole XP, slower growth and consistency | Deployed and verified on 24 September 2026. Whole rewards, 15,000 / 45,000 / 70,000 thresholds, ten growth steps and a returning-day bonus. Build `xp-pacing-20260924-r1`. [Release record](XP_PACING_RELEASE.md) |

The following numbered requirements and evidence are historical planning notes. Use the table above for completion status and linked release records for tested behavior.

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

**5. Narration.** Recovery and targeted pronunciation review are complete, including all five gate-family phrases. Production maps 1,029 recordings. Device speech covers unfinished story/enemy/comparison phrases and intentionally personalized names. See [the narration release](NARRATION_RELEASE.md) and the current quota blocker above.

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

- **10. Number duel:** later. Evidence: age is collected but unused; all 100 facts from 1×1 to 10×10 come up at random with −1 per wrong answer; picking the middle number scores 41%. Ideas: levels by age and results, per-fact tracking, balanced distractors.
- **Options not chosen:** offline cache (1c); same-position distractor sets (2a, rejected); font or case change on the flash (2c); rolling word pool (3b); test-out (3c); splitting the 8 look-alike pairs that share a chapter; sound-it-out cards (4c); say-it moments (6a); meaning duels (6b).

## Scheduling (point 3) — 24 September 2026

Build `scheduling-refill-20260924-r1` implements the approved scheduling fix, daily cap and ordered refill. It preserves the layered-enemy work from `9767f0c`, learner saves, selected speed, movement locks and chapter objectives. All 162 core tests and 53 UI-flow groups pass on Node 22.23.3. The reproducible 30-day, 15-min/day model reduces turns on already-secured current-field words from 32.2% to 17.7% and increases mean distinct words/day from 33.6 to 48.6. Review-only coverage rises from 35.8 to 74.0 distinct words/day. Full definitions, the broader not-yet-due measure and limits are in [the release record](SCHEDULING_RELEASE.md).

Merged in [PR #62](https://github.com/Ikarus-eth/Blitzword_app/pull/62) as `49c4fcb986f0114d2f215ae16e73d97abd34428e`. [Pages run #72](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35965441688) succeeded, including deployment. At 06:41 UTC on 24 September 2026, the live marker was `scheduling-refill-20260924-r1`; cache-busted `index.html` and `game-core.js` matched that merge byte for byte, and `main` was still that commit. [Verification record](SCHEDULING_DEPLOYMENT.json). Physical iPad and Safari/WebKit checks remain open. Point 4 was subsequently authorized; its implementation and release state are recorded below.

## Rotating wrong answers (point 2) — 24 September 2026

Each of the 200 practice words has 5–7 reviewed wrong-answer candidates in `content.js`: 1,124 in total, 251 of them made up. Each new question draws three. Every drawn set passes all of these checks:
- The target's first letter, last letter, first and last letters together, and length each match at least two of the four options.
- Every letter of the target also appears, at the same position, in at least one wrong option, so one letter cannot give the answer away (night/light/right/might fails).
- Picking the option most like the other three (lowest total edit distance, a swap of neighbouring letters counting as one edit) finds the answer in at most half of the cases for that set, ties split evenly.

When a word has two or more sets where that guess works at most one time in three, only those sets are drawn. "a" and "i" are shown with three other single letters. Made-up candidates are never curriculum words.

Across all 200 words, the middle-option guess now finds the answer 28.9% of the time, down from 89.7% with the old fixed options; chance is 25%. Per word: 134 words at 25% or less, 27 at 26–33%, 34 at 34–45% and 5 at 46–50% (in, all, again, ask, because). Each word has 2–20 fair sets. Questions already saved keep their options. The old three-option lists stay in `content.js` for saved history, the legacy word and the tests.

At this practice-pool release, the unchanged reading check scored 90.4% on the same heuristic (levels 1–5: 91.7%, 100%, 90%, 90%, 75%). That finding was subsequently resolved in PR #79: all 26 fixed sets pass the checks and the heuristic is 24.0%. [Current reading-check release](ASSESSMENT_CHOICES_RELEASE.md).

Build marker `rotating-choices-20260924-r1`; the `content.js` and `game-core.js` cache versions are updated.

Tests: all 143 core tests and all 49 UI-flow groups pass locally. The new `tests/choices.test.js` checks:
- 5–7 candidates per word, no repeats, and every candidate drawable;
- 400 seeded questions per word: the letter, length and one-letter checks hold on every question; the middle-option guess works at most half the time on any question and at most 35% overall; wrong answers and the answer's position rotate;
- made-up candidates against the curriculum workbook's 1,000 words, and every candidate against a list of blocked words;
- a battle question and a reading-check question saved with old options keep them through a save and reload, and the reading check at this release retained its then-current fixed options. The later fair-set regression coverage is recorded in [PR #79’s release](ASSESSMENT_CHOICES_RELEASE.md).

The test file recomputes the checks independently of `game-core.js`. Nine deliberate faults each made it fail, for example random draws, no one-letter check, and no neighbour swap in the edit distance.

In real Chromium at an iPad-sized viewport, new practice questions showed fair drawn sets. A question saved with the old options showed them unchanged, both at first load and after leaving and reopening the page. There were no page errors.

Limits: not tested on an iPad. 18 candidates, used 27 times across the lists, are real but rare words a child will likely treat as made up (for example awn, awl, oaf, iff, hew); the rules allow them.

Deployment: merged as `ce2d3cc690fbe4bd1a50878a34d6fde596774f8b` in [PR #58](https://github.com/Ikarus-eth/Blitzword_app/pull/58), which lists every candidate for review. [Pages run 35962288112](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35962288112) (#68) succeeded, including its test step and deployment. At 05:59 UTC on 24 September 2026 the live page reported build `rotating-choices-20260924-r1`, and the live `index.html`, `content.js` and `game-core.js` matched that commit byte for byte.

## Pip evolution scenes — 24 September 2026

The recovered Pip evolution work is integrated with current `main` without changing the narration, narration QA and approved-replacement, backup, selection-fix or smaller-save work. Growth stays XP-only at 3,000 / 8,900 / 13,400 XP. Existing saves migrate in place: already-earned forms count as seen and can be replayed, and names, XP and learner records are unchanged. The four evolution recordings join the approved narration corpus (994 clips, all mapped at runtime). Build marker `pip-evolution-20260924-r1`; the `content.js`, `game-core.js`, `narration.js`, `app.js` and `styles.css` cache versions are updated.

Tests: JavaScript syntax checks, all 132 core tests and all 49 UI-flow groups pass locally. The narration asset test now expects 994 recorded clips (four evolution clips added on purpose) and checks the evolution lines map to their files. Headless Chromium rendered all three scenes at tablet landscape/portrait and phone portrait/landscape sizes with no errors, clipping or hidden buttons, and ran the real final-answer → combat → evolution → result flow; see [evolution scenes](EVOLUTION_RELEASE.md). Not tested on an iPad or in WebKit; the clips passed the user's narration QA, but playback inside the scene was not listened to.

Deployment: merged to `main` as `589c8219d6842683d2485065505e666a4db3821b`, a merge of branch `claude/pip-evolution-release` at `fd2bb40`. There was no pull request, because this session could not reach the GitHub API; the user asked for the deployment. [Pages run 35957905729](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35957905729) (#62) succeeded for that commit. `main` was still that commit when the run finished, and the run uploaded the `github-pages` artifact and reported the Pages URL. At about 05:00 UTC on 24 September 2026, the live `index.html` reported build `pip-evolution-20260924-r1` and the live `narration.js` reported manifest `recorded-voice-20260924-r4` with 994 clips. These were read through a web-fetch tool, because direct HTTP to the Pages origin is blocked in this environment. Byte comparison of the live WebP and MP3 files was therefore not possible; the deployed commit contains the expected hashes (for example `pip-stage-3.webp` `93243b98…`, `evolution-3.mp3` `642911aa…`).

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


## Contrast corrections and adaptive teaching (point 4) — 24 September 2026

Deployed and verified. Wrong answers now stack chosen/target words with aligned, highlighted differences and narrate both. Continue uses the saved teaching decision: full picture cards for new words, two or more consecutive independent misses and missed due reviews; other corrections continue directly. “?” shows just the target, applies the same depth rule, costs no heart and adds no mastery evidence. Two intervening items, saved-answer identity, shield/impact timing and chapter rules are preserved.

Node 22.23.3: 176 core tests and 57 UI-flow groups pass. Eleven isolated Chromium cases cover tablet/phone layouts, substitutions/additions/deletions/swaps, accessible whole-word labels, shield placement, saved correction reopening, replay and both Continue routes, with zero page errors. New comparison phrases use device speech; existing recordings are retained. Physical iPad/Safari and listening checks remain open. See [release details](CORRECTIONS_RELEASE.md). Point 6 remains unstarted and requires the next “go”, followed by approval of all 34 sentences and picture pairs before building.


Merged in [PR #64](https://github.com/Ikarus-eth/Blitzword_app/pull/64) as `8e4c00220607f677a27a7601c6370659fbd068b0`. [Pages run #74](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35967455461) succeeded, including tests, artifact upload and deployment. At 07:03 UTC on 24 September 2026, `main` was still that merge and the live build marker was `contrast-teaching-20260924-r1`. Cache-busted downloads of all four changed runtime files matched `git show <merge>:<file>` byte for byte. [Verification record](CORRECTIONS_DEPLOYMENT.json).


## Point 6 review preparation (before approval) — 24 September 2026

The user authorized preparation of the complete 34-entry sentence and picture review. [The proposal](STORY_SENTENCE_REVIEW.md), [picture gallery](story-review/index.html) and [exact wording, sources and vocabulary audit](story-review/proposal.json) are review documents, not implemented gameplay. At this preparation stage, the wording and pairs still required approval; the subsequent approval and implementation are recorded below.

The current workbook and runtime have the same 200 targets. An exact prior-field audit finds 26 current sentences with untaught words; the proposed set reduces this to three early single-word listening exceptions (entries 01 jump, 03 the, 04 look). The other 31 use only previously introduced targets plus the dragon name. Existing approved pictures supply every proposed pair, including exact crops for the open/closed book. No new art is proposed. Several early lines deliberately recap known scenes because function words and location names are not yet taught.

The preparation stopped at approval of all 34 sentences and pairs. The next step was to replace I read it with the approved two-picture prompt, add optional word listening and first-choice/help records, preserve saved story phases and battle handoff, and verify that either choice continues without XP, mastery or health consequences. At preparation, the live build was contrast-teaching-20260924-r1; the proposal changed no app files or learner saves.

Proposal validation: exact prior-word and asset checks pass; all 68 pictures load in Chromium at tablet landscape, tablet portrait and phone widths, without horizontal overflow or page errors. All 18 PDF pages were inspected. The existing 176 core tests and 57 UI-flow groups pass on Node 22.23.3. Physical iPad/Safari review remains open. [Verification record](story-review/verification.json).


## Point 6 implementation — 24 September 2026

The user approved all 34 sentences and picture pairs from PR #66 (“ok go ahead”). The exact approved set now runs in the existing chapter-story screen. After the original narrated introduction, the child reads the sentence and chooses a picture. One saved shuffle determines the pair order; the first choice and sentence/word listening persist immediately. A wrong choice shows the matching picture and offers Continue without a retry or penalty. Parents records outcomes separately from word learning and labels earlier confirmations without inventing results.

The three underlined listening exceptions are jump, the and look. Either outcome adds no XP, health change, mastery, active time or chapter progress. Unavailable/stalled art can be skipped with no fabricated answer. Old pending stories migrate in place; completed stories remain completed. The pending battle and all learner-save keys remain intact. Existing narration recordings and artwork are unchanged.

Implementation and local checks are complete: 184 core tests, 63 UI-flow groups and 40 Chromium scenarios pass. Physical iPad/Safari and listening remain untested. Deployment is verified. Build: `story-pictures-20260924-r1`. [Release and verification details](STORY_PICTURES_RELEASE.md). The earlier proposal verification remains a dated review record. Point 7 is unstarted and requires a separate go.

Merged in [PR #66](https://github.com/Ikarus-eth/Blitzword_app/pull/66) as `e0a7cf7bf66ee93960b56f73291e350683ab7f8f`. [Pages run #76](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35974775288) passed the checks and deployed. At 08:23 UTC on 24 September 2026, the live marker was `story-pictures-20260924-r1` and all five changed runtime files matched that merge byte for byte. [Verification record](STORY_PICTURES_DEPLOYMENT.json).


## Speed guidance (point 7) — 24 September 2026

Build `speed-guidance-20260924-r1` implements optional one-step speed offers after 20 eligible familiar-word answers, Stride (1500 ms), Jog (1200 ms), effective-speed highlighting and per-word quick evidence in Parents. Concentrated misses keep word help first. Suggestions, settings, pending questions and archived quick counts survive reopening; Ride/Fly gates and existing review schedules remain. The proposed names and line icons are ready for user review. The older self-paced checkbox now also preserves a saved ready question, and the map label follows accepted pace changes.

All 205 core tests and 71 UI-flow groups pass on Node 22.23.3; 33 isolated Chromium scenarios pass without page errors. Exact rules and limitations are in [the release record](SPEED_GUIDANCE_RELEASE.md). Merged in [PR #68](https://github.com/Ikarus-eth/Blitzword_app/pull/68) as `7f8dcd11b9b56d8873eb8f5df36e9ead34b5249d`. [Pages run #78](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35978654773) succeeded, including deployment. At 09:02 UTC on 24 September 2026, the live marker was `speed-guidance-20260924-r1`; cache-busted `index.html`, `game-core.js`, `app.js` and `styles.css` matched the merge byte for byte, and main was still that commit. [Verification record](SPEED_GUIDANCE_DEPLOYMENT.json). Physical iPad and Safari/WebKit have not been tested. Stop here; point 8 awaits the next go.


## Continuous battle soundscape — 24 September 2026

Implemented at the user's request to remove the irritating 1–3-second music bursts between words. The background now stays low through fixation, word exposure, masking, answer choices and combat. Battle flute/percussion is restrained throughout; speech gently ducks the background and it recovers slowly. Reading still blocks one-shot effects. Assessment, teaching, pause/background, mute and Quiet play keep their quiet behavior. Existing volume settings, narration, learner saves and all learning rules are preserved. [Concept and mix details](SOUNDSCAPE_RELEASE.md).

Build `continuous-battle-20260924-r1`. Local automated validation: 208 Node tests and 73 UI-flow groups pass on Node 24.19.0. New checks cover repeated question/speech/combat cycles without music stops or loop restarts, nonzero speech ducking, timed and self-paced reading, cancellation, independent volume controls and quiet screens. Chrome 154 also passed three consecutive turns in each of timed and self-paced modes: real decoded music produced a nonzero signal during choices, the music gain stayed at 0.39 (0.156 during speech), loops kept their start time, and pause/mute silenced the buses, with no page errors. [Browser measurements](BATTLE_SOUNDSCAPE_VERIFICATION.json). Deployed in [PR #73](https://github.com/Ikarus-eth/Blitzword_app/pull/73), merge `c8b352c4949de78d4a2c1713c23b7161bb41a77e`. [Pages run 35983656280](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35983656280) passed the full checks and deployment. At 09:51 UTC, the live build and soundscape markers were `continuous-battle-20260924-r1`; all three changed runtime files returned HTTP 200 and matched the tested source byte for byte. Current main was still that merge when verified. [Deployment record](BATTLE_SOUNDSCAPE_DEPLOYMENT.json). Physical iPad/Safari playback and subjective listening have not been verified.


## Parent learning view (point 8) — 24 September 2026

Deployed and verified: the exact 200-word map with five evidence states and a separate quick marker; word search/filter/history; common mix-ups, letter-position counts and slow-word timings; twelve weekly first-check retention rows. Learning is above play totals and sound settings are at the bottom. Recent and archived totals are combined without editing learner evidence. Earlier missing gap/first-check detail is marked unavailable instead of invented.

All 225 core tests and 78 UI-flow groups pass on Node 22.23.3, including the 90-day, 45-min/day save-size regression. Browser checks and data limits are recorded in [the release record](PARENT_LEARNING_RELEASE.md). Merged in [PR #72](https://github.com/Ikarus-eth/Blitzword_app/pull/72) as `e6351235ecdfeb19f3fbe43a4b33f1a2b410e34e`. [Pages run #84](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35984212573) succeeded, including deployment. At 09:56 UTC on 24 September 2026, the live marker was `parent-learning-20260924-r1`; cache-busted `index.html`, `game-core.js`, `app.js`, `styles.css` and the preserved `soundscape.js` matched the merge byte for byte. Main was still that commit. [Verification record](PARENT_LEARNING_DEPLOYMENT.json). The parallel golden spiral and continuous battle audio are preserved. Physical iPad and Safari/WebKit remain untested. Stop here: the approved sequence through point 8 is complete. Point 9 is discussion-only and point 10 remains parked.


## Whole XP and slower growth (point 9) — 24 September 2026

The user authorized point 9 using their son's reported 30-minute / roughly 1,000-XP session as the reference, then chose whole XP and round growth thresholds of 15,000 / 45,000 / 70,000. Deployed and verified: whole boosted answer awards, the existing learning/accuracy incentives, up to 50 XP for recent qualifying practice days, and ten static growth steps. Existing XP, earned forms, names and queued evolution scenes remain; an existing form keeps its step origin. The number duel's scoring and learning rules remain unchanged.

Local validation passed: 232 core tests, 81 UI-flow groups, 13 syntax checks and 16 isolated Chromium scenarios at four tablet/phone sizes. The 90-day save-size regression still passes. Merged in [PR #76](https://github.com/Ikarus-eth/Blitzword_app/pull/76) as `e228b30c26ea03a81ee99f593f7fea3e709dce41`. [Pages run #86](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36001494122) passed checks and deployment. At 12:50 UTC on 24 September 2026, the live marker was `xp-pacing-20260924-r1`; all seven changed published files plus the preserved soundscape matched that merge byte for byte, and main was still the merge. [Verification record](XP_PACING_DEPLOYMENT.json). [Rules and calibration](XP_PACING_RELEASE.md). Physical iPad/Safari remain untested. Stop after verified deployment; point 10 remains parked.
