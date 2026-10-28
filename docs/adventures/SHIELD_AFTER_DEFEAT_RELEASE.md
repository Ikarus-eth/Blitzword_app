# Quest shields after a lost fight — 28 October 2026

The parent reported that the child no longer earned a shield in a creature quest he had lost several times.

## Cause

The approved rule of 11 October 2026 allowed two earned shields per quest and kept that count through defeats and retries. A child who earned both shields early in a quest, then lost, could never earn another on any retry. The meter also needed eight accurate answers in a row (or six quick ones), which a struggling child rarely reaches.

## Change

- A retry after a defeat restores the shield allowance: each attempt can earn up to two shields, still at most one per fight and one held at a time.
- After the first lost fight in a quest, a shield needs five accurate answers in a row, or four quick ones (normally eight or six). A miss still resets the run and help still pauses it. A new quest starts with the normal bar.
- The battle meter shows the current target ("4 / 5 accurate · 0 / 4 quick"). After a defeat, the shield popup says "After a lost fight, five accurate answers, or four quick ones, can call a friend."
- Unchanged: the team animal's once-per-quest block, chapter battle shields (three reading wins plus a won number duel), XP, hearts, learning evidence and saves. A quest already in progress keeps its count until its next retry; defeats before this release are not counted.

Code: `adventure-core.js` (`supportNeed`, `supportOpen`, defeat count in `retreat`, allowance reset in `retry`), `app.js` meter text, `adventure-ui.js` popup text. Build `shield-after-defeat-20261028-r1`.

## Verification

The previous unit test "two grants per quest survive defeat, retry and reload" asserted the old rule and was replaced on purpose. The new tests cover two grants per attempt, a legacy shield occupying the slot, three lost attempts each earning a shield after five accurate answers, four quick answers after a defeat, misses resetting the run and the normal bar in a fresh quest. A new UI-flow group checks the five-answer meter and the shield popup after a defeat. Full suite: 443 unit/backend tests and 126 UI-flow groups pass. Physical iPad is not verified.
