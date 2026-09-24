# Layered enemies and impact timing — 24 September 2026

The selected 20-enemy lineup is preserved in `assets/enemies/selected-lineup.png`.
Selections: 01–05 A; 06–08 C; 09 B; 10–11 C; 12–13 A; 14–20 C.

## Artwork and animation

Twenty transparent RGBA atlases are in `assets/enemies/layered/`, one per family.
Each atlas contains sixteen regions: painted body parts, neutral/hit/celebration
expressions (light states for the Lantern Wisp), and optional accessories/effects.
There are 320 regions, not 320 independent full-character animation frames.
The exact built-in image-generation prompts are preserved in
`generation-prompts.json`; no paid external generation service is required.

`enemy-art-data.js` records verified source dimensions and alpha crop bounds.
`enemy-art.js` composes those image regions with nested SVG joints. `enemy-art.css`
animates the joints only after an answer is locked and its narration has finished.
Neutral, attack, hit, defeated and celebration presentations use the same artwork.
No idle movement is introduced during fixation, exposure, masking or choices.
Reduced motion retains assembled anatomy and static feedback.

All twenty families are now eligible under the existing strength-tier selection
rules. Existing family IDs and tier IDs remain compatible. The original five
artwork sources remain as fallbacks. No reading, scoring, damage, XP, checkpoints,
dragon progression or saved learner data are migrated by this release.
The original five named encounter recordings remain covered by the audio gate.
The fifteen new names use the existing device-speech fallback, with thirty new
introduction cases verified to make no request for a missing recording. They
remain part of the outstanding narration work; this release creates no audio.

The earlier suggested creature-specific HP ranges and shared-health groups are
still proposals. This release does not assign those ranges or introduce group
combat. The isolated animation studio can show three or five copies to inspect
group composition; this is an art preview, not a change to encounter rules.
The twenty atlases describe the selected base forms. Separate baby/young/adult
anatomy and distinctive mature accessories still need art direction if adopted.

Open `tests/enemy-review.html` for all twenty assembled characters, individual
inspection, attack/hit/defeat/celebration controls, held poses and group previews.
It never reads or writes learner saves. Atlas links expose the unmodified source
images for future asset work. `scripts/inspect-enemy-atlases.py` re-reads alpha
metadata without editing the PNGs. `scripts/render-enemy-gallery.cjs` builds an
offline static QA sheet using the same production renderer.

## Health presentation

Damage, shield consumption and the learning observation are committed and saved
immediately when the answer is accepted. A temporary UI snapshot holds the previous
hearts, enemy bar/count and shield badge during narration and attack wind-up.
At 55% of the 1,200 ms reaction (660 ms), the display reveals the saved health.
The impact timer is independent of question-advance timers. It checks the current
question and cancellation token before updating anything.

Pause, Home, backgrounding, teaching, replay and other interrupted work cancel
pending animation and settle the display to committed health. Reload starts from
the saved result, never from an unsaved damage event. Supported practice and the
free first practice mistake do not receive damaging reactions. Shielded mistakes
retain the shield badge until the block. Reduced motion reveals health when the
feedback starts without waiting for a travelling animation.

## Verification

All 146 Node tests and 52 UI-flow groups pass after integrating current main
(`e9d64e2`), including rotating choices and the two-part recorded shield correction.
Coverage verifies existing learning flows, all twenty articulated renderers,
source PNG dimensions/alpha format, tier compatibility, narration and wind-up
timing, health and shield impact, free/supported answers, cancellation, reload
and reduced-motion timing.

An isolated headless Chromium review checked all twenty loaded atlases and the
neutral, attack, hit, defeat and celebration states at 1180×820 and 390×844.
Five-creature previews, reduced motion and actual battle layouts also passed,
with no page errors or horizontal page overflow. Captured neutral and impact
poses were visually inspected. Storm Griffin's viewBox was widened to keep its
spread wings inside the display footprint. Physical iPad/Safari rendering,
sustained frame-rate and child-play evidence remain unverified.

The repository commit, deployment result and live verification are reported with
the release. A local passing test is not a deployment claim.
