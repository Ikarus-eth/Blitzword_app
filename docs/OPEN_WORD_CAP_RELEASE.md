# Open-word cap — 28 October 2026

The parent shared the learner backup of 28 October 2026 and reported too many unknown open words and a main game that is too difficult. The backup itself is not committed.

## What the backup showed

- 373 of 1,000 words introduced; the Parents dashboard counted 145 as Learning (introduced, not secured), 229 secured or kept.
- 143 of the open words each needed just one more spaced correct answer in another battle to be secured.
- The old limit only counted words with fewer than two practice successes (3 words at the time). Once a word reached two successes it left that limit and a new word could open, so open words piled up. They then returned only as due reviews, one turn in three.
- Recent accuracy: 10 of the last 20 checks unaided (support mode). Over the last 300 answers: new words 15/36, repair 36/75, practice 45/75, reviews 86/97. Flash time 0.95 s.

## Change

- At most 15 open words. While 15 or more words are open, battles and quest fights open no new word; the spacing fallback also stops opening words.
- While capped, turns cycle through: a due review (as before, one turn in three), finishing an open word, and an easier secured word. Open words that the next correct answer can secure come first, then the earliest in the curriculum.
- New words return automatically once fewer than 15 are open. The existing adaptive limits (2/4/6 words with fewer than two practice successes) still apply on top.
- The Parents challenge line says whether new words are paused and how many words are open.
- Unchanged: curriculum order, securing and retention rules, XP, help and teaching, reading speed, quests and learner saves. No save migration is needed; the cap is computed from existing word records.

A deterministic replay of four days of play from the backup (crude success rates by word type) brought open words from 144 to 15 by day three, introducing no new words meanwhile, with accuracy rising from 65% to 70% in that model. This is a simulation, not observed play.

## Verification

Changed tests, on purpose: the long single-battle scheduling test now expects new words to stop at the cap (a single battle cannot secure words); learning beyond the next field moved to a new multi-battle test. Completed-core and all-known fixtures now mark words as secured. The seven-hour engagement test expects at least 500 words instead of all 1,000. A new test covers the capped turn mix and the return of new words below the cap. Full suite: 445 unit/backend tests and 126 UI-flow groups pass. Physical iPad is not verified.
