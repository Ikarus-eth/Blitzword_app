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
