# Point 6: approved story sentences and picture pairs

**All 34 entries approved by the user on 24 September 2026.** See [implementation and release status](STORY_PICTURES_RELEASE.md). The PDF preserves the pre-approval review copy; its exact wording and pairs are unchanged.

Open [the full picture gallery](story-review/index.html) locally to view every actual pair. Download [the portable PDF](../output/pdf/blitzword-story-sentence-review.pdf); the table below and [machine-readable proposal](story-review/proposal.json) preserve the exact wording and approved asset references in GitHub.

## Approval

The user reviewed the complete set in PR #66 and said “ok go ahead.” This satisfies the point 6 gate in [current status](CURRENT_STATUS.md): “show the user all 34 sentences with their picture pairs for approval before building.”

31 entries use only prior chapter targets (plus the dragon name). Entries 01, 03 and 04 each use one listening exception: **jump**, **the**, **look**. Tapping that word speaks it and records help. No assumed sight words, inflection credit or next-chapter previews are used. The early curriculum lacks function words, so some lines intentionally recap an earlier moment. This preserves the already-approved spoken story introductions.

All pairs use existing approved art, whole or clipped from an atlas. No new artwork is proposed; none of these rewritten lines is currently marked as lacking a fitting picture. Picture fit was approved by the user; it is not a test of child comprehension. Matching/other captions are reviewer-only; the child UI shows unlabelled, shuffled choices with saved order.

## All 34 entries

| # | Campaign.chapter | Place | Approved sentence | Tap-to-hear exception | Matching / other picture |
|---|---|---|---|---|---|
| 01 | 1.2 | Fox Crossing | Jump, Pip! | jump | jump / rock |
| 02 | 1.3 | Old Grove | Pip, jump over water. | None | jump / fox |
| 03 | 1.4 | Lantern Ruins | Open the book, Pip. | the | open-book / closed-book |
| 04 | 1.5 | Hidden Nest | Look up, Pip. | look | owl-fire / fox |
| 05 | 2.1 | River Bank | Pip, jump up! | None | jump / rock |
| 06 | 2.2 | Stone Bridge | Open the gate. | None | open-gate / treasure-gate |
| 07 | 2.3 | Reed Path | The bird is over the water. | None | jump / owl-fire |
| 08 | 2.4 | Blue Pool | The water is in the forest. | None | forest-pool / cave-pool |
| 09 | 2.5 | River Gate | Pip is at the gate. | None | treasure-gate / cave |
| 10 | 3.1 | Oak Path | The tree is big. | None | tree / closed-book |
| 11 | 3.2 | Leaf Den | Pip is in the forest. | None | owl-fire / treasure-gate |
| 12 | 3.3 | Moss Steps | Pip can jump over the water. | None | jump / rock |
| 13 | 3.4 | Root Arch | There is a big tree. | None | tree / open-book |
| 14 | 3.5 | Old Oak | The tree is green. | None | tree / autumn-tree |
| 15 | 4.1 | Stone Path | Pip is on the rock. | None | rock / jump |
| 16 | 4.2 | Lamp Grove | The fire is in the forest. | None | owl-fire / pan-fire |
| 17 | 4.3 | Old Wall | The gate is not open. | None | treasure-gate / open-gate |
| 18 | 4.4 | Gold Door | Pip is by the treasure. | None | treasure-gate / open-book |
| 19 | 4.5 | Light Hall | Look at the moon. | None | moon-path / day-path |
| 20 | 5.1 | Moon Path | It is not day. | None | moon-path / day-path |
| 21 | 5.2 | Owl Tree | The owl is in the tree. | None | owl-fire / jump |
| 22 | 5.3 | Star Pool | The light is on the water. | None | star-pool / owl-fire |
| 23 | 5.4 | Night Arch | We can see the moon. | None | moon-path / day-path |
| 24 | 5.5 | Moon Nest | Pip is by the fire. | None | owl-fire / rock |
| 25 | 6.1 | Cave Mouth | Look into the cave. | None | cave / fox |
| 26 | 6.2 | Blue Stone | There is light in the cave. | None | cave-light / owl-fire |
| 27 | 6.3 | Deep Pool | The water is in the cave. | None | cave-pool / forest-pool |
| 28 | 6.4 | Glow Hall | We are in the cave. | None | glow-cave / forest-pool |
| 29 | 6.5 | Crystal Gate | The gate is open. | None | open-gate / treasure-gate |
| 30 | 7.1 | Hill Path | Look up at the castle. | None | hill-castle / day-path |
| 31 | 7.2 | Cloud Steps | We go up. | None | cloud-steps / day-path |
| 32 | 7.3 | Sky Bridge | We can see the castle. | None | sky-bridge / forest-pool |
| 33 | 7.4 | High Tower | The castle is by the tree. | None | sky-keep / forest-pool |
| 34 | 7.5 | Sky Keep | The queen is by the gate. | None | queen / treasure-gate |

## Verification and limits

Baseline main: `4ed8a7bd0ea45762ef551a354bee943f46829023`. The original workbook SHA-256 remains `fdb7d803f03f28b895b4b82ee7e224b52e51579c77d41a47c49b7a2a9cc735f0`; its 200 targets equal the playable target set. The workbook is unchanged. Prior-word availability uses the current app map-field order, not the workbook frequency ranking.

A fresh exact-token audit finds 26/34 existing sentences contain untaught words. Counting the exempt Pip token as available gives 100/158 available tokens (63.3%); this differs from the handover's approximate 62%, so the counts and method are explicit. The proposed set has 158/161 available tokens (98.1%) and exactly three single-word early exceptions. Every later entry has zero exceptions. The first field keeps its existing introduction and is excluded from these 34.

