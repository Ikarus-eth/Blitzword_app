# BlitzWord

An iPad-first English reading game. Play the current web build at https://ikarus-eth.github.io/Blitzword_app/.

## Current playable slice

Setup and hero selection lead to an optional guided battle or the existing adaptive reading check. Returning players can continue their saved reading check or campaign without repeating setup. Campaign challenges aim for seven active minutes, then stop at an answer boundary. Finishing early is allowed; an unfinished fight continues in the next challenge.

The first practice slice contains six reviewed targets: sat, rock, tree, green, fox and cave. Four reviewed Pip illustrations support meaning practice. The full approximately 30-word free chapter, dragon growth and larger enemy library remain future work.

Progress stays on the device. Every accepted response, active question, health change, teaching return, assessment answer and checkpoint is saved. Existing v1 records migrate in place with a retained backup. The app pauses on backgrounding and reports storage failures instead of claiming unsaved progress was saved. Another open tab cannot silently overwrite a newer save.

This build has no remote analytics, native iOS package, purchases, or guaranteed offline asset cache. Narration uses the browser's English speech voice. Word-boundary events control the spoken-word emphasis when the voice supports them; the target remains highlighted and underlined otherwise.

## Run and test

Serve this directory with any static HTTP server. No build step or package installation is required.

```
python3 -m http.server 8000
node --test tests/*.test.js
```

GitHub Pages deploys `main` after the script and regression checks pass. Use task branches and pull requests. The previous main commit is the rollback point; never reset learner data to roll back artwork or gameplay.

See `docs/BLITZWORD_PRODUCT_SPEC.md` for the larger approved product direction and `docs/TEACHING_SLICE.md` for this slice's content review and asset provenance.
