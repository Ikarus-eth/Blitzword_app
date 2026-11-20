# New creatures vote — 19–20 November 2026

## Replaced on 20 November 2026: ChatGPT-painted creatures

The 19 November fal.ai sheets did not match the game's art style (too soft and pastel), so that page was replaced at the same address with review id `new-creatures-20261120` (fresh vote storage key `blitzword-new-creatures-20261120-v1`). The user approved ChatGPT's built-in ImageGen pictures instead, one picture per look: 13 creatures × A Storybook / B Elemental / C Champion = 39 pictures.

- Tiger, Phoenix, Octopus: branch `concepts/tiger-phoenix-octopus-20261120`, `assets/creature-concepts-20261120`.
- Aardvark, Bison, Camel, Nautilus, Pelican, Flying Fish, Okapi, Cassowary, Stick Insect, Triceratops: branch `concepts/ten-creatures-20261120`, `assets/creature-expansion-20261120` (species check in its `roster-check.json`).

The 1254 px PNG originals stay on those branches; the page uses 900 px WebP copies (about 4.5 MB in total), listed with source and copy hashes in `assets/new-creatures-vote/artwork-manifest.json`. Pictures are shown whole, captions included. Voting rules are unchanged. **Deployed and verified.** [PR #261](https://github.com/Ikarus-eth/Blitzword_app/pull/261) merged as `be2495a5a29b55a9da07e50dfb6cc834f894d350`; [Pages run 44683381951](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/44683381951) succeeded; the live page, scripts, catalog, manifest and all 39 pictures match the merge byte for byte ([verification run 44683749148](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/44683749148), 46 files). Headless Chrome checked rating, reload persistence and layout at iPad and phone sizes; physical iPad not checked. The fal.ai concepts and prompts below remain as history only; they are not on the page.

## History: 19 November fal.ai version

Vote page: https://ikarus-eth.github.io/Blitzword_app/assets/new-creatures-vote/

**Deployed and verified.** [PR #259](https://github.com/Ikarus-eth/Blitzword_app/pull/259) merged as `2be921ea79d6ce9cbff5eb1b83c8533cb357b35e`; [Pages run 44465415942](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/44465415942) succeeded. The live page, scripts, catalog, manifest and all 23 sheets match the merge byte for byte ([verification run 44465888617](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/44465888617), 30 files). Headless Chrome checked rating, reload persistence and layout at 1180×820, 820×1180 and 390×844 without overflow. Physical iPad not checked.

## Why

Artus's 19 November report (07:53 Bali time) showed 64 of the 65 Creature Book families met. All 65 are placed in campaigns; the Wizard's Tower placed the last nine. There was no creature backlog: the October vote's other 139 looks were alternatives for the same 45 creatures, and Ore Ant was rejected. The user asked for 35 new creatures, three styles each for Artus to vote on, with at most $1 of generation cost.

## Content

35 new species in `docs/adventures/new-creatures/concepts.json`. None repeats a species among the 65 families, Ore Ant or the four concepts excluded in October. They cover sea, sky, jungle, snow, savanna, outback, river and night habitats for future campaigns. Each has three styles:

- A Storybook: the natural painted animal, like the current creatures.
- B Elemental: the same animal with a strong glowing power.
- C Champion: an armoured or geared hero form.

## Art and cost

fal.ai `fal-ai/nano-banana/edit` through the existing `mission-art.yml` workflow (story `batch` input), six-cell sheets of two creatures × three styles, 1248×832 WebP. Requests and prompts are in `docs/adventures/new-creatures/`.

| Batch | Images | Notes |
| --- | --- | --- |
| sheets-1-test | 1 | Test of layout and style (Tide Octopus, Lava Rhino) |
| sheets-2-rest | 16 + 1 failed | sheet-10 ended with an HTTP error (request id saved, not resubmitted) |
| sheets-3-retake | 5 | Fixes: missing lion/hummingbird, otter copied into crocodile and flamingo Champions, four-legged dragonfly, too-similar styles |
| sheets-4-final | 1 | Fixes where the koala/penguin reference leaked into kangaroo, lion, hummingbird and phoenix cells |

23 images downloaded at about $0.039 each ≈ $0.90; if the failed request was billed, ≈ $0.94. Prices are fal.ai list prices, not an inspected invoice.

The model drew captions under some cells despite instructions; crops keep the top 87% of each cell (the one-row Dream Tapir sheet uses its upper middle), so no caption shows. Six cells come from the final sheet (`cell-overrides.json`). All 105 crops were inspected on contact sheets. Known small flaws: the Bolt Kangaroo Storybook has faint lightning; the Abyss Angler Elemental has a dark square background.

## Page and rules

`assets/new-creatures-vote/` reuses the October final-look page: Artus rates every style 1–5; a unique highest score of at least 3 wins; Juna only breaks Artus's ties; all three below 3 leaves the creature out. Votes save in this browser under `blitzword-new-creatures-20261119-v1`; Download votes exports a JSON file with results and the chosen style per creature. This is artwork review only; nothing enters the game until chosen creatures are added to a future campaign.

`docs/adventures/new-creatures/build-catalog.py` rebuilds `catalog.json`, the sheets and `artwork-manifest.json` (hashes). Tests: `tests/new-creatures-vote.test.js`.
