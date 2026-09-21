# Forest and first-battle repair — 21 September 2026

The opening form now places Pip in an illustrated forest. Name entry disables browser autocorrection and spellcheck, preserves accented names, and retains the native keyboard. The selected six hero identities are rendered as full-length characters in selection and battle. A visible Thornling replaces the emoji enemy.

The battle reserves separate regions for health, pause, word presentation, characters and answers. There are four equal answer tiles and a separate question-mark help control. The word, fixed-size mask and choices retain their sequence. Characters stay still until an answer is committed. Help records supported practice and does not remove health or produce independent credit.

A wrong choice opens the existing reviewed illustration and highlighted sentence directly. It no longer shows a separate correction overlay. Replaying or continuing teaching remains free. The first independent demonstration mistake is narrated as a free practice turn.

The demonstration ends after victory, defeat, or at most seven total attempts (one guided example plus up to six practice attempts). Its saved handoff leads into the existing assessment. Assessment pools, adaptation thresholds and stopping rules are unchanged. The reading-check label distinguishes it from combat. Existing names, learning records and campaign saves are preserved.

Speech uses its natural pitch, a moderate rate, preference for installed enhanced English voices, and a saved narrator choice in Pause. A separate speech watchdog cannot clear the gameplay timer. Device speech remains a provisional narrator: no consistent prerecorded voice is bundled, and actual iPad voice quality remains unverified.

## Artwork

Generated with the built-in image tool. `assets/forest-clearing.webp` is a full-bleed forest and ruined-lantern-gate background with a clear foreground, no characters and no text. `assets/forest-characters.webp` is a transparent sprite atlas derived from the approved September 21 male trio, the three original approved female heroes, Ember Guardian Pip, and Thornling from the enemy concept sheet. The older male character designs were excluded.

Briefs: landscape storybook watercolor and pencil, emerald woodland and warm amber light; preserve exact character faces, hair, costume, equipment and proportions; full figures with no baked-in text or UI. The generated atlas was visually reviewed for all six hero identities, Pip's wing and horn details, and the leafy Thornling. Runtime SVG viewports crop the atlas without recoloring it. Both assets were converted to WebP for delivery, preserving transparency.

## Verification

- `node --check app.js`, `node --check audio.js`, `node --check game-core.js`.
- `node --test tests/*.test.js`: 27 tests, including legacy save recovery, checkpoints, independent/helped evidence, delayed review, three demo exits, handoff reload, and missing/cancelled speech completion.
- `tests/ui-flow.cjs`: actual HTML and application controller run in LinkeDOM with isolated in-memory storage and a virtual clock. Win, loss and repeated-help routes each traverse setup, hero selection, teaching, battle, saved handoff, assessment, campaign, and pause/resume. Image readiness and native select setters are simulated; this is not a browser layout or iPad audio test. Run with LinkeDOM 0.18.12 available on NODE_PATH.
- Browser visual review and live deployment verification are recorded after publishing.

Limitations: a six-word practice slice remains; the full planned chapter and enemy variety are separate work. Sprite movements are simple post-answer reactions, not multi-frame character animation. No professional narration clips were supplied. Native Safari keyboard and voice behavior need a physical iPad check.
