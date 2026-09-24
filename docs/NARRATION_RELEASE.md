# Recorded narration release — recovered corpus

This release integrates the recovered prerecorded narration package into the current BlitzWord runtime. The package contains 990 verified MP3 clips: the 165 files from the earlier release plus 825 recovered `core-male-*` files. The recovered inventory is 45,788,743 bytes and about 47.2 minutes of audio. All 990 files passed the package's complete MP3 decode check before integration. The detailed corpus and generation provenance are preserved in `NARRATION_CORPUS.json` and `NARRATION_GENERATION.json`.

## Runtime coverage

The runtime manifest maps all 990 exact text phrases to prerecorded audio. The five **gate** phrases are now approved for runtime. The standalone `gate` clip was regenerated after the user rejected the recovered pronunciation; the four longer gate-family recordings were retained because the user rated them Good. The routing logic still applies the `gait` pronunciation helper only to device-speech fallback for unmapped text containing gate; approved exact recordings always take precedence.

The recovered set contains exact recordings for all 200 current curriculum words and all 200 current teaching sentences, with duplicate teaching sentences deduplicated in the corpus. It also contains correction, practice-correction, supported-teaching, encounter and instruction recordings. Chapter-story narration and some composite shield-correction phrases still use device speech where no exact recording exists.

## Personalized dragon names

The app substitutes the child's chosen dragon name before narration lookup. A sentence displayed with a custom name therefore cannot match a prerecorded phrase that says `Pip`; personalized text stays on local device speech. Children's chosen names are not sent to a cloud speech service.

## Playback behavior

The Web Audio context unlocks from user interaction, downloads recordings on demand, decodes and caches them, and lets recorded completion control the existing timing. Missing, blocked, failed or stalled files fall back to device speech. Pause, Home, backgrounding and newer narration cancel older playback; a late download cannot resume an obsolete question.

Recorded teaching keeps the existing static target highlight. The recovered bulk recordings do not contain verified word-boundary timing, so synchronized recorded highlighting is not claimed.

## Pip evolution overlap

Four recovered Pip-evolution recordings are preserved as `assets/narration/evolution-0.mp3` through `evolution-3.mp3`, with provenance in `EVOLUTION_NARRATION.json`. They are kept for the parallel Pip-evolution workstream and are not treated as evidence that the current main UI invokes those clips.

Update, 24 September 2026: the Pip evolution release adds these four clips, including the approved slower evolution-3, to `NARRATION_CORPUS.json`, `NARRATION_GENERATION.json` and the runtime manifest (`recorded-voice-20260924-r4`): 994 clips, all mapped at runtime. The evolution screens now play them; see [evolution scenes](EVOLUTION_RELEASE.md).

## Quality and verification limits

The package's hashes and decode checks establish file integrity, not pronunciation or subjective voice consistency. The recovered set mixes standalone Tom recordings, silence-separated source batches and concatenated recordings assembled from earlier components. Representative listening QA is complete. The user reviewed 42 clips: 36 were good and six were rejected (`on`, `creature`, `i`, `it`, standalone `gate`, and evolution-3). The 12 additional earlier-Tom word samples were all good, so there is no evidence for a broad replacement of that older set. All six targeted replacement recordings were then listened to and approved. Physical iPad gameplay playback and exhaustive listening of all 990 clips remain outstanding.

No learner storage, curriculum progression, assessment scoring, XP, multiplication rules or save migration changes are introduced by this narration release.

## Integration and deployment — 24 September 2026

