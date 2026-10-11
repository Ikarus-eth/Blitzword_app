# Teaching moments 200–400 — 11 October 2026

## Scope and implementation

The user authorized missing visuals with ChatGPT and audio with fal.ai, with compute sensitivity. The one-based inclusive range is `thin` (200) through `eighty` (400). Existing `thin` art and every word pronunciation are reused. All sentences, spelling tips, word order, practice rules and learner-save formats remain unchanged.

The 200 expansion targets now have meaningful illustrated teaching support. Twelve built-in ChatGPT ImageGen calls produced ten scene atlases (120 shared scene concepts), one counting-token atlas and one nine-cell clarification atlas. The clarification pass resolves pen/pencil ambiguity, lonely before/after, maybe after lunch, separate key/hat/bag searches, hunger, water levels and a friend calling. Fruit cards use individual crops. Function-word and relationship cards include brief written meaning cues; these supplementary captions are not narrated. The approved example sentence and existing teaching tip each retain their own listening control.

Twenty-five number words use generated painted tokens with exact software-laid-out quantities, grouped in tens. Five fingers and eight legs have a matching hand/spider plus exact counters; sixty seconds has a clock plus sixty counters; zero shows an empty plate. Quantity labels are rendered text, not generated spelling. Actual native atlas boundaries are measured and recorded; art is never upscaled. Twelve WebPs total 6,621,732 bytes. Source PNGs remain in the local workspace and Codex generated-images folder; deployment uses the smaller WebPs.

The app now displays expansion illustrations beside readable lesson text on landscape tablets, with a stacked, scrollable phone layout. The image load/error path preserves listening and Continue. Unillustrated later words keep their existing text/counter teaching. A separate `assets/teaching-review/` viewer covers all 201 words and plays word/sentence/tip recordings without loading or changing learner saves.

## Audio and compute

397 unique missing segments: 199 sentences and 198 tips, exactly 19,201 input characters. Model `fal-ai/elevenlabs/tts/multilingual-v2`, approved voice `onwK4e9ZLuTAKqWW03F9`, speed 0.88 and the prior approved settings. Estimated provider cost $1.9201 at the previously documented $0.10/1,000-character rate; this is not an invoice. No word recordings regenerated, and no blind paid retries. Four concurrent provider requests; durable request IDs permit recovery.

All 397 MP3s decode, have plausible durations, and match saved SHA-256 receipts. Returned timestamp text matches submitted text after only the 108 documented curly-quote/arrow punctuation normalizations. All 3,092 existing manifest entries are verified unchanged; total 3,489. Device speech remains the fallback. Provider alignment text and decoding checks do not constitute human pronunciation approval. Physical iPad listening remains unverified.

## Evidence and reproducibility

- `STORYBOARD.json`: whole-batch scene planning, original scope and sentence/tip reference.
- `prompt-*.txt`: exact built-in image prompts; `ART_GENERATION.json`: final asset hashes.
- `ATLAS_BOUNDS.json` and `VISUAL_MAPPING.json`: reviewed native crop and semantic mapping.
- `../TEACHING_200_400_AUDIO_REQUEST.json`: exact bounded audio request.
- `../TEACHING_200_400_AUDIO_GENERATION.json`: paid request IDs, file hashes, durations and retained-manifest digest.
- `AUDIO_TEXT_NORMALIZATIONS.json`: provider punctuation changes.
- `BROWSER_CHECKS.json`: 253 checks including all 201 visuals, 1024×768 / 1194×834 / 1366×1024 landscape, 390×844 portrait and 844×390, saved teaching/reload/return and twelve completed audio plays. No page errors or horizontal overflow.

After preserving concurrent main through `73ff012`: all 397 unit/backend tests and 122 UI groups pass. The combined main-game/browser run repeats all 253 checks. `RECORDED_PLAYBACK_CHECKS.json` separately verifies twelve actual recorded plays with zero device-speech fallback calls. All twelve sheets and representative main-game/review screenshots were visually inspected. Final merged-source checks and deployment are recorded below when verified.

**Deployed and verified.** [PR #176](https://github.com/Ikarus-eth/Blitzword_app/pull/176) merged as `172b9397e71a13db0d410e186489805b2717b821`; [Pages run 38112130172](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38112130172) succeeded. All 418 checked live files match the release byte for byte, including all 397 new MP3s, all twelve image sheets, the visual mapping, review page, main runtime and preserved progress-sync client. See `DEPLOYMENT.json`. All 253 browser checks also passed against the public site, with twelve actual recorded plays and no device fallback or page errors; see `LIVE_BROWSER_CHECKS.json`. No physical iPad test or independent human pronunciation review is claimed.

The existing Pages workflow is unchanged. Visual metadata lives under `assets/teaching/200-400/visuals.js`, covered by its existing recursive asset packaging. The provided token lacks workflow scope, so no workflow permission change is needed.
