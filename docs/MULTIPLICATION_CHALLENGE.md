# Number-duel rules — current through 23 September 2026

After every third consecutive non-demo reading victory, the defeated enemy offers a number duel. A reading defeat resets the consecutive streak; a math result does not remove reading wins. The duel is also offered at each third chapter victory until one has been played, so reading losses cannot withhold a required chapter duel indefinitely. Streaks and pending rounds survive Home, session boundaries and reloads.

- Facts use factors 1–10, shuffled in a 100-fact bag. The child selects from multiple-choice answers; there is no parallel typed-answer or keypad mode.
- The round lasts 60 foreground, unpaused seconds. The timer is saved, never refilled on resume, and does not consume background or suspended-device time. Thirty seconds without a game action auto-pauses. This is a practice record, not a competition-grade anti-cheat timer.
- New rounds use net score: +1 per correct answer and −1 per wrong answer, including negative scores. PR is the highest completed net score on this browser/device. Historical PRs and scoring rules for already-started older rounds are preserved.
- Each enemy's target is frozen at `max(1, PR - 2)` at invitation time. Without a PR, the introductory target is 1. Reaching the target early does not stop the timer.
- Each correct answer earns 1 base XP, once, multiplied by 1.75 after the daily ten-active-minute bonus unlocks. A mistake shows the correct product and earns no XP; its score penalty does not remove earned XP. Math does not alter reading mastery, reading accuracy or hero health.
- The invitation may be postponed without losing the reading victory. A new chapter requires a completed duel, not necessarily a won duel, in addition to its reading objectives and ten-minute minimum. Started rounds must complete their saved minute before recording a PR. Pause/Home/reload preserve the round.
- Three consecutive reading wins followed by a won number duel earn one non-stacking shield. It absorbs the next damaging reading mistake; number-duel mistakes do not consume it. See [shield and defeat rules](CHOICES_SHIELD_RELEASE.md).
- Multiplication has its own confirmed-time ledger category on the parent dashboard and contributes eligible active time toward chapter pacing and the daily bonus. Idle intervals and unconfirmed time at the deadline are excluded. Growth depends only on cumulative XP at 3,000 / 8,900 / 13,400; there is no elapsed-day or active-minute evolution gate. See [XP rules](SUCCESS_XP_RELEASE.md).

Verification covers streaks, demo exclusion, target snapshots, fact coverage, net scoring/idempotence, saved choices, deadlines, PR persistence, shields and separate math reporting. UI flow checks cover multiple-choice feedback, postponement, Home/reload, idle/background pauses and result navigation. These checks do not establish physical iPad behavior or child enjoyment. See [current status](CURRENT_STATUS.md) for the release checkpoint.

Isolated visual review fixtures: `math-intro`, `math-play`, and `math-result`. They never read or write real learner saves.
