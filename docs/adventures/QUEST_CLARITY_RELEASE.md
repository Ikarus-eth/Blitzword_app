# Quest clarity and animal teammates — 4 October 2026

Build: `quest-clarity-20261004-r1`. Status: deployed and verified.

This revision follows the parent’s playtest: the introductions were hard to read, lives felt too generous, quest length and book symbols were unclear, and the child wanted collected animals on his side.

## What changed

- Twelve quest introductions are now 11–16 words in short sentences. Campaign introductions, goals, endings and transition prompts are shorter too. All 48 riddle objects are identical to the previous release; encounter order, enemy health, unlocks and curriculum also stay intact.
- New quests start with four hearts, carried through all four fights and all clues. At zero hearts, **Rest and retry · 4 hearts** restarts the current fight and keeps earlier clues solved. Each new quest starts full. Older active or parked quests retain their existing saved battle health and maximum when migrated.
- A quest has eight visible steps: Fight, Clue, Fight, Clue, Fight, Clue, Fight, Clue. A won fight adds one; solving its clue adds one. Losses do not advance the count. The last solved clue shows 8/8 before claiming the treasure. Intro, clue, encounter and result screens show the trail; fights show a compact counter and bars. The hub’s resume button shows steps left.
- The Creature Book explains **◆ Met: meet this friend**, **✦ Clue: solve its clue**, **★ Star: win its big fight**. Tiles have text labels as well as symbols, and details have an earned/not-yet checklist. Existing discoveries and stamps keep their meaning.
- **Choose for my team** selects any already-met animal. It appears beside the mage and Pip during creature-quest fights, plus quest, camp and result screens. The card explains its purpose: it can stop one hit per quest. Its name appears in the saved-heart feedback and narration. The chosen creature’s approved complete artwork is reused, facing the enemy; no new images or API spend.

## Fairness and saves

Protection applies only to an otherwise damaging unaided reading mistake in a creature quest. It is used before an earned shield, which stays available for a later miss. The answer still records an unaided incorrect response; no XP, success or enemy damage is invented. Help requests and practice turns cannot consume protection. One shared `companionHelpUsed` flag belongs to the quest, so switching animals, resting after defeat, leaving to Word trails or reopening cannot recharge it. Backup round-trips preserve the flag. A new quest resets it. The existing favourite field is reused; old selections remain.

Shared hearts, the quest flag, collection and progress are additive main-save fields. Existing active questions/choices, first riddle evidence, learner history and earned growth are preserved. Word trails keeps its existing health and encounter rules. Pip stays alongside the hero with his existing growth and assist behavior. Companions add no reading-phase animation.

The original roughly two-hour estimate covered the authored content, not a measured child session. Carrying four hearts across a quest can add retries. Actual revised duration and enjoyment need a child playtest; there is no minimum-time gate or demand for a continuous two-hour sitting.

## Verification

- Clean `npm ci --ignore-scripts` and `npm test`: 294 unit tests and 104 UI flow groups pass.
- New checks cover heart carryover across fights/clues, backup and context switches; older active/parked migration; one protection per quest; correct learning evidence and shield precedence; invalid/uncollected selections; unchanged Word trails health; defeat/retry; all eight progress states; visible team and book controls; saved feedback without replaying the block animation.
- Existing UI expectation intentionally renamed from **Invite to camp** to **Choose for my team** to test the new action.
- Whole-content comparison against main `53cf987bea9c14041775f782a55b338ddf45ba39`: 48 unchanged riddle objects. JSON SHA-256 `9db23e85d6ee1dd785e8ef5dc1e9011610930dbae30171246226465408662870`. No changes to `content.js` or the curriculum workbook.
- Browser review uses memory-only fixtures, never learner storage. 1024×768 landscape tablet, 768×1024 portrait tablet and 390×844 and 390×667 phone layouts checked: intro, chosen teammate, fight status, eight-step progress, collection legend/details, results and clue-to-next-fight transition. Hearts remained 2/4 while progress advanced from 1/8 to 2/8 and the next fight.
- Physical iPad/Safari, the child’s reading comfort, real session length and preference for the four-heart setting are unverified.

[Reviewed tablet battle](quest-clarity-tablet.jpg). See [current deployment status](../CURRENT_STATUS.md).

Deployed through [PR #123](https://github.com/Ikarus-eth/Blitzword_app/pull/123), commit `dfda09124d6ac11424695b0c9f6c7cf7f1262eb9`, and successful [Pages run 37166504244](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/37166504244). All nine changed runtime/review files match the tested source and the live build marker is correct. The memory-only live quest preview rendered its short introduction, 8-step trail, carried hearts and chosen teammate without console errors. [Live hashes](QUEST_CLARITY_DEPLOYMENT.json), [live preview screenshot](quest-clarity-live.jpg).
