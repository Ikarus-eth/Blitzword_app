# Speed guidance and quick words — point 7

Build: `speed-guidance-20260924-r1`. Implemented and locally tested; merge and Pages verification pending.

## Change

The reading-check default could be 1500 ms while the Speed panel highlighted Walk (1800 ms). There were no battle-boundary speed suggestions or parent-facing quick markers. This release adds Stride (1500 ms) and Jog (1200 ms), selects the effective pace and offers optional one-step changes after 20 eligible answers. The 2200 ms reading-check pace is explicitly displayed without changing it. Ride and Fly retain their existing locks. The map label also follows calibration and accepted suggestions.

The proposed names/icons used for review are **Stride**, a long walking stride, and **Jog**, a bent-arm jog. The panel uses seven distinct code-native line drawings, consistent with the existing controls. No artwork or narration recordings are replaced.

## Evidence and saves

The last 20 independent, uninterrupted answers at the selected/calibrated pace form the sample. Familiar means assessment-familiar or two independent successes before this answer. Slower is strictly below 80%; faster is strictly above 90%. Two words accounting for at least 60% of misses suppress a slower suggestion, leaving existing correction and teaching first. Twenty new eligible answers are required after every offer, including an ignored offer. These are provisional calibration thresholds, not measured learning outcomes.

An offer is saved with a battle result and can be accepted, declined, or bypassed by starting the next battle. It appears after any intervening number duel/evolution flow. A pace change affects new questions only and starts fresh nudge evidence. The older self-paced checkbox used to overwrite a pending ready question; it now uses the shared choice function and preserves that question. Old saves start fresh nudge evidence because their records cannot establish whether a word was familiar before each answer. Their learner data is retained.

Parents derives quick markers/counts from retained raw campaign answers plus existing per-word archive totals. Quick requires an unaided correct answer in under 1500 ms at 950 ms or faster, with positive finite timings and no interruption. New archive entries use the same predicate. Existing archived counts remain as recorded; unavailable old detail is not reconstructed. Slow words stay in scheduled review, and a quick marker does not remove a word from review or claim long-term retention. No reward or chapter-rule change is introduced.

## Validation

- Clean dependency install and full Node 22.23.3 suite: **205 core tests, 71 UI-flow groups passed**.
- New tests cover thresholds, word concentration, eligible samples, voluntary changes, refusal/reopen, paid locks, old saves, bounded evidence, pending questions, save failure, timing validity and raw-to-archive quick status.
- Two existing expectations change intentionally: the choice/icon count becomes seven, and the lock array gains two unlocked entries. No earlier behavioral assertion is relaxed.
- Browser checks: 30 isolated Chromium scenarios at 1180×820, 820×1180, 390×844 and 844×390, plus 3 focused follow-ups for the updated map label and parent table. No page errors. Saves are seeded before load, and reopening leaves the page first. Speech completion is stubbed for flow checks; these are not listening tests.
- Tablet/phone speed-panel, result-offer and parent screenshots were visually inspected. The quick table wraps on narrow screens.
- Physical iPad and Safari/WebKit remain untested. Real child response to the provisional thresholds and proposed names/icons is not yet measured.

Machine-readable results: [SPEED_GUIDANCE_CHECKS.json](SPEED_GUIDANCE_CHECKS.json).

## iPad review

Open Speed after a reading check; the actual pace should be highlighted. Try Stride and Jog, leave/reopen, and check the choice persists. After sufficient unaided familiar-word practice, accept or decline a between-battle offer and continue. In Parents, check Quick words after a fast Run answer. Confirm a slow accurate word still returns for scheduled review and Ride/Fly remain locked without the existing gates.

## Next stop

Point 8: a 200-word parent map with word histories, common mix-ups/slow words and weekly retention. Learning moves above sound settings. Do not start until the next user go.
