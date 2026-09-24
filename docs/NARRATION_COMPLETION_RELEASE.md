# Narration completion — in progress, 24 September 2026

## Scope and source

User-authorized priority 3: current approved chapter sentences, all new enemy intros, comparison corrections and synchronized teaching-word highlighting. The existing 1,029 approved MP3s are preserved byte for byte. New audio uses George, `JBFqnCBsd6RMkjVDRZzb`, `eleven_multilingual_v2`, stability 0.65, similarity 0.8, style 0, speaker boost enabled, speed 0.9.

The reviewed request contains 1,403 text segments in 176 batches (25,911 characters), plus forced alignment of 366 existing teaching recordings. Full correction clauses share timestamped segments of batch MP3s; each starts and stops inside its own bounds. Batching preserves complete spoken clauses while avoiding thousands of network requests. Current practice pools, fixed check choices and legacy lists are covered; unknown old choices and personalized names keep local speech.

## Current blocker and saved output

[Generation run 36008375224](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36008375224) stopped on `ElevenLabs HTTP 401`, code `quota_exceeded`: “This request exceeds your quota of 10000. You have 26 credits remaining, while 117 credits are required for this request.” No automatic retry was made. The user was asked to increase available allowance by about 20,000 credits plus alignment allowance.

40 completed MP3 batches contain 320 segments: all 31 missing story sentences, all 30 new enemy introduction variants, and part of the correction library. One teaching recording is aligned. Remaining: 136 text batches (18,534 characters) and 365 alignments. Assets and receipts are committed here; `docs/NARRATION_COMPLETION_GENERATION.json` explicitly says incomplete. `narration.js` remains the production manifest until all requests are complete.

Automatic approval review initially treated teaching recordings as private. An unauthenticated audit confirmed the repository is public and all 366 MP3s are publicly accessible on Pages and hash-identical to the approved files; subsequent approval succeeded. The temporary repository token cannot create workflows (`without workflow scope`); the connected GitHub account successfully created the generation workflow. The API secret was never extracted, printed or committed.

## Implemented and tested locally

The narrator resolves exact recordings first, otherwise assembles complete correction clauses only if all parts exist. All downloads complete before playback; any missing part falls back to the whole local phrase. Playback honors MP3 segment bounds. Word events follow `AudioContext.currentTime`, clear in silence, and stop on cancellation. Pause/backgrounding clears the visible highlight; old callbacks cannot restore it or advance the lesson. Muting, replay, personalized text and stalled downloads retain their safe completion behavior.

New audio tests cover real clock suspension, segment ordering, shared downloads, cancellation, replay, mute, stalled/late responses and failed segments. UI regression covers target highlighting and stale callbacks after backgrounding. Request/asset checks cover all current/legacy choices, exact transcripts, hashes, ordered segments and word bounds. Existing behavior assertions were not relaxed. A clean Node 22 install and full test run pass: 242 core tests and 84 UI-flow groups. Decoded audio uses a 16-file recent cache to bound memory during long sessions.

Two isolated Chromium scenarios use the staged manifest on tablet and phone to verify actual MP3 playback and the first aligned sentence. This is partial integration validation only. Full corpus checks, all remaining timing data, the final manifest, broader browser flows and deployment remain outstanding. Physical iPad/Safari and user listening review remain untested.

## Resume after quota is increased

1. Confirm new allowance. Change the request JSON's `resume` field to trigger the branch-only generation workflow. Its script restores committed receipts and audio before sending any new request. Do not rerun the original failed commit: it predates saved-output recovery.
2. Download the new run's artifact, verify its digest, and run `python3 scripts/package-narration-completion.py <artifact-directory> --apply`. It refuses to apply an incomplete batch; old MP3 hashes are checked before alignment metadata is attached.
3. Update the old asset tests intentionally: enemy intros and approved story sentences should now be recorded; counts must include the new corpus while keeping the original 1,029 hashes fixed. Add full runtime coverage assertions and new-clip listening review support. Update build/cache markers and this record with final validation.
4. Run the clean install/test suite and browser audio/correction/story/teaching flows. Preserve current main, merge the completed PR, wait for its Pages run, check the build and compare every changed published file byte for byte. Record verification in a docs-only follow-up.
