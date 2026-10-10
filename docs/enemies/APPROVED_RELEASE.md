# Artus’s approved creature expansion

Implemented 10 October 2026. Deployment status is recorded in CURRENT_STATUS.md and APPROVED_DEPLOYMENT.json after verification.

## Scope

Artus rated 184 options for 46 candidates. His 45 unique highest choices scored at least 3/5; Ore Ant scored 1/5 for every option and is excluded. No tiebreak required Juna. The saved DOM ratings, selection ledger and exact source cells are retained beside this file.

The Creature Book now lists 65 families. The 45 additions have names, silhouette/painted artwork, habitat clues, secrets, narration and existing discovery/companion behavior. They remain locked until new chapters introduce them. Existing 20-family random pools, 79 variants, 12 missions, 48 riddles, ninth-task maps, learner saves, XP and rewards remain unchanged. Explicit new-family encounters and 180 strength variants (6–32 HP) are supported for future content. Base entries support 3–5 HP.

## Art and voice

Nine transparent PNG atlases hold five creatures each. One crowded atlas received a layout repair (10 built-in ImageGen calls total). No generated video or per-frame generation. The intact painting moves briefly for attacks, hit reactions, retreats and celebrations, using the existing 660 ms impact and 1,200 ms feedback. Juveniles use uniform scaling, not separately generated anatomy. SVGs clip the source cell before scaling, preventing neighbouring sprites from leaking into small forms. Canvas draws only each crop. Existing reduced-motion and cancellation paths remain.

George recorded 141 segments in 12 batches: names, secrets, trail intros and six reusable location lines. Exactly 5,430 text characters requested; existing ready/protection phrases are reused. Paid MP3s, alignment receipts, source workflow and hashes are preserved. There were no paid narration retries. The generation-only branch must not be merged into main.

The standalone preview at `assets/enemies/approved-20261010/` exposes all selected art, voice playback and isolated battle previews without touching learner storage.

## Verification

356 unit tests passed before incorporating parallel main updates; the four added shared-atlas tests also pass (360 total). All 116 UI flow groups pass.

- Selection, explicit encounters, migration, locked/discovered companions, clipped artwork, all four motion modes, narration coverage and file hashes have focused automated tests.
- All 45 enemies also run through actual UI answer feedback: one recorded answer, one hit at the existing time, and cancellation on Home.
- All 45 Creature Book details open safely with no link to an unavailable mission. A revealed Snow Owl can speak its secret and be selected as a teammate.
- All nine RGBA images checked; no solid alpha pixels touch any creature crop boundary. All 45 sprites inspected in the browser against dark green; the white owl also against cream. One crowded sheet repaired and clipping leakage corrected.
- All 12 MP3s decode; all 141 segment ranges contain non-silent audio and stay within their recording. Browser name playback was exercised. This is not a human pronunciation review.
- Browser checks cover the complete gallery, Snow Owl battle preview, and locked Creature Book detail on desktop and 390×844 phone layout. Physical iPad testing is not claimed.
- Parallel main changes for the shared maps-only page and German toggle were incorporated before publication.

## Remaining work

New chapters still need story/scenery, reading and riddle sequences, encounter placement, unlock prerequisites, difficulty/playtime tuning and chapter-specific narration. Bespoke creature abilities or full frame-by-frame animations are optional future enhancements. These additions use the existing combat mechanics.
