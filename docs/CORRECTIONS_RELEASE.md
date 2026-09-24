# Contrast corrections and adaptive teaching — point 4

Deployed and verified on 24 September 2026. Build: `contrast-teaching-20260924-r1`.

## Behavior

- A wrong choice appears above the target on the existing parchment. Equal-width letter columns align both rows; only differing letters are highlighted and underlined. Insertions/deletions leave a dashed empty slot. Adjacent swaps keep both differing letters visible. Screen readers receive each complete word rather than isolated letters.
- The comparison says “You chose rack. The word is rock.” Replay repeats both words with no further damage. A shield prefix finishes first; an attack and its delayed health display still wait for the correction narration. Continue/Pause/Home and replay cancel pending reactions.
- Continue follows `q.needsTeaching`: a picture card for a new question, two or more consecutive independent misses, or a missed due review; otherwise the next item. The old extra condition “no independent correct answer yet” is removed to match the approved three triggers.
- “?” displays and narrates only the target. It uses the same teaching triggers without incrementing independent misses, consuming a shield, removing a heart, earning XP or becoming mastery evidence. Interrupted/supported wrong answers use the same rule. Supported correct answers stay supported successes.
- Every correction still records support and leaves two intervening items before the word is eligible again. Both routes handle a final-heart defeat.

## Saves and narration

No storage keys or save format change. A saved question keeps its identity, options, first response and teaching decision. Reopening a correction adds no observation, damage or teaching event; a saved teaching card resumes normally. There is no migration reset or rollback of learner progress.

The combined contrast wording uses the established device-speech fallback; no new audio is generated or claimed to be listening-approved. The approved shield prefix and target-only “The word was X.” help recordings remain available. All other existing narration and artwork remain intact.

## Verification

- `npm ci --ignore-scripts && npm test` on Node 22.23.3: **176 core tests and 57 UI-flow groups pass**. Syntax checks and `git diff --check` pass.
- Fourteen new core tests cover the teaching decision matrix, help safety, supported successes, saved decisions, two-item recheck spacing and letter alignment. The new tests first exposed seven failures on the old code; all pass with the implementation. Alignment also preserves all 200 targets and their reviewed candidate pools.
- Four new UI-flow groups cover known/new/repeated/review corrections and help, saved reopen, guarded double/stale taps, accessible whole words, exact comparison narration, replay without damage, cancellation and final-heart defeat.
- One existing shield-narration expectation changes deliberately from target-only narration to the approved chosen-and-target phrase. Existing shield prefix ordering and delayed impact checks remain. Other existing expectations are unchanged.
- Eleven isolated Chromium 154.0.8037.57 cases at 1180×820, 820×1180, 390×844 and 844×390 verify stacked aligned columns, substitutions, missing/extra letters, swaps, long words, accessible target/chosen names, shield labels clear of the parchment, visible controls, replay, saved correction reopening and both teaching depths. All have zero page errors. Tablet portrait/landscape and phone captures were visually inspected. These checks use synthetic saves, never learner data.

Physical iPad, Safari/WebKit and listening checks remain open. On the iPad, check the highlighted differences and whole-word narration, an occasional familiar miss continuing without a card, picture teaching for a new/repeated/review miss, and “?” preserving hearts. Leave and reopen the page to check a saved correction; immediate Chromium reload retains its separately tracked known issue.

## Deployment

Merged in [PR #64](https://github.com/Ikarus-eth/Blitzword_app/pull/64) as `8e4c00220607f677a27a7601c6370659fbd068b0`. [Pages run #74](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35967455461) succeeded, including tests, artifact upload and deployment. At 07:03 UTC on 24 September 2026, `main` was still that merge and the live build marker was `contrast-teaching-20260924-r1`. Cache-busted downloads of all four changed runtime files matched `git show <merge>:<file>` byte for byte.

| File | Bytes | SHA-256 |
|---|---:|---|
| `index.html` | 30,041 | `3c82e1d41aba2b28a0df72818f31ff64e85f19a7e7ef22fc65612abf45f47251` |
| `game-core.js` | 54,741 | `3c31ddadaeed8f16623ce6bc6aaa20ca1d39410c73bd75a11ad8db48aea8e0b6` |
| `app.js` | 78,478 | `1e116b108b8161acb036716de8cde0443bece11f5a84b9daf879a256b451fca9` |
| `styles.css` | 93,417 | `dffc336e7883b2f04ce407276571b6e9dd2994964671cc707f93a153453f9324` |

[Machine-readable verification](CORRECTIONS_DEPLOYMENT.json) records the exact source SHA, workflow steps, hashes and time. Current `main` was fetched and merged into the task branch immediately before the PR merge; there were no intervening changes. Verification proves delivery, not physical iPad or listening behavior.
