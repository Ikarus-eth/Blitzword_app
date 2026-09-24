# Parent learning view — point 8

Build: `parent-learning-20260924-r1`. Implemented and locally tested; merge and Pages verification pending.

## What changed

Parents now opens with learning rather than sound settings. All 200 playable curriculum words appear in seven campaign groups, coloured and labelled New / Learning / Secured / Kept after 7 days / Kept after 30 days. The point 7 quick marker stays separate. Search and state/quick filters narrow the map; tapping a word opens its saved history and returns focus to that word on close.

History combines retained raw records with archived totals for practice, unaided correct/helped answers, teaching, help, timings, quick answers and mix-ups. It lists retained practice, reading-check, demo, teaching and help events, while clearly distinguishing older totals whose individual events are no longer stored. Unknown introduction dates are not inferred from the first retained answer. Word-level mix-ups and letter differences are also shown.

The tricky list shows the ten most frequent target → chosen pairs, differing letter positions and the ten slowest mean independent response times with sample counts. The existing positional archive meaning is retained: a single wrong choice can contribute multiple differences, and these counts are descriptive rather than diagnostic.

Weekly retention shows twelve local Monday–Sunday weeks. Each word's first check after at least 24 hours unseen/unhelped counts once per week. Correct and unaided succeeds; wrong or helped does not. Interrupted displays are excluded. Retrying cannot turn an earlier first-check miss into a success. No checks and unavailable history are distinct from a measured 0%.

## Evidence, migration and limits

Kept states are historical evidence of independent correct checks after actual 7/30-day gaps, not elapsed time since introduction, a due date, a scheduler stage or a claim of mastery. Secured uses the existing saved word milestone; grandfathered milestones remain. Later errors remain in history and review without erasing historical achievements.

New questions snapshot time since the most recent known answer/help/assessment exposure when prepared. A saved question cannot earn a larger retention gap merely by being left open for days. Answers save that gap and the device-local week. The new reporting archive stores at most one outcome for each word/week and first qualifying 7/30-day dates, keeping reports stable when older raw answers are compacted. Reporting projects a copy of the archive and never edits learner state.

Old raw/archived data remains intact. Older gap buckets and answer timestamps do not reliably reveal intervening exposures, already-shown pending questions or distinct first checks in a week. Missing facts are not reconstructed: older weeks that cannot support the calculation are unavailable, and old buckets alone do not create 7/30-day colours. Existing quick totals and secured milestones remain usable. New observations supply the additional evidence from this release onward.

There is no new telemetry, storage-key change, data reset, curriculum edit, scheduler change, XP change or chapter-rule change. Existing backup/restore and conflict protections stay in place. Physical iPad/Safari behavior and real learning outcomes are not established by automated checks.

## Validation

- Clean install and full Node 22.23.3 suite: **222 core tests and 76 UI-flow groups passed**.
- Tests cover all 200 words, evidence states, quick markers, thresholds, weekly first outcomes, retries, helped/interrupted answers, local week/DST boundaries, archived totals, invalid timings, old-save limits, exact pending-question gaps and read-only reporting.
- The existing 90-day model at 45 min/day still passes the one-million-character save limit. Raw history limits remain unchanged.
- Chromium: 16 isolated scenarios cover empty, mixed, legacy-compacted and 3,000-answer saves at 1180×820, 820×1180, 390×844 and 844×390. Four focused follow-ups check final history wording, date labels and the quick summary; two more check selected-word mix-ups and focus return (22 scenarios total). No page errors. Saves are seeded before load; reopening leaves the page first.
- Screenshots of the map, selected-word history, weekly retention and tricky list were reviewed at tablet and phone sizes. Touch targets are at least 44 px. History tables can scroll; the history region is keyboard-focusable. Search/filter, parent gate, sound settings and reopening were exercised.
- Existing test change: the point 7 quick-table expectation now checks the same marker/count in the word map and selected history because point 8 replaces that table. The linkedom select-value mock was corrected after a minimal reproduction showed that selecting a middle option incorrectly cleared all selection; Chromium confirms the actual filters work. No existing gameplay expectation is relaxed.
- Physical iPad and Safari/WebKit remain untested.

Machine-readable browser/check results: [PARENT_LEARNING_CHECKS.json](PARENT_LEARNING_CHECKS.json).

## iPad check

Open Parents through the gate. Check map colours/labels, search a word, use a status or Quick filter, tap a word and close its history. Review mix-ups, response-time sample counts and weekly denominators. Older history may correctly be unavailable. Scroll to Sound, change a setting, then leave and reopen to confirm it is retained. Keep the existing learner save and backup.

## Stop

This completes the approved sequence through point 8 after deployment verification. Collect iPad feedback and the remaining reading-check/content decisions. Point 9 requires discussion and a separate decision; point 10 remains parked.
