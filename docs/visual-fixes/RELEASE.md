# Reading controls, friends and ate — 12 October 2026

Deployed and verified. [PR #188](https://github.com/Ikarus-eth/Blitzword_app/pull/188) and [test correction #189](https://github.com/Ikarus-eth/Blitzword_app/pull/189) merged. [Pages run 38205545392](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38205545392) succeeded. All 12 checked live files match the tested release ([hash evidence](DEPLOYMENT.json)). Live browser playback requested `word-fal-0021.mp3`, completed, and used no speech fallback.

The initial Pages attempt stopped on an existing pairing test's fixed 20 ms wait. The follow-up changes only that test to await the sync acknowledgement with a bounded timeout; the complete CI suite then passed.

414 unit/backend tests, 123 UI flow groups and all six browser viewport checks pass.

The parent's screenshot showed a wrapped “In a bread basket” answer escaping its button and nine quest labels colliding. They also reported a broken friend chooser, undersized allies when a shield friend joins, and the pronunciation of “ate”.

- Answer buttons explicitly size to wrapped content. Narrow map reading panels use one column; wider panels can retain two. Safari text sizing remains at the authored size during rotation.
- Full quest trackers wrap complete labels into readable rows. The compact battle tracker retains its eight/nine unlabelled bars. Encounter spacing accommodates the additional row.
- Friend selection uses scrollable, minimum-height cards with nonshrinking illustrations. Creature Book columns also respect a readable minimum width.
- With a shield friend present, the hero and regular companion keep their normal widths; Pip and the shield friend are enlarged. Animals stand at staggered depths on the child's side. Short landscape and portrait layouts have separate positions.
- Standalone “ate” now reuses the existing “eight” MP3 (`word-fal-0021.mp3`) for /eɪt/. The original paid receipt and MP3 remain historical references; the manifest points to the replacement. Device speech uses “eight” for standalone ate only. Written text and sentence narration are unchanged. No new paid audio was generated.

No save schema, learning, shield earning, damage, curriculum or artwork changes. Shared Atlas styles and audio review entry points receive cache-version updates.

## Verification

`tests/visual-regressions-browser.cjs` exercises the actual bread-basket answer (selected and enlarged to 30px), an earned shield chooser with multiple rows, four battle allies and the nine-step encounter. It asserts rendered text bounds and minimum artwork/ally dimensions at 1024×768, 1194×834, 1366×1024, 768×1024, 390×844 and 844×390 in isolated Chrome saves. Screenshots are inspected separately. Physical iPad/Safari and on-device listening remain unverified.

Audio regression checks cover the new manifest mapping, capitalization/punctuation, correction assembly and fallback without changing sentence text. Historical batch-integrity checks explicitly allow only this documented replacement.
