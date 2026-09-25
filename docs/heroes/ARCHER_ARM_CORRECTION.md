# Archer arm correction — 25 September 2026

Status: implemented and locally tested; publication verification pending. Prototype marker `archer-study-20260925-r2`, visible badge “Movement study · 02”. Source baseline: main `e67625c88dc0f132fe45662d95554857f8667502`; merged and reverified the intervening enemy release `e7d038556af2de8f541b6c5754333f0593a34553`.

The user rejected the r1 arm movement. Its limb-length checks passed, but the drawing elbow folded across the chest, the transition could sweep across the face, and the hand returned toward the rebounding string. Those checks did not establish believable movement.

## Changed movement

- Raise the undrawn bow during 0–180 ms, then extend the bow arm and draw toward the cheek during 180–360 ms. The cheek-to-enemy shooting line stays fixed.
- Put the shoulders under their respective cloak openings. Project the drawing elbow toward the viewer during the early draw, then back beside the head. Render its upper arm behind the torso/head, with the forearm in front.
- At full draw, keep the bow arm nearly straight, the drawing elbow behind the shoulder, and the drawing forearm approximately parallel to the arrow.
- Release at 500 ms. Move the drawing hand 12 scene units backward along the shooting line; do not follow the string forward. Hold the bow grip through impact at 660 ms and follow-through until 820 ms.
- Lower the drawing elbow around the back/down side of the shoulder from 820–1,200 ms while the bow lowers. Return to the identical ready pose.
- Use an arrow long enough to reach past the bow at full draw; share its length between rendering and flight calculations. Lower the head attachment and clip neighboring atlas pixels out of the bow crop.

The drawing arm uses fixed three-dimensional segment lengths projected into the painted 2D rig. This permits foreshortening without flipping the elbow over the face. It does not add a 3D model or external animation framework. The original atlas remains unchanged. Bow and leg joints still use planar two-bone IK.

Technique reference: World Archery's [common recurve mistakes](https://www.worldarchery.sport/news/149488/9-common-recurve-archery-mistakes-and-how-fix-them), particularly front-arm stability and continued release direction. The implementation is a stylized motion study, not a validated technique demonstration.

## Verification

`npm ci --ignore-scripts --offline && npm test`: **246 Node tests and 88 UI-flow groups passed**. Seven archer tests cover all 1,201 timeline samples, fixed physical limb lengths, planted feet, undrawn raise, shot-line stability, bow extension, elbow placement, backward release, bow hold, independent downward recovery, continuous paths, arrow contact/impact, exact ready-pose recovery, reduced motion and the isolated entry point.

Existing pose assertions changed deliberately: the shoulder positions and limb lengths now match the revised rig; the draw arm's length check includes projected depth. The required bow lift is 55 instead of 80 scene units because the fixed cheek-to-enemy line aims downward at the low enemy. It no longer lifts the bow away from that line just to satisfy the previous pose.

Chromium checks passed at 1180 × 820, 820 × 1180, 390 × 844 and 844 × 390. Normal/slow play, pause/resume, speed changes, pose buttons, scrubbing, close-up, joint overlay, reset, background cancellation and reduced motion passed. No page errors, failed requests, horizontal overflow or browser-storage access occurred. See [browser results](ARCHER_ARMS_BROWSER_CHECKS.json), `review-r2/` layout screenshots and [twelve sampled poses with joints](review-r2/arm-sequence.png).

The painted limb seams remain visible, especially in close-up. Physical iPad/Safari performance and subjective movement approval remain open. This correction does not approve the face, change the male lineup, expand to other heroes or integrate the rig into combat. Production game files and learner saves remain untouched; the inherited game marker is `enemy-groups-20260925-r1` from the parallel enemy release.

## Publication

Pending merge, existing Pages deployment and live byte verification. The [review page](https://ikarus-eth.github.io/Blitzword_app/assets/heroes/prototype/archer-review.html?v=archer-study-2) remains the same address. The [r1 deployment record](ARCHER_DEPLOYMENT.json) is retained as historical evidence. Rollback checkpoint: `e7d038556af2de8f541b6c5754333f0593a34553`; no save reset is required.
