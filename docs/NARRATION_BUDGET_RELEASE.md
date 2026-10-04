# Focused narration — 4 October 2026

Build: `budget-narration-20261004-r1`. Implemented and tested; deployment pending.

The user requested a smaller budget and authorized generation and deployment of four categories: wrong-answer feedback, Word-trail battle introductions, creature-mission encounters and the reusable practice-turn prefix.

## Result and cost

- Keep all 1,029 existing approved exact-text recordings and their file hashes.
- Reuse 289 already-paid George segments from draft #80 at `12b9e3054c2ecf6ad81c0282825517ddfd270aa9`: 227 chosen-word clauses, 32 target clauses and 30 family introductions.
- Generate 855 new segments: 816 missing choice words, four shared prefixes, 15 group introductions and 20 mission introductions. First group encounters share the assessment-complete prefix.
- Use the existing George voice, `eleven_multilingual_v2`, stability 0.65, similarity 0.8, style 0, speaker boost enabled and speed 0.90.
- Submit 7,333 characters, including punctuation and batch separators. The observed account counter increased by 2,159 across the runs; this is an account observation, not an invoice or a promised rate. [Usage evidence](NARRATION_BUDGET_USAGE.json).

The first batch was preserved when validation stopped because the runner did not contain ffprobe. Installing FFmpeg fixed that runner dependency; the next run recovered the batch without another generation request. [Completed generation run](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/37166276273). There are no automatic paid retries and no subscription/allowance changes.

## Playback

Exact recordings take priority. A comparison uses full recorded clauses where available, otherwise a recorded label followed by a whole recorded word. No letters or phonemes are spliced. All required parts download and validate before speech starts; failed or unavailable parts use one complete device-speech fallback. The shared batch MP3s play only their bounded segments. Cancellation, pause, mute, newer speech and backgrounding cannot launch a later part or finish an old turn. The decoded-audio cache is bounded to sixteen recent files.

Both ordinary and free-practice comparisons are covered, including contractions and legacy distractors with misplaced apostrophes. Shield corrections retain their recorded prefix. All twenty enemy families, current grouped variants and assessment-to-first-battle prefixes are covered. New creature missions retain their exact “is ready for your challenge” wording.

Learner saves, wording, assessment, question pools, XP, health, artwork and mission rules are unchanged. Unknown historical choices remain local fallback.

## Verification

Clean dependency install; 301 unit tests and 103 UI flow groups passed. The old test expecting new enemy intros to fall back was intentionally replaced by recorded-coverage assertions. Original corpus hashes are still checked individually; additive counts are checked against the new receipts. Coverage enumerates current and legacy choice pools and every encounter variant, with explicit contraction, cancellation, missing-file and invalid-segment tests.

Every newly generated MP3 passed FFmpeg decoding and ordered timestamp validation in Actions. Packaging verifies receipts, hashes, segment bounds and adjacency. [Browser playback evidence](NARRATION_BUDGET_BROWSER.json) records actual Chrome MP3 decoding and playback separately. Human pronunciation review and physical iPad/Safari playback are not claimed.

## Outside this release

The 31 missing chapter reading sentences, 48 creature-riddle Listen passages and teaching alignment work were not selected for this release. Custom dragon names remain on local device speech. Draft #80 remains available for its other paid outputs and must be reconciled with current main before further use.

## Deployment

Pending pull request, main re-check and the existing GitHub Pages deployment route. Verify the live build marker plus changed runtime/audio hashes before marking this release live.
