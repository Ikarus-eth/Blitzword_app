# Scheduling, daily cap and refill — point 3

Build: `scheduling-refill-20260924-r1`. Implemented against `9767f0c`, including the parallel layered-enemy release. Deployment verification is recorded separately below.

## Rules implemented

- A correct answer to an overdue established review, within 24 hours of help, moves its due time to `lastHelpAt + 24 hours`. It does not advance the review stage. A later independent answer after that interval uses the existing retention schedule. The regression first failed on the unchanged source with the old overdue timestamp.
- After three independent correct practice answers on the device's local date, a current-chapter word leaves ordinary selection for that date. Supported answers, demo and assessment do not count. A saved unanswered question keeps its options, exposure and identity.
- The existing two-of-three reservation for current-chapter practice remains while eligible uncapped targets remain. Freed turns use, in order: eligible older due reviews; introduced older words not seen today, least recently seen first; at most three distinct words from the next map field while recent independent accuracy is at least 80%; current-field words at one faster exposure step.
- Recent accuracy retains the existing last-eight-independent-answer measure. Previews count as introduced and use the existing new-word accounting. The three-word preview limit persists across sessions, dates and reloads because it derives from introduced words in the next field. Preview practice also stops at three independent correct answers per word that day. The next field and campaign remain locked until their existing progression requirements are met.
- The final refill uses one step on 2200 / 1800 / 1500 / 1200 / 950 ms, measured from the selected/calibrated speed each time. It never compounds across questions. Crawl stays self-paced, Run stays at 950 ms, and the existing Ride/Fly entitlement locks are unchanged. Already entitled faster modes remain unchanged. The selected speed and assessment calibration are not rewritten.
- Every path keeps two distinct intervening answers after help. The ten-minute chapter minimum, learning objectives, three victories, played number duel and combat-boundary rules are unchanged.

“Chapter” above means one map field, not the thirty-word campaign represented by the older `chapterId` naming.

## Save compatibility

`learning.dailyPractice` holds one latest local date and a correct count capped at three per known word. It is bounded by the vocabulary, survives raw-history compaction and is saved with the existing state. No storage keys change.

Old saves seed these counts from retained independent answers before compaction. The old archive did not keep the joint per-word/per-day counts, so answers already removed from raw history before this upgrade cannot be reconstructed into the cap. Their existing archive totals and all learner progress remain intact. The first upgrade day may therefore allow extra repetitions; subsequent counts are retained independently of raw history.

## Before/after simulation

Reproduce on Node 22:

```sh
node scripts/simulate-scheduling.cjs 9767f0c
```

[Full results and daily rows](SCHEDULING_SIMULATION.json) compare the same loop with the baseline commit and this implementation. Each scenario runs for 30 days, uses an eight-second reading-answer cycle, six-second number answers, 90% independent accuracy (every tenth answer wrong), Walk and six-heart enemies. Saves migrate between days. The review-only scenario starts with all 200 words introduced, all fields completed, review stage 2 and every word due. These are deterministic model results, not observed children or evidence of learning gains.

“Secured current-chapter turns” follows the approved plan's measure: the current field's word already has at least two practice successes and is not due, measured just before the answer. Faster refill turns are included, not hidden.

| Scenario | Secured current-chapter turns before → after | Mean distinct words/day before → after | Most repetitions of one word/day before → after |
|---|---:|---:|---:|
| Fresh story, 15 min/day | 32.2% → 17.7% | 33.6 → 48.6 | 11 → 11 |
| Fresh story, 45 min/day | 12.3% → 6.6% | 75.2 → 173.2 | 59 → 12 |
| Review only, 15 min/day | Not applicable | 35.8 → 74.0 | 23 → 3 |

The broader measure across **all** words with two successes and a future due time rises: 32.5% → 39.7%, 25.6% → 65.8%, and 17.1% → 63.8%, respectively. It includes the explicitly approved older-word refill, and the review fix stops classifying recently helped words as perpetually overdue. This release reduces repetitive current-field turns and broadens daily coverage; it does not reduce every kind of not-yet-due practice. Faster final refill accounts for 2.5% and 3.7% of turns in the two fresh-story scenarios. Both versions complete all 35 fields within each fresh-story scenario.

The handover's earlier approximate results used an uncommitted simulation. They are not represented here as a reproduced baseline; the checked-in loop and exact baseline commit make these comparisons repeatable.

## Verification

- `npm ci --ignore-scripts && npm test` passes on Node 22.23.3: 162 core tests and 53 UI-flow groups.
- Sixteen scheduling tests cover the failed-review regression, cap, refill priority, least-recent older words, 80% boundary, preview persistence and campaign boundaries, help spacing, exposure steps, saved questions, Crawl and movement locks, local midnight, compaction, migration and unchanged chapter gates.
- One new UI-flow group verifies saved faster refill, reopening, unchanged answer options and Walk setting, damage and accepted-answer saving.
- The extended-play test's old six-new-word bound is deliberately changed to nine: six current-field words plus the three approved previews. Dedicated scheduling tests check both parts of that bound. Other existing test expectations are unchanged.
- The 90-day, 45-minute save-size regression passes, as do the complete-story and existing XP calibration regressions.
- Isolated Chromium 154.0.8037.57 checked due-review, older-word and preview selection plus faster refill at 1180×820 and 820×1180 touch viewports. Leaving and reopening preserved each question's identity, options and exposure; correct answers saved damage and evidence while Walk stayed selected. All five cases had zero page errors. The captured tablet layouts keep the answers and controls visible. These checks used synthetic local saves and did not alter a learner's data.

Physical iPad and Safari/WebKit checks have not been performed for this release.

## Deployment

Implemented in [PR #62](https://github.com/Ikarus-eth/Blitzword_app/pull/62), merged as `49c4fcb986f0114d2f215ae16e73d97abd34428e`. Current `main` was fetched and merged into the task branch before the PR merge, preserving the parallel enemy deployment record from `0fb23d3`.

[Pages run #72](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35965441688) succeeded for that exact merge, including the regression checks, artifact upload and deployment. At 06:41 UTC on 24 September 2026, `main` was still that merge and the live build marker was `scheduling-refill-20260924-r1`. Cache-busted downloads of both changed runtime files matched `git show 49c4fcb:<file>` byte for byte:

| File | Bytes | SHA-256 |
|---|---:|---|
| `index.html` | 30,035 | `bccf9a88b780a97f62325dc082e78033ce153a5b6442e61c05b2e0535d92473a` |
| `game-core.js` | 53,597 | `691fea9f9e2263b8d280f64f548b9074c4fe144948dbe411f31c430c5fee3cea` |

[Machine-readable verification](SCHEDULING_DEPLOYMENT.json) records the workflow steps, source commit, live hashes and verification time. This proves delivery, not physical iPad behavior.
