# BlitzWord — one archer attack

Status: production brief and reference package, prepared 25 September 2026. No replacement animation exists yet. The authoring method may be Spine or another animation tool; the game deliverable is a complete-character frame sequence.

## Assignment

Create one polished attack for the **boy archer on the right** of [`assets/rowanfire-boys-2026-09-21.png`](../../assets/rowanfire-boys-2026-09-21.png). This is a paid-test-sized scope to quote separately: one character, one fixed camera, one attack, one ready pose. No knight, mage, alternate gender, new faces, 3D model or other actions are included.

First deliver five connected key poses and a rough motion preview. After the poses and movement are reviewed, finish the artwork and export the animation. Report the proposed schedule, cost, included revisions, commercial-use terms and availability of editable source before commissioning. This package does not itself commission or authorize payment to anyone.

## Character and camera

Preserve the approved chestnut side-swept hair, brown eyes, face, skin tone, child proportions, green woodland cloak/tunic, red hood collar, cream sleeves, botanical details, brown belt/bracers/boots, wooden bow and quiver. The current head/face redesign discussion is separate. Keep the head independently editable in the authoring project.

Face screen right in a readable three-quarter view. The target is off-screen to the right. Keep both shoulder-to-hand connections understandable through the action; choose the camera and torso turn accordingly. Use one consistent camera, scale, lighting and planted-foot position. Retain the painted storybook style. No camera motion, background, cast floor shadow, text, labels, sparks or enemy in the exported character frames.

Do not use the failed prototype's parts atlas as the drawing base. The rejected screenshots in the local handoff package are defect examples only, not approved anatomy or poses. See [the rejection record](ARCHER_ARM_CORRECTION.md#visual-rejection-and-reassessment).

## Action and timing

Total game feedback window: **1,200 ms**. Release: **500 ms**. Enemy impact: **660 ms** (a separate game event, not a baked enemy reaction).

| Time | Required readable action |
| --- | --- |
| 0 ms | Ready, bow lowered, arrow already nocked, relaxed bent arms. |
| 0–180 ms | Raise the bow smoothly with both hands correctly attached. |
| 180–360 ms | Extend the bow arm; pull the string to the cheek with the other hand. Drawing elbow moves outward and back. |
| 360–500 ms | Brief full draw: stable bow, nearly straight bow arm, string-hand cheek anchor, forearm aligned with the arrow. |
| 500 ms | Release: fingers relax, drawing hand continues slightly backward; the bow hand remains firmly on the grip. |
| 500–820 ms | Follow through. Bow/string settle while the front arm stays extended. Do not return the string hand to the bow. |
| 820–1,200 ms | Lower the arms naturally and recover to ready. Avoid an abrupt reset of the silhouette. |

These timings preserve the current game. If they prevent a readable action, identify that in the rough review rather than silently changing the duration. A slower preview may be provided for inspection, but is not the final timing.

The nocked arrow is part of the complete character artwork before release. At release it becomes a separate projectile controlled by the game, so different enemy positions remain possible. Export the same arrow separately, plus its release tip/tail coordinates and direction. Do not leave an arrow in the bow after release or bake a second flying arrow into the body sequence. The next ready pose may restore a nocked arrow between attacks; no full quiver reload is required in this 1.2-second action.

## Visual acceptance

Inspect full-size frames on both a plain light background and a dark background, then at actual game size. Inspect every transition, not just five key poses.

- Exactly two arms and two hands; each hand visibly belongs to the correct arm.
- Shoulders, elbows and wrists remain joined without holes, hollow cut ends, drifting cuffs or detached pieces.
- Fingers maintain contact with the bow grip; the drawing fingers contact the string until release.
- The string joins both bow tips; the arrow stays at its nock during the draw.
- No arm pops through the torso, crosses the face unnaturally or changes length/volume visibly.
- Head, face, hair, costume details, bow shape and proportions stay consistent across the entire clip.
- Feet stay planted, unless a small deliberate weight shift is shown and reviewed; no sliding or scale drift.
- Ready, raise, full draw, release and recovery read at normal speed. Slow motion contains no hidden bad frames.

Geometry tests cannot substitute for this visual review. A renderer-ready file is not automatically an accepted animation.

## Deliverables

1. Editable authoring project and all source artwork, including the independent head, hand poses and bow/string setup. State application/version and any required third-party licenses.
2. Five key-pose stills: ready, raised, full draw, release/follow-through and recovery.
3. Normal-speed and quarter-speed preview videos on a neutral backdrop, with the same fixed camera and framing.
4. Complete-character transparent RGBA PNG frames at **30 fps, 36 frames over 1.2 seconds**. Suggested master canvas: 1024 × 1024, with room for the entire bow and all motion. Keep the canvas and origin identical across all frames; do not individually trim, rotate or resize them. Frame 0000 is ready; frame 0015 starts the release. Return to the ready silhouette at the end without a visible jump when the game holds the ready still.
5. Separate ready PNG, isolated arrow PNG, and metadata: canvas dimensions, fixed ground/foot anchor, release arrow tip/tail coordinates, frame rate and release/impact times.

Use real transparency, not a checkerboard painted into the background. Do not deliver only a GIF, opaque video, disconnected body-part atlas or independently generated poses with identity drift. The integration step will make smaller optimized sprite sheets from the approved master frames and check memory/performance on the game's devices.

## Integration responsibilities

The app will play one complete character frame at a time; it will not separately assemble arms, hands or bow. It will keep the archer still during reading/answer selection, trigger the attack only after answer lock, preserve the 660 ms damage-display event, stop on pause/background/navigation, and use the ready still for reduced motion. Learner saves, health/scoring rules and approved production art stay intact.

The first delivery is a separate review page at normal and slow speed, with frame stepping and close-up. Production integration follows visual acceptance of that one archer attack. Expansion to other heroes is a later decision.

## Reference provenance

Approved source: `assets/rowanfire-boys-2026-09-21.png` from https://github.com/Ikarus-eth/Blitzword_app, current-main baseline `7982b86a0257119bd1d5a353f606a646e91537f3`.

Rejected examples: the two user-supplied screenshots of “Movement study ·02”, showing disconnected limbs and apparent duplicate-hand anatomy. They document failures to avoid; do not copy those connections.

Useful export reference: https://esotericsoftware.com/spine-export#PNG. No purchase of that tool or third-party commission has been made by this package.
