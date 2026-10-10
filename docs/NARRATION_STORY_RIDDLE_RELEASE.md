# Story and riddle narration completion — 4 October 2026

Build: `story-riddle-narration-20261004-r1`. Implemented, tested, deployed and verified.

The user authorized finishing the remaining 31 chapter reading sentences and 48 creature-riddle Listen passages within the estimated 6,000-credit generation budget, followed by deployment.

## Audio and budget

All 31 chapter sentences reuse previously paid George recordings from draft #80 at `12b9e3054c2ecf6ad81c0282825517ddfd270aa9`. Their 627 characters are not generated again. The exact texts, segment offsets and original audio hashes are preserved in [the reuse manifest](NARRATION_STORY_RIDDLE_REUSE.json).

The 48 riddle passages use 49 new segments: 37 complete passages, eleven ordering passages, and one shared “Tap the actions in the right order.” instruction. The request totals **5,348 text characters**, including batch separators, below the 6,000-character cap. George, Multilingual v2, 0.90 speed and the existing settings are unchanged. At the conservative one-credit-per-character estimate, reserve **5,348 credits** before any provider discount. This is a generation budget, not a confirmed invoice; account counters can update asynchronously.

The bounded workflow uses only the repository's ElevenLabs secret in Actions. It has no automatic paid retries, checks audio tooling before generation, validates MP3 decoding and timestamp ranges, and preserves completed outputs if a request fails. [Generation run](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/37171855532).

## Behavior

All 34 approved chapter reading sentences now have recorded coverage (three already had recordings), as do all 48 riddle Listen passages. The narration manifest contains 2,275 exact-text segments. Eleven ordering passages compose a recorded passage with the shared instruction; both parts download and validate before playback. Existing cancellation, replay, mute, pause and full-text fallback behavior applies.

The earlier 2,195 entries and every existing audio file remain intact. No reading, riddle, quest, teammate, curriculum, XP, artwork, wording or learner-save rules change.

Personalized dragon-name text remains local device speech. Missing/failed downloads and unknown older saved choices still use device speech as a fallback. Synchronized highlighting for the original teaching recordings is separate work; this release does not generate new alignments or claim physical iPad/human pronunciation approval.

## Verification and deployment

Clean dependency installation and all **311 unit tests and 104 UI flow groups pass**. Coverage checks resolve every approved chapter sentence and all 48 riddle Listen passages. All 2,195 earlier manifest entries are preserved exactly; existing audio files are unchanged.

An isolated Chrome session decoded all **11 referenced MP3s**, checked all **80 added/reused segments** against decoded duration and non-silence, and played a reused story, a full riddle, an ordering riddle with its shared prompt, and the final generated passage. No device-speech fallback or page errors occurred. Cancelling an ordering passage stopped the remaining instruction and completion callback. [Browser evidence](NARRATION_STORY_RIDDLE_BROWSER.json). Unit tests also verify complete-text fallback when the shared instruction cannot download and local speech for custom dragon names.

[PR #127](https://github.com/Ikarus-eth/Blitzword_app/pull/127) merged as `e69dbf561f1e4f86c37294d73d6299fa93f11c5a`. [Pages run 37172174610](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/37172174610) passed its regression checks, upload and deployment. All **21 checked live files** match the tested source byte for byte: all eleven added/reused audio files and ten runtime files, including the build marker, narration manifest and playback code. [Live hashes](NARRATION_STORY_RIDDLE_DEPLOYMENT.json).

Technical tests do not substitute for human listening or physical iPad/Safari testing.
