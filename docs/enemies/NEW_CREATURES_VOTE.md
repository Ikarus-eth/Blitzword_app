# New creatures vote — 19 November 2026

Vote page: https://ikarus-eth.github.io/Blitzword_app/assets/new-creatures-vote/

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
