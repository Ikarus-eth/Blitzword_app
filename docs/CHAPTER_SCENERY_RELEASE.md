# Distinct chapter scenery — 23 September 2026

## Implementation

Every one of the 35 existing chapter IDs maps to a different, existing WebP background in `content.js`. IDs, story descriptions, words, saves and progression are unchanged. The renderer derives the scene from the saved story `areaId`, number-duel `areaId` or battle `areaId`; it never stores image paths in learner records. The active encounter remains authoritative even when progression has moved into the next campaign. Map imagery and selection/resume behavior remain unchanged; selecting an explored map node continues to use the existing game resume rules.

Encounter, battle, chapter story, result, number duel and session summary use the relevant scenery. Story images use their own aspect ratio so essential landmarks and footing remain in frame. Battle backgrounds use centered cover sizing for both orientations. Existing reading parchment and answer controls remain opaque and unchanged.

Only the current chapter image is requested, with the original forest as the CSS fallback. Story image errors switch once to the original forest; if all art requests fail, the solid forest-green backing still permits play. There is no scenery preload loop or gameplay wait for image loading. The map atlas is retained for maps only. A previously opened tab must reload to receive this build; no save reset or migration is needed.

## Artwork and delivery

Twenty-eight original 1536 × 1024 illustrations were generated with the **built-in image_gen tool**, each with a separate prompt derived from the current chapter name and story. Exact prompts are in [CHAPTER_SCENERY_PROMPTS.json](CHAPTER_SCENERY_PROMPTS.json). Image-generation output filenames, dimensions, byte counts and SHA-256 hashes are in [CHAPTER_SCENERY_ASSETS.json](CHAPTER_SCENERY_ASSETS.json).

Seven approved settings are reused: the 1536 × 1024 original clearing and six distinct 512 × 512 panels from `assets/chapter-scenes.webp`. Atlas panels were extracted without visual changes and encoded losslessly, not enlarged. They are six different paintings, not colour/crop variants used to inflate the chapter count. Campaign maps retain the untouched original atlas.

Generated assets use WebP quality 88, method 6, at native resolution. This reduces delivery size while retaining fine texture at gameplay scale. Original generation outputs remain in the task's generated-image directory; deployed assets and prompt/provenance records are maintained in GitHub. Backgrounds contain no characters, enemies, controls or baked text. Dry banks, terraces and broad paths provide actor footing; scene details are concentrated away from the reading and answer areas.

The complete 35-scene set is 13.94 MB; the largest image is 637 kB. These are total repository asset bytes, not startup download size.

## Chapter mapping

