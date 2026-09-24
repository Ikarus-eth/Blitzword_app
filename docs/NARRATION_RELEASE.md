# Recorded narration release — recovered corpus

This release integrates the recovered prerecorded narration package into the current BlitzWord runtime. The package contains 990 verified MP3 clips: the 165 files from the earlier release plus 825 recovered `core-male-*` files. The recovered inventory is 45,788,743 bytes and about 47.2 minutes of audio. All 990 files passed the package's complete MP3 decode check before integration. The detailed corpus and generation provenance are preserved in `NARRATION_CORPUS.json` and `NARRATION_GENERATION.json`.

## Runtime coverage

The runtime manifest maps 985 exact text phrases to prerecorded audio. Five recovered phrases containing **gate** are deliberately retained in the repository for provenance but excluded from the runtime lookup pending pronunciation approval:

- `gate`
- `The gate is by the castle.`
- `Practice turn. You keep your heart. The gate is by the castle.`
- `The word was gate.`
- `Practice turn. You keep your heart. The word was gate.`

For those five phrases, device speech uses the existing `gait` pronunciation helper while the displayed text remains `gate`. The routing logic now checks for an approved exact-text recording first and applies pronunciation helpers only if playback falls back to speech synthesis. Adding an approved exact gate recording later therefore requires only adding it to the manifest; the audio engine will prefer it automatically.

The recovered set contains exact recordings for all 200 current curriculum words and all 200 current teaching sentences, with duplicate teaching sentences deduplicated in the corpus. It also contains correction, practice-correction, supported-teaching, encounter and instruction recordings. Chapter-story narration and some composite shield-correction phrases still use device speech where no exact recording exists.

## Personalized dragon names

The app substitutes the child's chosen dragon name before narration lookup. A sentence displayed with a custom name therefore cannot match a prerecorded phrase that says `Pip`; personalized text stays on local device speech. Children's chosen names are not sent to a cloud speech service.

## Playback behavior

The Web Audio context unlocks from user interaction, downloads recordings on demand, decodes and caches them, and lets recorded completion control the existing timing. Missing, blocked, failed or stalled files fall back to device speech. Pause, Home, backgrounding and newer narration cancel older playback; a late download cannot resume an obsolete question.

Recorded teaching keeps the existing static target highlight. The recovered bulk recordings do not contain verified word-boundary timing, so synchronized recorded highlighting is not claimed.

## Pip evolution overlap

Four recovered Pip-evolution recordings are preserved as `assets/narration/evolution-0.mp3` through `evolution-3.mp3`, with provenance in `EVOLUTION_NARRATION.json`. They are kept for the parallel Pip-evolution workstream and are not treated as evidence that the current main UI invokes those clips.

## Quality and verification limits

The package's hashes and decode checks establish file integrity, not pronunciation or subjective voice consistency. The recovered set mixes standalone Tom recordings, silence-separated source batches and concatenated recordings assembled from earlier components. Audible listening review and physical iPad playback remain outstanding. The five gate-family clips are explicitly excluded from runtime until their pronunciation is reviewed.

No learner storage, curriculum progression, assessment scoring, XP, multiplication rules or save migration changes are introduced by this narration release.

## Integration and deployment — 24 September 2026

The recovered corpus was merged in [PR #39](https://github.com/Ikarus-eth/Blitzword_app/pull/39) as `c87372eab40e37996460722f93d96d0ef5b0f50f`. Its first Pages run stopped before deployment because three pre-recovery narration tests still encoded the old 165-clip assumptions. No Pages deployment occurred from that failed run.

The tests were updated in [PR #40](https://github.com/Ikarus-eth/Blitzword_app/pull/40), merged as `6d38f0ea9c4a015e6241347a7ec8487c1d229a94`. Pages run [35941054214](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35941054214) passed all 118 tests and reported a successful Pages deployment for that exact commit. The uploaded Pages artifact was inspected after the run: it contains build marker `narration-recovery-20260924-r1`, narration manifest `recorded-voice-20260924-r2`, 994 narration MP3s, `recoveredClipCount: 990`, `runtimeClipCount: 985`, no runtime `gate` entry, and representative `en-male-001.mp3`, `core-male-001.mp3`, `core-male-825.mp3` and `evolution-0.mp3` files.

A separate HTTP fetch from the public `github.io` origin could not be completed in this execution environment: the web tool rejected that host and the container had no DNS resolution for it. The GitHub Pages action itself reported `success` after `syncing_files` and returned the expected Pages URL. Treat this as verified GitHub Pages deployment plus deployed-artifact verification, not an independent live-origin HTTP check. Audible corpus review and physical iPad playback remain outstanding.
