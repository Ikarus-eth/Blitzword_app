# New enemy final-look review — 10 October 2026

Review page: https://ikarus-eth.github.io/Blitzword_app/assets/enemy-finals/

This is an artwork decision page only. No new enemy is integrated into gameplay, curriculum, encounters or the Creature Book.

## Scope and art

The initial browser review has 40 For, six Unsure and four Against. The 46 retained creatures each have four options: A preserves the original concept; B/C/D are new designs. Excluded: Thistle Hedgehog (5), Silver Pike (17), Maple Mantis (47), Seedpod Cricket (49). The saved concept-vote snapshot records the source decisions and style notes, including stronger colours and elemental treatments. Snow Owl remains white.

There are 184 review options, including 138 newly generated designs. To limit compute, Built-in ImageGen produced 23 six-cell sheets, each covering three alternatives for two creatures. No separate per-option generation or regeneration was used. Exact prompts, relative source references, catalog crop coordinates and SHA-256 manifest are in `assets/enemy-finals/`. Draft review art is not approved production art.

## Decision rules

Only Artus and Juna have rating controls, each with 1–5 scores and personal notes. This is a shared-device family review, not authenticated accounts.

- Artus must rate all four options before a decision is shown.
- If every Artus rating is below 3, the enemy is excluded.
- A unique highest Artus rating of at least 3 selects that option.
- Equal highest ratings express uncertainty. Juna chooses only among those tied options, using her highest score. Missing Juna ratings or another tie remain unresolved. The same rule handles a tie across more than two options.
- Selection records an artwork preference only; adding an enemy to the game requires later work.

Votes save in this browser under a new review-specific key. They do not sync across devices. Download and restore carry both reviewers’ scores, notes and decision summaries. Restore validates the review ID, complete roster, people and scores before replacing only this review. Original concept votes, family review votes and learner saves are separate.

## Verification

Eight focused automated tests pass: partial ratings, Artus priority, threshold, Juna tiebreak, unresolved ties, validation and all 184 catalog assignments. Browser checks at 1180×820 and 390×844 verify ratings, tiebreak, exclusion despite a high Juna score, reload persistence, notes, clearing test entries, navigation and artwork enlargement. The owl and tall heron framing were inspected. All 23 generated sheets were visually inspected and individually cropped in the catalog.

Deployed and verified through [PR #152](https://github.com/Ikarus-eth/Blitzword_app/pull/152) and [successful Pages run 38037241705](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38037241705). All 31 live review files, including all 23 sheets, match the release hashes in [FINAL_LOOK_DEPLOYMENT.json](FINAL_LOOK_DEPLOYMENT.json). The live page loaded successfully in the browser. The complete regression suite also passes: 346 unit tests and 113 UI flow groups.
