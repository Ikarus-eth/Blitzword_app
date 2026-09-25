# Archer movement study — 25 September 2026

Status: implemented as a standalone review page; local checks passed; publication pending verification. This is not a replacement for the playable game's heroes. Source baseline: main `d516e28aa15115551eca600bb0a1a90b1605811f`.

## Scope

The approved first step is one articulated male archer, reviewed before expanding to the knight, mage or other appearances. Open `assets/heroes/prototype/archer-review.html` through a static server. The existing Pages workflow recursively copies assets, including this self-contained review page and its dependencies, so it can be checked on iPad once deployed. No workflow change or additional deployment permission is needed. The separate marker is `archer-study-20260925-r1`; `index.html` and its game marker are unchanged.

The prototype provides Play/Pause, Reset, normal speed, slow motion, a timeline, seven named pose buttons, close-up and an optional joint overlay. Nothing starts automatically. Backgrounding stops playback; reduced motion displays a still pose and suppresses arrow flight, impact and enemy recoil. It does not import the game controller, core or save modules, and never accesses browser storage.

## Artwork and movement

The original approved male lineup is preserved. A new 1,254 × 1,254 RGBA PNG separates 16 painted parts: head, torso, cloak, quiver, upper/lower arms, grip/draw/release hands, bow, thighs and boots. Built-in `image_gen` generated it from the original right-hand archer; the [exact prompt and actual output dimensions](ARCHER_ART_PROMPT.json) are preserved. Source rectangles were measured from the output's alpha rather than inferred from the requested grid. The original PNG is unmodified.

The browser assembles those parts as SVG images. Two-bone inverse kinematics maintains the hand contact points and fixed limb lengths. Shoulders, elbows, wrists, hip/knee joints, head and cloak move separately. The bow uses two painted segments that flex around its grip; string endpoints follow the same tip geometry. The arrow stays at the nock through the draw, then travels from that exact position toward the visible enemy. This is a lightweight custom study, not a Spine project or a weighted mesh rig.

| Phase | Timeline |
| --- | --- |
| Raise | 0–180 ms |
| Draw | 180–360 ms |
| Aim | 360–500 ms |
| Release | 500 ms |
| Impact | 660 ms |
| Follow-through and recovery | 500–1,200 ms |

The 1,200 ms total and 660 ms impact match the existing combat feedback window. No production event hooks, health changes, scoring, narration or learning rules are added. The preview shows a Thornling using the existing approved enemy renderer. It uses representative scene proportions, not the complete battle interface; integration in the actual responsive battle layouts remains a later step.

## Verification

`npm ci --ignore-scripts --offline` installed the locked test dependencies. All 239 Node tests and 83 UI-flow groups passed. Five new tests cover limb lengths and planted feet throughout all 1,201 sampled frames, nock/release/impact continuity, recovery, reduced motion, asset integrity and the isolated entry point.

Chromium review covered 1180 × 820, 820 × 1180, 390 × 844 and 844 × 390 layouts, normal/slow playback, pause/resume, reset, all pose controls, joint overlay, close-up, reduced motion and background cancellation. No horizontal overflow, page errors, failed requests or storage access were observed. See [browser measurements](ARCHER_BROWSER_CHECKS.json) and the `review/` screenshots. Physical iPad/Safari, sustained frame-rate and subjective movement/identity approval remain unverified.

## Next review

Judge the draw/release at normal speed and in close-up. Check the bow arm, hand contact, cheek anchor, string behavior, feet and costume overlaps. The current face is a study derived from the approved archer, not a newly approved identity. The user's separate question about more distinct male faces/hair remains a design discussion. A replacement approved head can be swapped independently of the limb animation.

After movement and identity review, decide the final faces, then extend the method to the other heroes and connect it to answer-locked production combat. Keep the original art and learner saves as-is throughout.
