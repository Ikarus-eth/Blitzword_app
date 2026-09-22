# BlitzWord

Multiplication bonus: after each three consecutive reading wins, the defeated enemy offers a 60-second 1–10 times-table challenge. Saved PR, a target of PR − 2 (minimum 1), 1 XP per correct answer, and separately tracked active multiplication time are included. See [challenge behavior and tests](docs/MULTIPLICATION_CHALLENGE.md).

An iPad-first English reading game. Play the current web build at https://ikarus-eth.github.io/Blitzword_app/.

## Current playable slice

Setup and hero selection lead to an optional guided battle or the existing adaptive reading check. Returning players can continue their saved reading check or campaign without repeating setup. Campaign challenges aim for seven active minutes, then stop at an answer boundary. Finishing early is allowed; an unfinished fight continues in the next challenge.

The playable chapter has 30 reviewed Core 200 words across five map locations, with eight illustrated teaching scenes and five rotating enemy types. Completing the story opens continued review. Repeated correct independent answers keep earning XP; there is no daily play limit. Pip’s first growth requires 250 XP, 250 confirmed active practice minutes and at least 14 elapsed days since practice began.

Home → Parents opens the parent dashboard behind an arithmetic gate. Time is confirmed by meaningful game actions. Thirty seconds without a game action auto-pauses and discards unconfirmed time; menus, results, background tabs and device sleep do not count. Older waiting-inclusive totals remain separately labelled. See `docs/ACTIVE_PLAY_RELEASE.md` for exact timing behavior and limitations.

Progress stays on the device. Every accepted response, active question, health change, teaching return, assessment answer and checkpoint is saved. Existing v1 records migrate in place with a retained backup. The app pauses on backgrounding and reports storage failures instead of claiming unsaved progress was saved. Another open tab cannot silently overwrite a newer save.

This build has no remote analytics, native iOS package, purchases, or guaranteed offline asset cache. Narration uses the browser's English speech voice. Word-boundary events control the spoken-word emphasis when the voice supports them; the target remains highlighted and underlined otherwise.

## Run and test

Serve this directory with any static HTTP server. No build step or package installation is required.

```
python3 -m http.server 8000
npm ci --ignore-scripts
npm test
```

GitHub Pages deploys `main` after the script and regression checks pass. Use task branches and pull requests. The previous main commit is the rollback point; never reset learner data to roll back artwork or gameplay.

See `docs/BLITZWORD_PRODUCT_SPEC.md` for the larger approved product direction and `docs/TEACHING_SLICE.md` for this slice's content review and asset provenance.