| Campaign / chapter | Stable ID | Name | Background | Source |
|---|---|---|---|---|
| 1 / 1 | `lantern-trail` | Lantern Trail | [forest-clearing.webp](../assets/forest-clearing.webp) | Retained |
| 1 / 2 | `fox-crossing` | Fox Crossing | [fox-crossing.webp](../assets/scenery/fox-crossing.webp) | Generated |
| 1 / 3 | `old-grove` | Old Grove | [old-grove.webp](../assets/scenery/old-grove.webp) | Generated |
| 1 / 4 | `lantern-ruins` | Lantern Ruins | [lantern-ruins.webp](../assets/scenery/lantern-ruins.webp) | Generated |
| 1 / 5 | `hidden-nest` | Hidden Nest | [hidden-nest.webp](../assets/scenery/hidden-nest.webp) | Generated |
| 2 / 1 | `chapter-2-place-1` | River Bank | [chapter-2-place-1.webp](../assets/scenery/chapter-2-place-1.webp) | Generated |
| 2 / 2 | `chapter-2-place-2` | Stone Bridge | [chapter-2-place-2.webp](../assets/scenery/chapter-2-place-2.webp) | Retained |
| 2 / 3 | `chapter-2-place-3` | Reed Path | [chapter-2-place-3.webp](../assets/scenery/chapter-2-place-3.webp) | Generated |
| 2 / 4 | `chapter-2-place-4` | Blue Pool | [chapter-2-place-4.webp](../assets/scenery/chapter-2-place-4.webp) | Generated |
| 2 / 5 | `chapter-2-place-5` | River Gate | [chapter-2-place-5.webp](../assets/scenery/chapter-2-place-5.webp) | Generated |
| 3 / 1 | `chapter-3-place-1` | Oak Path | [chapter-3-place-1.webp](../assets/scenery/chapter-3-place-1.webp) | Retained |
| 3 / 2 | `chapter-3-place-2` | Leaf Den | [chapter-3-place-2.webp](../assets/scenery/chapter-3-place-2.webp) | Generated |
| 3 / 3 | `chapter-3-place-3` | Moss Steps | [chapter-3-place-3.webp](../assets/scenery/chapter-3-place-3.webp) | Generated |
| 3 / 4 | `chapter-3-place-4` | Root Arch | [chapter-3-place-4.webp](../assets/scenery/chapter-3-place-4.webp) | Generated |
| 3 / 5 | `chapter-3-place-5` | Old Oak | [chapter-3-place-5.webp](../assets/scenery/chapter-3-place-5.webp) | Generated |
| 4 / 1 | `chapter-4-place-1` | Stone Path | [chapter-4-place-1.webp](../assets/scenery/chapter-4-place-1.webp) | Retained |
| 4 / 2 | `chapter-4-place-2` | Lamp Grove | [chapter-4-place-2.webp](../assets/scenery/chapter-4-place-2.webp) | Generated |
| 4 / 3 | `chapter-4-place-3` | Old Wall | [chapter-4-place-3.webp](../assets/scenery/chapter-4-place-3.webp) | Generated |
| 4 / 4 | `chapter-4-place-4` | Gold Door | [chapter-4-place-4.webp](../assets/scenery/chapter-4-place-4.webp) | Generated |
| 4 / 5 | `chapter-4-place-5` | Light Hall | [chapter-4-place-5.webp](../assets/scenery/chapter-4-place-5.webp) | Generated |
| 5 / 1 | `chapter-5-place-1` | Moon Path | [chapter-5-place-1.webp](../assets/scenery/chapter-5-place-1.webp) | Generated |
| 5 / 2 | `chapter-5-place-2` | Owl Tree | [chapter-5-place-2.webp](../assets/scenery/chapter-5-place-2.webp) | Generated |
| 5 / 3 | `chapter-5-place-3` | Star Pool | [chapter-5-place-3.webp](../assets/scenery/chapter-5-place-3.webp) | Retained |
| 5 / 4 | `chapter-5-place-4` | Night Arch | [chapter-5-place-4.webp](../assets/scenery/chapter-5-place-4.webp) | Generated |
| 5 / 5 | `chapter-5-place-5` | Moon Nest | [chapter-5-place-5.webp](../assets/scenery/chapter-5-place-5.webp) | Generated |
| 6 / 1 | `chapter-6-place-1` | Cave Mouth | [chapter-6-place-1.webp](../assets/scenery/chapter-6-place-1.webp) | Generated |
| 6 / 2 | `chapter-6-place-2` | Blue Stone | [chapter-6-place-2.webp](../assets/scenery/chapter-6-place-2.webp) | Generated |
| 6 / 3 | `chapter-6-place-3` | Deep Pool | [chapter-6-place-3.webp](../assets/scenery/chapter-6-place-3.webp) | Generated |
| 6 / 4 | `chapter-6-place-4` | Glow Hall | [chapter-6-place-4.webp](../assets/scenery/chapter-6-place-4.webp) | Retained |
| 6 / 5 | `chapter-6-place-5` | Crystal Gate | [chapter-6-place-5.webp](../assets/scenery/chapter-6-place-5.webp) | Generated |
| 7 / 1 | `chapter-7-place-1` | Hill Path | [chapter-7-place-1.webp](../assets/scenery/chapter-7-place-1.webp) | Generated |
| 7 / 2 | `chapter-7-place-2` | Cloud Steps | [chapter-7-place-2.webp](../assets/scenery/chapter-7-place-2.webp) | Generated |
| 7 / 3 | `chapter-7-place-3` | Sky Bridge | [chapter-7-place-3.webp](../assets/scenery/chapter-7-place-3.webp) | Generated |
| 7 / 4 | `chapter-7-place-4` | High Tower | [chapter-7-place-4.webp](../assets/scenery/chapter-7-place-4.webp) | Generated |
| 7 / 5 | `chapter-7-place-5` | Sky Keep | [chapter-7-place-5.webp](../assets/scenery/chapter-7-place-5.webp) | Retained |

## Verification and limitations

- Automated mapping checks cover exactly 35 stable IDs, 35 distinct file paths and SHA-256 hashes, WebP headers, individual and aggregate size budgets.
- UI regressions cover all 35 chapters through story, encounter, battle, Pause/Home and saved-game reload, plus a previous-campaign encounter after progression advances, a saved completed-chapter revisit, missing artwork and missing mapping.
- All 110 core tests and 33 UI-flow groups pass, including the existing curriculum, progress, XP, shields and audio suites. The existing Pages workflow repeats its script checks and `npm test` before deploying.
- The source paintings were visually inspected during generation; assets include open foreground ground planes and central landmarks. **Actual rendered viewport inspection is blocked in this session:** the browser could not verify its admin-enforced security policy for either the local preview or the existing GitHub Pages review page. No bypass was attempted. Tablet landscape (1024 × 768), tablet portrait (768 × 1024) and phone (390 × 844) review fixtures are provided in [the isolated scenery review](../tests/scenery-review.html), using the actual app and in-memory saves.
- Consequently, rendered character visibility, exact grounding/cropping, browser network behaviour and readable-control review at those dimensions remain unverified. Physical iPad testing also remains unperformed. The retained 512-pixel scenes retain their original lower resolution; they were not upscaled or redrawn.
- [PR #28](https://github.com/Ikarus-eth/Blitzword_app/pull/28) merged implementation commit `a9d39efef14200dd9494b8c779182cc64ec9e73d`. [Pages run 35833726978](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35833726978) succeeded for that exact commit, including installation, regressions, current-main guard, artifact upload and deployment.
- Live HTTP verification on 23 September 2026 confirmed build `chapter-scenery-20260923-r1` and scenery marker `35-chapters-20260923-r1`. All 35 background assets and seven app/review files returned HTTP 200 and matched the tested source byte for byte. [The deployment record](CHAPTER_SCENERY_DEPLOYMENT.json) contains timestamps, byte counts and hashes. The runtime is deployed; rendered viewport QA remains blocked as described above.
- This verification documentation changes no deployed application or asset bytes. Subsequent documentation-only commits retain the same build marker.