The recovered corpus was merged in [PR #39](https://github.com/Ikarus-eth/Blitzword_app/pull/39) as `c87372eab40e37996460722f93d96d0ef5b0f50f`. Its first Pages run stopped before deployment because three pre-recovery narration tests still encoded the old 165-clip assumptions. No Pages deployment occurred from that failed run.

The tests were updated in [PR #40](https://github.com/Ikarus-eth/Blitzword_app/pull/40), merged as `6d38f0ea9c4a015e6241347a7ec8487c1d229a94`. Pages run [35941054214](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35941054214) passed all 118 tests and reported a successful Pages deployment for that exact commit. The uploaded Pages artifact was inspected after the run: it contains build marker `narration-recovery-20260924-r1`, narration manifest `recorded-voice-20260924-r2`, 994 narration MP3s, `recoveredClipCount: 990`, `runtimeClipCount: 985`, no runtime `gate` entry, and representative `en-male-001.mp3`, `core-male-001.mp3`, `core-male-825.mp3` and `evolution-0.mp3` files.

A separate HTTP fetch from the public `github.io` origin could not be completed in this execution environment: the web tool rejected that host and the container had no DNS resolution for it. The GitHub Pages action itself reported `success` after `syncing_files` and returned the expected Pages URL. Treat this as verified GitHub Pages deployment plus deployed-artifact verification, not an independent live-origin HTTP check. Audible corpus review and physical iPad playback remain outstanding.

## Narration QA review page — 24 September 2026

A non-child-facing review page is deployed at \`/tests/narration-qa.html\`. It contains 30 representative clips: three earlier Tom words, seven recovered standalone/batched words, five teaching sentences, six concatenated phrases, all five gate-family clips, and all four Pip-evolution clips. The page plays the actual MP3 files directly, so the five gate recordings can be judged even though they remain excluded from the child-facing runtime.

Each clip can be marked Good or Bad with an optional note. Ratings use the separate local key \`blitzword_narration_qa_v1\` and do not read or modify learner progress. “Copy results” produces a compact list of bad and unrated clips for follow-up.

PR #46 merged as \`df21fbd837a6fdabd233d9b38ab5f5be67e4bb27\`. Pages run \`35945783702\` passed 127/127 Node tests, uploaded the QA page and script, and reported a successful deployment. The resulting Pages artifact was inspected and contains \`tests/narration-qa.html\`, \`tests/narration-qa.js\`, and the referenced narration files including \`core-male-825.mp3\` and \`evolution-3.mp3\`. Direct HTTP inspection of the public \`github.io\` page remains unavailable from this execution environment.

## QA replacements — 24 September 2026

The completed QA round found six clips that required replacement:

- `on`: recovered delivery was too sharp/screamy; replaced with a steadier Tom recording at 0.88×.
- `creature`: recovered clip ended on an unnatural high pitch; replaced at 0.88×.
- `i`: recovered clip was pronounced like German *i*; replaced with English “I” at 0.88×.
- `it`: recovered clip was too short; replaced at 0.82×.
- standalone `gate`: recovered pronunciation was wrong; replaced at 0.88×. The four longer gate-family recordings were retained after user approval and are now enabled.
- `Hop on my back. We can go far.`: replaced with the same Tom voice at 0.82× for a slower evolution line.

The user approved all six replacement candidates before integration. The narration manifest is now `recorded-voice-20260924-r3` with `runtimeClipCount: 990` and no fallback-only corpus entries. The QA page starts a fresh local rating set after these production-file replacements; its local state remains separate from learner progress.

## Approved replacement deployment — 24 September 2026

PR #50 merged the six user-approved replacement MP3s and full 990-clip runtime mapping as `87fd6d0689ee73c74fbb9d2207e9e7a27bb15155`. Its first Pages run (#58 / `35954994381`) stopped before deployment because one test incorrectly expected mapped `gate` to bypass the existing device-speech fallback pronunciation helper even when Web Audio was unavailable. The runtime behavior was unchanged; PR #51 corrected only that test expectation and merged as `d203ca767ed18b0011dc1023fed7eb826a3a8a1b`.

PR #52 set the release marker to `narration-approved-20260924-r1` and merged as `9b7cbbc265131fc47eba7f81c7714e3d09eaff8a`. Pages run `35955320563` passed 128/128 tests and reported a successful deployment. Its deployed artifact was inspected after the run and contains:

- build marker `narration-approved-20260924-r1` and narration cache version `narration-approved-20260924-r1`;
- narration manifest `recorded-voice-20260924-r3` with 990 runtime clips and no fallback-only entries;
- the approved replacement hashes for `on`, `creature`, `i`, `it`, standalone `gate`, and `evolution-3` exactly matching the uploaded files;
- the retained four longer gate-family recordings mapped at runtime.

The GitHub Pages action reported successful file synchronization and the expected Pages URL. A separate HTTP read of the public `github.io` origin is unavailable from this execution environment, so live-origin byte comparison remains unverified here. Physical iPad gameplay playback also remains outstanding.

## Stable remainder with ElevenLabs — 24 September 2026

After the recovered/core corpus and Pip-evolution narration were integrated, the remaining stable narration was separated from text that is still scheduled to change. The stable generation set is exactly **35 clips**:

- 34 chapter-story introductions: every implemented transition after the initial guided encounter;
- one reusable `Your shield stopped the hit.` prefix.

The child-read chapter-story sentences were deliberately excluded because approved point 6 will rewrite them before they receive final recordings. Personalized dragon-name sentences also remain device speech so arbitrary child-chosen names are never sent to a cloud speech service.

Generation used the repository secret `ELEVENLABS_API_KEY` without exposing it. Voice: **George - Warm, Captivating Storyteller**, British male, `eleven_multilingual_v2`, speed **0.90×**, stability 0.65, similarity 0.80, style 0, speaker boost enabled. The generation required 2,514 characters. The first attempt stopped after one API response because the generation runner lacked `ffprobe`; no files were committed. The runner dependency was fixed and the complete second run generated, decoded, hashed and committed all 35 files. Full receipts are in `NARRATION_REMAINDER_GENERATION.json`.

The runtime corpus is now **1,029 exact-text clips**: 994 previous core/evolution recordings plus 35 stable-remainder recordings. The manifest version is `recorded-voice-20260924-r5`. For a shielded mistake, the app now plays the reusable shield prefix and then the existing exact `The word was X.` recording; Pause/Home/newer narration still cancels the sequence through the normal narration epoch.

The new 35 George clips have MP3 decode and SHA-256 verification but have not yet received user listening QA. Physical iPad gameplay playback is also still outstanding.

## Stable remainder deployment — 24 September 2026

PR #54 merged the stable ElevenLabs remainder as `f9d9fb6d3a08e3dbb8c1ab008d3e3c2cc1c93849`. Pages run `35959070005` passed **132/132** Node tests and the UI-flow suite, including the regression that verifies the reusable shield prefix plays before the existing exact word-correction recording and that the blocked-hit animation waits for both clips.

GitHub Pages reported successful deployment. The uploaded Pages artifact was inspected after the run: build marker `narration-remainder-20260924-r1`, manifest `recorded-voice-20260924-r5`, **1,029 narration MP3s**, **34 story-intro MP3s**, and `shield-stopped.mp3` are present. The manifest reports `recordedClipCount: 1029`, `runtimeClipCount: 1029`, `recoveredClipCount: 994`, and no fallback-only entries. The shield prefix and a representative Fox Crossing story intro match their generation receipts by SHA-256.

Direct public-origin HTTP byte comparison remains unavailable in this execution environment. This is verified Pages deployment plus deployed-artifact verification, not an independent `github.io` byte comparison.