Availability means the word was a target in an earlier completed field, not proof of mastery or a guarantee that a full picture lesson was shown. Every source path, image dimension, crop bound and SHA-256 is recorded in the JSON. Artwork selections have been visually inspected; no child-play or physical iPad test is claimed.

The approved implementation uses the two-picture prompt in place of I read it, optional word listening, first-choice/help recording, correct-picture feedback on a wrong choice, and non-blocking continuation. No health, XP, mastery or active-time credit. A two-picture response has 50% chance accuracy and should not be presented to Parents as proof of independent reading. Preserve current saved story phases, pending battles and chapter gates.

The review gallery passes checks at 1180×820, 820×1180 and 390×844: 34 cards, 68 loaded pictures, working numbered links, explicit crop clipping and no horizontal overflow or page errors. All 18 PDF pages were visually inspected. The existing app suite still passes on Node 22.23.3: 176 core tests and 57 UI-flow groups. No behavior tests were changed. See the [proposal verification record](story-review/verification.json).

## Picture key

### jump

Pip jumps over a stream; a bird flies above the water.

Source: [assets/teaching/chapter-teaching.png](../assets/teaching/chapter-teaching.png); crop: `[0, 0, 768, 512]`.

### rock

Pip sits on top of one broad rock.

Source: [assets/teaching/sat-rock.webp](../assets/teaching/sat-rock.webp); crop: `whole image`.

### fox

Pip follows a fox along a dry woodland path.

Source: [assets/teaching/fox.webp](../assets/teaching/fox.webp); crop: `whole image`.

### tree

Pip looks up at a large tree with green leaves.

Source: [assets/teaching/green-tree.webp](../assets/teaching/green-tree.webp); crop: `whole image`.

### cave

Pip stands outside a dark cave and looks inside.

Source: [assets/teaching/cave.webp](../assets/teaching/cave.webp); crop: `whole image`.

### owl-fire

Pip looks up towards an owl; a campfire burns in the night forest.

Source: [assets/teaching/chapter-teaching.png](../assets/teaching/chapter-teaching.png); crop: `[0, 512, 768, 512]`.

### treasure-gate

Pip and an open treasure chest stand beside a closed castle gate.

Source: [assets/teaching/chapter-teaching.png](../assets/teaching/chapter-teaching.png); crop: `[768, 512, 768, 512]`.

### open-book

An open book with its pages visible.

Source: [assets/teaching/chapter-teaching.png](../assets/teaching/chapter-teaching.png); crop: `[880, 225, 425, 200]`.

### closed-book

A small red book with its cover shut.

Source: [assets/teaching/chapter-teaching.png](../assets/teaching/chapter-teaching.png); crop: `[1320, 280, 170, 140]`.

### pan-fire

A pan stands in a room beside a cooking fire.

Source: [assets/teaching/core-teaching.webp](../assets/teaching/core-teaching.webp); crop: `[362, 1086, 362, 362]`.

### queen

A queen stands beside a closed castle gate, holding a sword.

Source: [assets/teaching/core-teaching.webp](../assets/teaching/core-teaching.webp); crop: `[362, 362, 362, 362]`.

### open-gate

Two gate doors stand open, leaving a clear passage.

Source: [assets/scenery/chapter-2-place-5.webp](../assets/scenery/chapter-2-place-5.webp); crop: `whole image`.

### forest-pool

Water fills an open-air pool among rocks and trees.

Source: [assets/scenery/chapter-2-place-4.webp](../assets/scenery/chapter-2-place-4.webp); crop: `whole image`.

### cave-pool

Water fills a pool inside a cave beneath a rock ceiling.

Source: [assets/scenery/chapter-6-place-3.webp](../assets/scenery/chapter-6-place-3.webp); crop: `whole image`.

### glow-cave

A glowing cavern surrounds a pool, entirely beneath a rocky roof.

Source: [assets/scenery/chapter-6-place-4.webp](../assets/scenery/chapter-6-place-4.webp); crop: `whole image`.

### autumn-tree

A large oak has golden autumn leaves.

Source: [assets/scenery/chapter-3-place-5.webp](../assets/scenery/chapter-3-place-5.webp); crop: `whole image`.

### cave-light

Glowing stones light the inside of a cave.

Source: [assets/scenery/chapter-6-place-2.webp](../assets/scenery/chapter-6-place-2.webp); crop: `whole image`.

### moon-path

A bright moon is high above a forest path at night.

Source: [assets/scenery/chapter-5-place-1.webp](../assets/scenery/chapter-5-place-1.webp); crop: `whole image`.

### day-path

A dry path beside reeds in daylight; no moon is visible.

Source: [assets/scenery/chapter-2-place-3.webp](../assets/scenery/chapter-2-place-3.webp); crop: `whole image`.

### star-pool

Moonlight is reflected in a forest pool at night.

Source: [assets/scenery/chapter-5-place-3.webp](../assets/scenery/chapter-5-place-3.webp); crop: `whole image`.

### hill-castle

A castle stands high on a distant hill.

Source: [assets/scenery/chapter-7-place-1.webp](../assets/scenery/chapter-7-place-1.webp); crop: `whole image`.

### cloud-steps

A long flight of stone steps rises towards a castle.

Source: [assets/scenery/chapter-7-place-2.webp](../assets/scenery/chapter-7-place-2.webp); crop: `whole image`.

### sky-bridge

A broad bridge leads straight towards a large castle.

Source: [assets/scenery/chapter-7-place-3.webp](../assets/scenery/chapter-7-place-3.webp); crop: `whole image`.

### sky-keep

A castle gate and stone steps stand on the mountainside.

Source: [assets/scenery/chapter-7-place-5.webp](../assets/scenery/chapter-7-place-5.webp); crop: `whole image`.
