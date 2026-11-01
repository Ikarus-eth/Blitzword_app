# Playing a finished quest again no longer locks the trail — 1 November 2026

The parent reported that the child had finished The Falcon’s Wind Tower but now had to do it again before he could go on.

## Cause

Tapping a finished quest card ("Treasure found · play again") starts a full nine-task replay. Until this release, any quest in progress, including such a replay, disabled every other quest card ("Your current mission is saved"). The Ibex and the Moon Steps needs both The Marmot’s Missing Stores and the Wind Tower, so a Wind Tower replay blocked the Stores, and with them the rest of the Sky Stars campaign, until all nine replay tasks were won again. The Wind Tower treasure itself was never lost; `completedAt` stays set.

The child's save could not be read from this session, so the replay is the likely cause, not a confirmed one. Two other explanations would look the same to a parent: a first attempt still in its map search, or a Home Screen app whose storage differs from the Safari tab where the quest was finished.

## Change

- A replay of a quest whose treasure is already earned can be left for any open quest, unless a reading fight is running at that moment. The replay is then discarded; the treasure, stamps, XP and learning evidence stay.
- A first attempt (no treasure yet) still has to be finished or retried before another quest starts, as before.
- The hub labels a replay: "Keep playing again: …" on the resume button and "Treasure found · playing again · N steps left" on its card.

Code: `adventure-core.js` (`leavableReplay`, `blocking`, `begin`), `adventure-ui.js` hub cards and resume label. No save-version change. Build `quest-replay-20261101-r1`.

## Verification

A new unit test replays the Wind Tower, checks that the Stores open, that a live fight holds the replay, that leaving keeps the gold star piece, that the Moon Steps open after the Stores, and that a first attempt still blocks. A new UI-flow group checks the hub during a replay: the Stores card is enabled, the Moon Steps stay locked, and tapping the Stores starts that quest. Full suite: 447 unit/backend tests and 127 UI-flow groups pass. Physical iPad is not verified.
