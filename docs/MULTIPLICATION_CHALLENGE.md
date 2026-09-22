# Three-win multiplication challenge

After every third consecutive non-demo reading victory, the defeated enemy rises again for an optional multiplication challenge. A reading defeat resets the streak; a math result does not affect reading wins. Streaks and pending rounds survive Home, session boundaries and reloads.

- Facts use factors 1–10, shuffled in a 100-fact bag. Children type an answer using the on-screen keypad or keyboard.
- The round lasts 60 foreground, unpaused seconds. The timer is saved, never refilled on resume, and does not consume background or suspended-device time. Thirty seconds without a game action auto-pauses. This is a practice record, not a competition-grade anti-cheat timer.
- PR is the child's highest correct-answer count in a completed round, across all enemy types, on this browser/device. The first completed round establishes it, including zero.
- Each enemy's target is frozen at `max(1, PR - 2)` at invitation time. Without a PR, the introductory target is 1. Reaching the target early does not stop the timer.
- Each correct answer earns 1 XP, once. A mistake shows the correct product, earns no XP, and moves to a new fact. Math does not alter reading mastery, reading accuracy, hero health or secured story progress.
- The invitation may be skipped without losing the reading victory. Started rounds must complete their saved minute before recording a PR. Pausing or finishing a seven-minute session preserves the round.
- Multiplication uses its own confirmed-time ledger category on the parent dashboard. Both reading practice and multiplication count towards Pip's growth; demo/assessment do not. Idle intervals and unconfirmed time at the deadline are excluded. Growth still requires all three gates: 250 XP, 250 active practice minutes, and 14 elapsed days for Young Pip.

Verification: core tests cover streaks, demo exclusion, same-enemy revival, target snapshots, fact coverage, scoring/idempotence, exact deadline, record persistence and independent math reporting. DOM tests cover keypad feedback, skip, Home/reload, idle and hidden-tab pauses, result navigation and the parent ledger. The 60-minute reading simulation skips optional bonus invitations and remains playable through all 30 words, five areas and five enemy types.

Isolated visual review fixtures: `math-intro`, `math-play`, and `math-result`. They never read or write real learner saves.
