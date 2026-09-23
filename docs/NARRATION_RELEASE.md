# Recorded narration release

This note records the original 165-clip release. Its generation history describes that release's smaller curriculum, not full current coverage. All 200 curriculum targets are now playable; expanded prerecorded coverage remains outstanding. Unrecorded words, teaching sentences, chapter stories and personalized text use the immediate browser-speech fallback. See [current status](CURRENT_STATUS.md) and [Core 200](CORE200_RELEASE.md).

The preserved MP3s were generated with Runway's Tom preset: an adult British male voice, with steady delivery at speed 0.88. No pitch shifting was applied. The 165 deduplicated clips include curriculum/assessment/legacy words, teaching and supported-teaching variants, corrections, encounter introductions and reading-check instructions. Text containing the reported mispronounced “gate” bypasses its recording and speaks the homophone “gait” through the existing fallback; displayed text stays unchanged.

Generation used 226 existing Runway credits. No subscription or credit purchase was made. `NARRATION_GENERATION.json` retains the original task IDs, audio durations and SHA-256 hashes. Signed download URLs and account credentials are not stored in the repository. `scripts/build-narration.cjs` validates the downloaded MP3s and builds the exact-text `narration.js` lookup without generating new recordings.

The reusable Web Audio context unlocks on a tap or key event. Playback decodes and caches clips on demand. Recorded completion controls the existing attack timing; cancellation stops playback and prevents a delayed download or old completion event from advancing a new screen. A missing, blocked or stalled clip uses the existing browser narrator, including the saved fallback voice preference. Recordings have a timeout based on their decoded duration. The existing narration/soundscape separation is retained.

The target word retains its static highlight and underline during recorded teaching sentences. These recordings do not contain verified word-boundary timestamps; no approximate timing is presented as synchronized highlighting. Browser fallback keeps its existing boundary events when available.

No learner storage, curriculum progression, assessment scoring, XP, maths rules or development gates change in this release. Existing saves and fallback voice preferences remain supported.

Verification includes all-clip file/hash coverage, correct completion timing, download failure, late-response isolation, pause/Home cancellation and browser fallback, plus the existing application regression suite. MP3 format and duration are checked during packaging. An audible listening review could not be performed in this environment. Physical iPad playback, pronunciation and subjective voice suitability remain to be checked by the user.
