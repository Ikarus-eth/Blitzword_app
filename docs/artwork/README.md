# BlitzWord character artwork - final still selections

Approved 29 September 2026. [Open the complete 33-page artwork document](BlitzWord-character-artwork.pdf). [Exact asset mapping and hashes](character-selections.json).

This is the authoritative **future character artwork selection**: 20 enemy designs, six hero appearances and four retained Pip growth stages. The family rule is Artus first, then Juna among tied choices, then Johanna. Remaining ties were resolved explicitly by the user. Missing ratings were not treated as zero.

**Implementation update — 30 September:** the user accepted the staff-pointed male-mage motion and authorized all enemies and groups plus deployment. Those selected designs are integrated; five other heroes are temporarily disabled, with their saved preferences preserved. The PDF remains the still-selection reference. See [the current animation release](../enemies/ALL_ENEMY_MOTION_RELEASE.md).

The PDF preserves the selected stills, including recovered higher-resolution originals where available. The manifest maps every selection to the repository assets; `originalSha256` identifies the gallery original and `assetSha256` identifies the actual published file, which may be a converted WebP. Current-design crops and masks are retained explicitly. Local filesystem paths are not required.

## Final lineup

| Character | Choice | Repository source |
|---|---|---|
| Thornling | D | [assets/family-review/images/thornling-d.webp](../../assets/family-review/images/thornling-d.webp) |
| Moss Golem | B | [assets/family-review/images/moss-golem-b.webp](../../assets/family-review/images/moss-golem-b.webp) |
| Moon Moth | C | [assets/family-review/images/moon-moth-c.webp](../../assets/family-review/images/moon-moth-c.webp) |
| Root Sprite | D | [assets/family-review/images/root-sprite-d.webp](../../assets/family-review/images/root-sprite-d.webp) |
| Cave Troll | C | [assets/family-review/images/cave-troll-c.webp](../../assets/family-review/images/cave-troll-c.webp) |
| Acorn Imp | C | [assets/family-review/images/acorn-imp-c.webp](../../assets/family-review/images/acorn-imp-c.webp) |
| Mushroom Guard | C | [assets/family-review/images/mushroom-guard-c.webp](../../assets/family-review/images/mushroom-guard-c.webp) |
| Bark Beetle | C | [assets/family-review/images/bark-beetle-c.webp](../../assets/family-review/images/bark-beetle-c.webp) |
| Bramble Boar | C | [assets/family-review/images/bramble-boar-c.webp](../../assets/family-review/images/bramble-boar-c.webp) |
| Reed Serpent | D | [assets/family-review/images/reed-serpent-d.webp](../../assets/family-review/images/reed-serpent-d.webp) |
| Bog Toad | C | [assets/family-review/images/bog-toad-c.webp](../../assets/family-review/images/bog-toad-c.webp) |
| Lantern Wisp | C | [assets/family-review/images/lantern-wisp-c.webp](../../assets/family-review/images/lantern-wisp-c.webp) |
| Crystal Crab | D | [assets/family-review/images/crystal-crab-d.webp](../../assets/family-review/images/crystal-crab-d.webp) |
| Hollow Owl | C | [assets/family-review/images/hollow-owl-c.webp](../../assets/family-review/images/hollow-owl-c.webp) |
| Fern Wolf | D | [assets/family-review/images/fern-wolf-d.webp](../../assets/family-review/images/fern-wolf-d.webp) |
| Stone Ram | B | [assets/family-review/images/stone-ram-b.webp](../../assets/family-review/images/stone-ram-b.webp) |
| Briar Bat | C | [assets/family-review/images/briar-bat-c.webp](../../assets/family-review/images/briar-bat-c.webp) |
| Snail Knight | C | [assets/family-review/images/snail-knight-c.webp](../../assets/family-review/images/snail-knight-c.webp) |
| Chest Mimic | D | [assets/family-review/images/chest-mimic-d.webp](../../assets/family-review/images/chest-mimic-d.webp) |
| Storm Griffin | B | [assets/family-review/images/storm-griffin-b.webp](../../assets/family-review/images/storm-griffin-b.webp) |
| Mage - boy | E | [assets/family-review/images/mage-boy-e.webp](../../assets/family-review/images/mage-boy-e.webp) |
| Knight - boy | D | [assets/family-review/images/knight-boy-d.webp](../../assets/family-review/images/knight-boy-d.webp) |
| Archer - boy | CURRENT | [assets/forest-characters.webp](../../assets/forest-characters.webp) |
| Mage - girl | CURRENT | [assets/forest-characters.webp](../../assets/forest-characters.webp) |
| Knight - girl | C | [assets/family-review/images/knight-girl-c.webp](../../assets/family-review/images/knight-girl-c.webp) |
| Archer - girl | A | [assets/family-review/images/archer-girl-a.webp](../../assets/family-review/images/archer-girl-a.webp) |
| Small Pip | Stage 1 | [assets/evolution/pip-stage-0.webp](../../assets/evolution/pip-stage-0.webp) |
| Big Pip | Stage 2 | [assets/evolution/pip-stage-1.webp](../../assets/evolution/pip-stage-1.webp) |
| Bigger Pip | Stage 3 | [assets/evolution/pip-stage-2.webp](../../assets/evolution/pip-stage-2.webp) |
| Ride on Pip | Stage 4 | [assets/evolution/pip-stage-3.webp](../../assets/evolution/pip-stage-3.webp) |

The dragon pages include both the evolution illustration and current battle/map art. Growth thresholds remain 0 / 15,000 / 45,000 / 70,000 XP. These are four stages, not thirty new character identities.

## Animation implementation

The accepted whole-frame motion approach now covers all 20 enemy families. Smaller ages and groups reuse each family’s frames. Physical iPad/Safari performance remains unverified; current tests and deployment evidence are recorded in the release document.

## Verification

The PDF has 33 pages. All 26 enemy/hero choices are resolved, and all four dragon stages are included. Selected hero pages, cover and lineup were rendered and visually checked after the final tie-breaks; the complete expanded document was rendered and inspected during assembly. Asset paths, source hashes, PDF hash and counts are checked against the manifest. The original document-only update did not change game assets; the later animation release now integrates the selected mage and enemy designs.
