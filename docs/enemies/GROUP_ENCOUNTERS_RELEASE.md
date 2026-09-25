# Group encounters and growth forms — 25 September 2026

Build: `enemy-groups-20260925-r1`. Authorized by the user: “then implement what we discussed, deploy and confirm”.

## Behavior

All 20 families have three curated variants (60 total). The exact table below records total encounter HP, including every creature in a group. Most families have variants overlapping 15–25 HP. The player retains Same/Stronger/Easier control; the release does not force 80% of a beginner's encounters into that range. Tiny 3-HP training creatures preserve the existing entry point. Normal stronger choices end at 32 HP; already-saved higher strengths and tier IDs remain readable and playable.

Groups contain two, three or five separate rigs. HP is distributed evenly, with remainder points assigned to the first members. Damage is sequential: five 5-HP beetles start at 25 HP, and one retreats at 20, 15, 10, 5 and 0 remaining HP. There is one shared bar and one collective enemy attack opportunity, not one attack per member. Shields, help and free-practice rules remain unchanged.

Damage and learning evidence are saved immediately. The bar and group membership wait through narration and wind-up, then change at 660 ms. Only the struck member recoils; surviving members stay still. A defeated member fades away over the remaining reaction time. Reduced motion reveals immediately. Pause, Home and cancellation settle to committed health; reload derives the same surviving members from the saved enemy ID and total/remaining HP. No learner reset or migration of an active opponent is needed.

The normal selection balances eligible family and variant visits, with a 60-key bounded count map. It avoids starving later families when the short recent-history window fills. Reading difficulty/exposure, rewards, chapter objectives, soundscape, hero work and existing recordings remain unchanged. Group introductions use device speech for their new plural wording.

## Approved HP ranges

| Family | Variants and total HP |
|---|---|
| Thornling | Baby Thornling: 6–9; Young Thornling: 12–17; Adult Thornling: 18–23 |
| Moss Golem | Small Moss Golem: 10–14; Grown Moss Golem: 16–22; Ancient Moss Golem: 23–28 |
| Moon Moth | Moon Moth: 5–8; 2 Moon Moths: 10–16; 3 Moon Moths: 15–24 |
| Root Sprite | Sapling Root Sprite: 8–12; Grown Root Sprite: 15–20; Elder Root Sprite: 20–25 |
| Cave Troll | Baby Cave Troll: 10–14; Young Cave Troll: 17–22; Adult Cave Troll: 23–30 |
| Acorn Imp | Acorn Imp: 7–9; 2 Acorn Imps: 14–18; 3 Acorn Imps: 21–27 |
| Mushroom Guard | Sprout Mushroom Guard: 9–13; Grown Mushroom Guard: 15–20; Elder Mushroom Guard: 20–25 |
| Bark Beetle | Bark Beetle: 4–5; 3 Bark Beetles: 12–15; 5 Bark Beetles: 20–25 |
| Bramble Boar | Piglet Bramble Boar: 8–12; Young Bramble Boar: 15–20; Adult Bramble Boar: 20–26 |
| Reed Serpent | Hatchling Reed Serpent: 7–11; Young Reed Serpent: 14–19; Adult Reed Serpent: 19–25 |
| Bog Toad | Toadlet Bog Toad: 7–11; Young Bog Toad: 14–19; Adult Bog Toad: 19–24 |
| Lantern Wisp | Lantern Wisp: 6–8; 2 Lantern Wisps: 12–16; 3 Lantern Wisps: 18–24 |
| Crystal Crab | Small Crystal Crab: 8–12; Grown Crystal Crab: 15–20; Large Crystal Crab: 20–25 |
| Hollow Owl | Fledgling Hollow Owl: 8–12; Young Hollow Owl: 14–18; Adult Hollow Owl: 18–23 |
| Fern Wolf | Young Fern Wolf: 8–12; Adult Fern Wolf: 17–23; 2 young Fern Wolves: 16–24 |
| Stone Ram | Lamb Stone Ram: 10–14; Young Stone Ram: 16–21; Adult Stone Ram: 22–28 |
| Briar Bat | Briar Bat: 4–5; 3 Briar Bats: 12–15; 5 Briar Bats: 20–25 |
| Snail Knight | Small Snail Knight: 9–13; Grown Snail Knight: 16–21; Elder Snail Knight: 21–26 |
| Chest Mimic | Small box Chest Mimic: 10–14; Chest Mimic: 17–23; Large coffer Chest Mimic: 24–30 |
| Storm Griffin | Hatchling Storm Griffin: 11–15; Young Storm Griffin: 18–24; Adult Storm Griffin: 25–32 |

## Artwork

The existing transparent painted parts and exact approved identities are reused. Baby/small and young rigs have different head-to-body proportions, shorter limbs, wings and tails, smaller equipment/shells, and less golem shoulder foliage. These are articulated proportion variants, not separately regenerated painted atlases. Distinct shorter ram horns and fewer crab crystals are not newly painted features. The growth selector in `tests/enemy-review.html` inspects all three forms; real group battle fixtures are available as `tests/review-app.html?scene=enemy-group-2`, `enemy-group-3`, `enemy-group-5` and the corresponding `-partial` scenes.

## Verification

All 244 core tests and 85 UI-flow groups pass. New tests cover roster ranges and rotation, sequential HP conservation for every group variant, saved identity and membership, shields, one attack, impact timing, pause/reload, final-member defeat and reduced motion. The older fixed-three-point-tier assertions are replaced by the approved ranges; the existing 4-HP long-play simulation now correctly expects its two eligible families. Chromium 153 passed 24 isolated battle-layout scenarios: all three group sizes, full and partially defeated groups, at 1180×820, 820×1180, 390×844 and 844×390. All 60 family/stage renders loaded; tablet/phone group layouts and stage galleries were visually inspected. Zero page errors, horizontal overflow or learner-storage writes; characters remain still during choices. The review caught and fixed the group container positioning override. [Browser measurements](GROUP_ENCOUNTERS_QA.json). Physical iPad/Safari and live child play are untested. Deployment evidence follows after publication.
