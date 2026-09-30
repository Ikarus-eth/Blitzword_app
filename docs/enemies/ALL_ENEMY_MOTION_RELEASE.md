# All enemy motion and male-mage release

Build `enemy-motion-20260930-r1`. **Deployed.** [PR #111](https://github.com/Ikarus-eth/Blitzword_app/pull/111) merged as `1f8dbe00b285dce17aa4809a96d9007d752e02bf`; [Pages run 36689743020](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36689743020) succeeded. All 118 checked live files match source ([evidence](../all-enemy-motion/deployment.json)). The user explicitly accepted the staff-pointed direction and authorized all enemies, temporary male-only selection and deployment.

## Scope

All 20 approved enemy designs have attack, recoil, resting defeat and victory: 80 enemy motions. The existing 60 encounters retain their HP ranges, stage names and groups of two, three or five. Baby and young creatures reuse their family frames at uniform 72% and 86% scale; these are not separate age-specific paintings. Every group member has separate presentation state. Only one member attacks or reacts per answer; defeated members stay retired.

Only the male Mage is displayed and selectable. Saved class, gender and hero-index preferences remain intact for a later roster release. Both staff casts, the mage’s other three reactions and Small Pip’s fire are reused. Other Pip growth artwork remains intact. Every actor uses whole transparent painted frames, not face or hair meshes. Selected motion ranges avoid later model drift and clipped wing extremes; some birds consequently use restrained wing gestures.

Melee creatures move into contact; Cave Troll and Moss Golem send ground shocks; winged enemies send gusts; Lantern Wisp sends an ember. These effects arrive at the existing 660 ms impact. Staff casting, Pip assistance, shields and enemy defeat share the existing single committed hit. Reading stays still. Pause, Home, hidden tabs and navigation cancel playback. Reduced-motion and load failures retain the established feedback fallback.

## Cost and delivery

Seventeen remaining families × four actions = 68 initial $0.05 requests. Three requests were rejected by the provider checker; one original Cave Troll result was unavailable with HTTP 404. Four replacement requests bring this batch’s conservative reserve to **$3.60**, and the running total including the previous $1.52 to **$5.12**. Reservations include failed requests; this is not a reconciled invoice. No automatic generation retries or runtime generation calls exist. [Exact prompts, IDs, outcomes and hashes](../all-enemy-motion/generation.json).

The 480p source clips are trimmed, keyed and packed into local WebP sprite atlases. Repeated frames share one atlas tile. Only the mage, Small Pip and current enemy family’s motion images are retained in the playback cache. Groups and stages make no extra API or image-load requests. The package is about 47 MiB in total; each encounter loads only its own family plus shared heroes.

## Review and checks

[All 60 encounters and seven selectable actions in the real isolated game](https://ikarus-eth.github.io/Blitzword_app/assets/battle-motion/review.html). This page uses a temporary in-memory save and never changes a learner adventure. Staff cast, counterattack, Pip assist, member defeat and both celebrations are selectable.

274 automated tests and 96 UI-flow groups pass after integrating main’s adaptive-reading changes. Checks include all 60 variants’ real counterattack handlers, saved girl/knight preferences displaying Mage without being overwritten, group retirement, impact timing, Pip assistance, shields, cancellation, reduced motion, failed media and learner-save continuity. Local atlas decode/bounds checks and selected-frame contacts complement the controller tests.

Source contacts and offline game-layout previews were visually inspected. They use the production drawing code but are not browser recordings. The browser tool’s admin-policy verification denied access, so no alternate browser route was used. Physical iPad/Safari playback and memory performance remain unverified.

The adaptive-reading and illustrated-story changes from main `0592169` are preserved. Deployment uses the unchanged Pages workflow; the motion runtime and review page live in the asset folder it already publishes. Rollback uses the prior main revision without clearing learner storage.
