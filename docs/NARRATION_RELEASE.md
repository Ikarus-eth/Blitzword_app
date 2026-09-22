# Recorded narration release

The fixed spoken content now uses local MP3 recordings generated with Runway's Tom preset: an adult British male voice, with steady delivery at speed 0.88. No pitch shifting was applied. The 165 deduplicated clips cover all 48 implemented/assessment/legacy words, 22 teaching sentences, supported-teaching variants, corrections, encounter introductions and reading-check instructions. This does not add the entire future Core 200 curriculum to the game.

Generation used 226 existing Runway credits. No subscription or credit purchase was made. `NARRATION_GENERATION.json` retains the original task IDs, audio durations and SHA-256 hashes. Signed download URLs and account credentials are not stored in the repository. `scripts/build-narration.cjs` validates the downloaded MP3s and builds the exact-text `narration.js` lookup without generating new recordings.

The reusable Web Audio context unlocks on a tap or key event. Playback decodes and caches clips on demand. Recorded completion controls the existing attack timing; cancellation stops playback and prevents a delayed download or old completion event from advancing a new screen. A missing, blocked or stalled clip uses the existing browser narrator, including the saved fallback voice preference. Recordings have a timeout based on their decoded duration. The existing narration/soundscape separation is retained.

The target word retains its static highlight and underline during recorded teaching sentences. These recordings do not contain verified word-boundary timestamps; no approximate timing is presented as synchronized highlighting. Browser fallback keeps its existing boundary events when available.

No learner storage, curriculum progression, assessment scoring, XP, maths rules or development gates change in this release. Existing saves and fallback voice preferences remain supported.

Verification includes all-clip file/hash coverage, correct completion timing, download failure, late-response isolation, pause/Home cancellation and browser fallback, plus the existing application regression suite. MP3 format and duration are checked during packaging. An audible listening review could not be performed in this environment. Physical iPad playback, pronunciation and subjective voice suitability remain to be checked by the user.
