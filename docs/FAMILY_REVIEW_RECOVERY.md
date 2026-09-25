# Family art review recovery — 25 September 2026

The user approved the Thornling preview, supplied the names Artus, Juna, Johanna and Ikarus, and requested the rest of the dashboard using recovered files only, without recreating artwork.

Review: https://ikarus-eth.github.io/Blitzword_app/assets/family-review/

Build: `family-review-recovered-20260925-r2`.

## Available and missing

The dashboard has 26 rounds: 20 enemy families and six playable hero appearances. Each has one current design and five alternative slots. All 26 current designs and the five existing Thornling alternatives are available, for 31 reviewable images. The other 125 alternatives could not be recovered: 95 for the other 19 enemies and 30 for the six heroes. `assets/family-review/missing-images.json` gives the exact per-entity list; the page exposes the same list.

No image files were generated, recreated, replaced or added in this update. Thornling uses the six images already deployed by PR #97. Other current designs display clipped views of the existing selected enemy lineup and production hero atlas. Hero polygons match the production renderer and exclude neighboring equipment. Older concept sheets and body-part atlases are not passed off as alternatives from the missing batch.

## Behavior and saved feedback

- Four reviewer names default to Artus, Juna, Johanna and Ikarus.
- Independent 1–5 ratings for each available image, one comment per enemy/hero, previous/next and grouped roster selection.
- Missing alternatives show explicit empty cards with no rating controls. Progress uses the 31 available images (124 possible ratings), excluding missing images.
- New storage key: `blitzword-family-art-review-v2`. The previous Thornling key is read once when no new review exists, and retained untouched. Existing named reviewers are matched to the requested order; unmatched generic slots retain their order. Scores and the Thornling comment migrate together.
- JSON download includes all rounds, names, scores, comments and the missing-image list. This remains a shared-device review with manual export, not cloud synchronization.
- No game code or learner save is loaded or modified.

Validation is recorded in `assets/family-review/verification.json`. The earlier preview image and provenance remain historical records of PR #97.

## Bulk import follow-up

The [image import workflow](FAMILY_REVIEW_IMPORTS.md) adds device-local originals, resumable batches and full backups. The 31/125 counts above describe the published source roster; the dashboard updates its available/missing counts as local images are assigned.
