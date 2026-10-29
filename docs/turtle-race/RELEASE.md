# Turtle Race mini-games — 24 October 2026

The user asked for a short reading race: Pip against a turtle, about 60 seconds, read a simple sentence then tap an answer, with three different quiz-and-score mechanics so the child can choose and the parent can see which one engages him. One may be a fight in which slow or wrong answers cost a life and fast right answers cost the enemy a point. Images and voice-over were to use minimal compute.

## What it is

A standalone page at `assets/turtle-race/` (live: https://ikarus-eth.github.io/Blitzword_app/assets/turtle-race/). It has no setup or unlock requirement. Since 24 October 2026 the game's home hub has a Turtle race button and the race picker has a Home link back. It never reads or writes the learner save (`blitzword_state_v1`); its own stats live under `blitzword_turtle_race_v1`.

| Race | Quiz | Scoring | 60-second ending |
|---|---|---|---|
| Turtle Dash | Sentence stays visible; a who/what/where question with three one-word answers | Right = Pip hops one step forward; wrong = one step back (never behind the start) | The turtle crosses the line at exactly 60 s. Pip wins if he reaches the line first |
| Flash Dash | Sentence flashes (starts at 3.0 s), then hides; pick the sentence you read from three that differ by one word | Right within 3 s of the choices = Blitz boost, two steps; slower right = one step; wrong = one step back | Same turtle |
| Shell Duel (fight) | Sentence plus a yes/no question with a visible per-question timer (starts at 7 s) | Right before the timer ends = turtle loses a shell; wrong or too slow = Pip loses one of three hearts | Win at zero shells; lose at zero hearts or when time runs out |

After a wrong answer the correct choice is highlighted and the existing recording of the sentence plays once. The clock pauses when the page is hidden.

Difficulty: superseded on 25 October 2026 by five chosen turtles per race (below). The original automatic adaptation is removed.

## Content

51 sentences from the Core 200 teaching set, each already recorded (Tom), with one question, the answer word, two wrong words and a yes and a no question. Source: `scripts/turtle-race-items.json`; built into `items.js` by `scripts/build-turtle-race.cjs`, which validates every item and checks each recording exists. Choices are text only; no artwork appears with answers. Questions are not narrated, so the child reads them.

## Parent view

"For parents" on the race-picker page shows, per race: started, finished, left early, won, percent right, average answer time, last played, and per race the open level plus wins and races per level. Started minus finished is the clearest disengagement signal. Stats stay on the device and are not part of progress sharing.

## Compute used

- Images: none generated. `pip.webp` (approved Small Pip B, `assets/battle-motion/pip-friendly-b.png`) and `turtle.webp` (approved Brook Turtle cutout, `assets/enemies/approved-20261010/atlas-03.png`) are downscaled crops. The track, finish line, duel arena, fireball and wave are CSS.
- Sentence audio: all 51 reuse existing recordings.
- Voice-over: 18 George lines (titles, how-to-play, go, boost, too slow, win/lose), 638 characters in two ElevenLabs batches (`eleven_multilingual_v2`, voice `JBFqnCBsd6RMkjVDRZzb`, approved settings). Account usage reported 84,230 / 121,026 characters before and after (the provider's counter had not yet updated). Generation ran from the generation-only branch `claude/turtle-race-narration-20261024` (Actions run 40079494410); the paid artifact was retrieved by a second, provider-free run (40079624501) because the session could not reach Actions artifact storage. No paid retries. Receipts: `docs/narration-turtle-race/receipts/`, summary: `NARRATION_GENERATION.json`. That branch must not be merged.
- Sound effects are synthesized in the browser.

## Verification

- 11 new unit tests (`tests/turtle-race.test.js`): item validity and recordings, one-word flash swaps, yes/no balance, each scoring rule, the 60-second turtle, adaptation and limits, stats and quits, deck coverage, voice receipts, and no access to the main save. Full suite: 430 unit/backend tests and all UI-flow groups pass.
- Headless Chromium plays all three races to a result at 1194×834, 834×1194 and 390×844 with no page errors; separate runs cover the turtle winning an idle race, duel timeouts costing hearts, and leaving mid-race counting as "left early". All 53 audio files decode in the browser.
- Not verified: physical iPad and Safari audio, touch feel, and whether the timings suit the child. Nobody has listened to the new George lines yet.

## Deployment

PR #198 merged as `c8649ce7700f904aeba371023d54727eeda0695f`. Pages run 40081466652 passed tests and deployed. Verification run 40081677005 (branch `claude/turtle-race-live-check`, not for merging) fetched all nine live turtle-race page, art and voice files and found each identical to the merged source.

## Five turtles per race — 25 October 2026

The user asked for difficulty levels he can move up through slowly, so he gets some wins first, in all three games. Each race now has five fixed turtles: Sleepy, Little, Brave, Speedy and Champion. Only Sleepy is open at first. Beating the hardest open turtle opens the next one, with a "New turtle unlocked" banner and fanfare. The child chooses which open turtle to race on the intro screen; the game never moves him up by itself. After a win the result offers "Try the [next turtle]" next to "Same turtle again"; after a loss above level 1 it offers the easier turtle next to "Try again". The race picker shows one star per turtle beaten.

| Level | Turtle Dash | Flash Dash | Shell Duel | Sentences |
|---|---|---|---|---|
| 1 Sleepy | 4 steps, no slipping back | 5 steps, 5 s flash, boost within 5 s, no slipping back | 3 shells, 12 s per question, 5 hearts | up to 5 words (28) |
| 2 Little | 6 steps, no slipping back | 7 steps, 4 s flash, boost within 4 s, no slipping back | 4 shells, 10 s, 4 hearts | up to 5 words |
| 3 Brave | 8 steps | 9 steps, 3 s flash, boost within 3 s | 5 shells, 8 s, 3 hearts | up to 6 words (47) |
| 4 Speedy | 10 steps | 11 steps, 2.5 s flash, boost within 3 s | 7 shells, 6.5 s, 3 hearts | all 51 |
| 5 Champion | 12 steps | 13 steps, 2 s flash, boost within 2.5 s | 9 shells, 5 s, 3 hearts | all 51 |

Settings stay fixed within a run. Earlier stats are kept, but everyone starts at Sleepy Turtle because the old automatic difficulty does not map onto the new levels. No new images or recordings: turtle names are read, not narrated.

Verification: 13 Turtle Race unit tests (level ordering, sentence pools, per-level scoring, unlock and choice rules, old-profile repair). Full suite: 432 unit/backend tests and 124 UI-flow groups pass. Headless Chromium loads a yesterday-format profile without errors. At 1194×834, 834×1194 and 390×844 it wins Sleepy, unlocks and races Little, and unlocks Brave in all three races. It also checks that a loss offers the easier turtle. The intro fits without scrolling at 1194×834, 1024×768 and 834×1194; phones scroll. Physical iPad is not verified.

## Race time on the Parents dashboard — 25 October 2026

The user asked for race time to count in active reading time on the main Parents dashboard. The race page now records active race time per local day under `time.days` in its own save. The clock runs only while a race is on screen; the countdown, results and hidden-page time are excluded. Time is credited as it happens, so leaving or closing mid-race still counts. Saves from before this change are backfilled from finished races in their history (at most 60). The main dashboard adds race time to "Active play today" and "Total active play". It also has a "Turtle race reading time" card and a "Turtle race" column under Recent days. Race time does not count towards the daily XP boost, and the dashboard only reads the race save. An unreadable race save shows "Unreadable" and is left unchanged. Main build `race-time-20261025-r1`. Tests: 433 unit/backend tests and 125 UI-flow groups pass; a headless browser journey covers backfill, a quit mid-race and the dashboard totals.

## Mistake pause, 15 turtles and expert sentences — 25 October 2026

The user asked for three things. First, a mistake should pause the race so the child sees it. Second, ten more levels, including expert levels tough for a 10-year-old, where harder levels answer in different words that describe the same thing. Third, during the work: make a lost heart clearly visible.

Mistake pause: a wrong or slow answer stops the race clock, the turtle and the duel timer. The wrong choice turns red and the right one green. The key word in the sentence is highlighted, and a panel explains the answer; in Hard and Expert it gives "The sentence says X. In other words: Y." Recorded core sentences play once. The child taps "Got it ▶" (enabled after one second) to continue. Time spent reading the correction counts as race reading time, up to one minute per mistake.

Visible heart loss (Shell Duel): the lost heart breaks with a large animation, the arena flashes red, "−1 ♥" floats up and a low sound plays. Lost hearts stay as 💔 beside a "N left" count, pinned top-left of the arena, and the pause panel says "You lost a heart. N hearts left."

Fifteen turtles per race in three tiers (River, Forest, Mountain, Storm and Thunder for Hard; Crystal, Shadow, Fire, Ancient and Legend for Expert):

| Tier | Sentences | Turtle Dash | Flash Dash | Shell Duel |
|---|---|---|---|---|
| Easy 1–5 | Core 200 (unchanged) | as before | as before | as before |
| Hard 6–10 | the 51 core sentences, answers in other words | 6–10 steps | 7–11 steps, flash 4 → 2.2 s | 5–9 shells, 9 → 6 s, 3 hearts |
| Expert 11–15 | 36 new 9–15-word sentences with harder vocabulary, answers in other words | 6–10 steps | 7–11 steps, flash 6 → 3.5 s | 5–9 shells, 12 → 8 s, 3 hearts |

"Other words": Turtle Dash offers three descriptions, such as "on a big stone" for rock or "kept watch over it" for guarded. Flash Dash asks "Which one means the same?" across three reworded sentences. Shell Duel asks reworded yes/no questions. The build rejects any right answer, matching sentence or yes-question that reuses the key word. Content: `scripts/turtle-race-paraphrase.json` (51 core entries) and `scripts/turtle-race-expert.json` (36 expert sentences), merged by `scripts/build-turtle-race.cjs`. Expert sentences have no recordings; their pause panel is text only. No images or audio were generated.

Unlocking still goes one win at a time; beating Champion opens River Turtle. Existing progress is kept. For an older player, "For parents" has an "Open all turtles" button. All races share one device-local profile, so two children on one iPad share stars and stats.

Layout: a 5×3 tile picker with a detail line replaces the five-row list. Expert questions get a shorter track and smaller option text so all choices fit at 1194×834, 1024×768, 834×1194 and 390×844. Centred screens no longer hide their top when content is taller than the screen.

Verification: 15 Turtle Race unit tests (tiers, pools, other-words rules and key-word rejection, unlock across tiers, open-all, profile repair). Full suite: 434 unit/backend tests and 125 UI-flow groups pass. Headless Chromium at three sizes covers the pause (the clock stays at 60 for three seconds, then resumes), duel timeouts and open-all. It also makes mistakes at Expert level 13 in all three races and shows the heart loss sequence. Physical iPad is not verified.

## Main race back to first-words rules; expert race split out — 26 October 2026

The user reported that the child managed turtles 1–5 but found the other-words levels far too difficult. The user asked for the first five levels again with different words, and for levels 6–15 to become a standalone game with its own link.

Main race (`assets/turtle-race/`, linked from the BlitzWord home): ten turtles per race. Turtles 1–5 are unchanged. Turtles 6–10 (River, Forest, Mountain, Storm, Thunder) repeat the exact rules of 1–5 with a second set of 50 recorded sentences (`scripts/turtle-race-items-2.json`). At least 40 of those have key words not used in the first set, such as sun, whale, lemon, kite, thunder, pencil and doctor. Sentence length is up to six words for turtles 6–7, seven for 8 and eight for 9–10. Answers use the words in the sentence; there are no other-words levels. Saves from before this change keep turtles 1–5. Progress on the old levels 6–15 is dropped, so a Champion win opens River Turtle with the new words. Race time still counts on the BlitzWord Parents dashboard.

Expert race (`assets/turtle-race-expert/`, https://ikarus-eth.github.io/Blitzword_app/assets/turtle-race-expert/): the former levels 6–15 as ten turtles. Turtles 1–5 answer short sentences in other words; turtles 6–10 are the 36 long expert sentences. It shares the code, pictures and recordings of the main race, but runs as its own edition with its own save (`blitzword_turtle_race_expert_v1`), stars, stats, unlocks and "Open all turtles" button. It has no link into BlitzWord, its time does not count on the BlitzWord dashboard, and it does not auto-play the how-to narration. Mistake panels give more room so "Got it" stays on screen.

Verification: 17 Turtle Race unit tests (both editions, rule equality of 1–5 and 6–10, word pools, migration, separate saves and the expert page wiring). Full suite: 436 unit/backend tests and 125 UI-flow groups pass. Headless Chromium at 1194×834, 834×1194 and 390×844 covers the main-race migration, a new-words turtle, a mistake, a win that unlocks Forest Turtle, the expert page pictures and edition, an other-words question and mistake, and open-all. It also confirms that the BlitzWord save and the main race save are unchanged by expert play. "Got it" fits on screen at four sizes. Physical iPad is not verified.

## Four word sets in the main race — 26 October 2026

The user asked for at least 60 minutes of race content the child can master. He masters turtle 5 of a set after several attempts, once he knows that set's words. The main race now has twenty turtles per race in four word sets. Each set repeats the exact five-turtle rules of turtles 1–5 with about 50 recorded sentences:

| Set | Turtles | Sentences | Examples of new words |
|---|---|---|---|
| First words | 1–5 (Sleepy → Champion) | 51 (`turtle-race-items.json`) | already mastered |
| New words | 6–10 (River → Thunder) | 50 (`turtle-race-items-2.json`) | sun, whale, lemon, kite, doctor |
| More words | 11–15 (Sand → Star) | 50 (`turtle-race-items-3.json`) | forest, coin, spell, desk, ground |
| Super words | 16–20 (Pearl → Ocean) | 50 (`turtle-race-items-4.json`) | school, birthday, elephant, homework, lightning |

All 200 sentences reuse existing recordings, so no audio or images were generated. Sentences follow curriculum order: sets 3–4 draw on later Core 200 and early 200–400 words, with up to 7–8 words for the higher turtles. Answers use the words in the sentence; there are no other-words levels in the main race.

Estimated content (an inference, not observed). A finished race attempt takes about 75 s, counting countdown, result screen and mistake pauses. Suppose a set takes 1 try each for turtles 1–3, 2 for turtle 4 and 3 for turtle 5. That is 8 attempts per race and 24 across the three races, about 30 minutes per set. The three sets he has not mastered then give about 90 minutes. If he wins every turtle at the first try, it is about 45 races, roughly 40–50 minutes. Losses and replays push it above 2 hours.

Words mastered: the race now records answers per sentence. A sentence counts as mastered after two right answers with the latest one right. Each set row on the turtle picker shows "mastered / total", and "For parents" lists all sets. Existing saves keep their turtles; the expert race is unchanged apart from sharing the release.

Verification: 18 Turtle Race unit tests (all four sets repeat the 1–5 rules, pools, no duplicate sentences, mastery rules, migration, both editions). Full suite: 437 unit/backend tests and 125 UI-flow groups pass. Headless Chromium plays turtle 16 at three sizes, checks the unlock of Coral Turtle and checks that the mastery counts update. Physical iPad is not verified.

## Sentence milestones with 7- and 30-day retention — 26 October 2026

The user asked that "mastered" follow the BlitzWord parent-dashboard concept of retention after 7 and 30 days. This replaces the earlier "two right answers, latest right" rule. Each race sentence now has the dashboard's word states:

- New: never answered in a race.
- Learning: answered, without a higher milestone.
- Secured: three right answers at least three questions apart, across at least two different races. This mirrors the dashboard's "three separated independent successes across two battles".
- Kept after 7 days / Kept after 30 days: a right answer at least 7 / 30 full days after that sentence was last answered.

Each sentence shows its highest milestone, and a later miss never erases it. Race answers are unaided; the mistake panel comes after the answer.

Retention checks: secured sentences that have not been answered for 7 days, and kept-7 sentences not answered for 30 days, come back mixed into any race in the same edition. They take at most one in four questions, oldest first, with a gold frame and "Remember this one?". Without this, earlier word sets would stop appearing once the child moves on.

Display: each word-set row on the turtle picker shows "secured or better / total ✓" and the number kept after 7 days or more. "For parents" shows a New / Learning / Secured / Kept after 7 days / Kept after 30 days table per set and how many checks are due. Counts from the previous release are kept, but no milestones are invented from them; milestones start with today's answers.

Verification: 18 Turtle Race unit tests, including the separation rule, the two-race requirement, the 7- and 30-day gaps measured from the latest answer, a miss resetting the clock without erasing milestones, review due dates and save repair. Full suite: 437 unit/backend tests and 125 UI-flow groups pass. Headless Chromium at 1194×834 and 390×844 seeds a sentence secured nine days ago. It confirms the sentence returns as the fourth question of a New words race, a right answer records "Kept after 7 days", and the picker and parent table update. Physical iPad is not verified.

## Race card star layout — 26 October 2026

The user reported that the stars on the race cards were messed up. With twenty turtles, each card tried to show twenty stars, which overflowed across neighbouring cards. Each card now shows five stars for the word set being played, the set's name, and one dot per word set: empty, half-filled once any turtle in the set is beaten, filled when all five are. Card pictures are also kept inside narrow cards in iPad portrait. Checked in headless Chromium at 1194×834, 834×1194, 1024×768, 768×1024 and 390×844 for both race pages, with every star, dot and picture inside its card. A new DOM unit test covers the star and dot logic. Full suite: 438 unit/backend tests and 125 UI-flow groups pass.

## Turtle Dash answers in other words — 27 October 2026

The user reported that the child had found the pattern in Turtle Dash: only one choice appeared in the sentence, so he scanned for it instead of reading. The user asked for simple paraphrasing that is not too hard, at two levels that start simple and get harder.

Turtle Dash in the main race now answers in other words at two levels in every word set:

- Turtles 1–2 (simple other words): one to four easy words. Examples: rock → "a stone", cat → "a kitty", four → "2 + 2", green → "like grass", pencil → "a drawing stick".
- Turtles 3–5 (other words): short descriptions. Examples: rock → "a big hard piece of the ground", rice → "small white grains you cook", hole → "an empty space in the ground".

The question stays the same ("Where is Pip?"), and all three choices are reworded, so none can be found by spotting a sentence word. The build rejects any right answer that reuses a content word of its sentence. A wrong choice may echo a sentence word ("not cold at all"), which catches scanning. The mistake panel shows "The sentence says X. In other words: Y." Flash Dash, Shell Duel, the expert race, unlocks and saves are unchanged. Content: `scripts/turtle-dash-glossary.json`, one [simple, harder] pair for each of the 197 answer and distractor words in the 201 main-race sentences. No audio or images were generated.

Verification: 20 Turtle Race unit tests, including the level pattern, all 201 sentences, the no-reuse rule and the right answers for "Pip is on the rock." Full suite: 439 unit/backend tests and 125 UI-flow groups pass. Headless Chromium at three sizes plays turtles 6 and 8 and makes a mistake on each. It confirms no choice appears in the sentence and checks the explanation and that Flash Dash still uses the sentence words. Physical iPad is not verified.

## Turtle Dash turtles 21–30 and replays not counted — 27 October 2026

The user pointed out that the other-words change was not visible as new levels, because the child had already beaten all 20 Turtle Dash turtles. The user asked for new levels with simple paraphrasing. During the work, the user also asked that redoing lessons not count towards reading time, because otherwise the child would pick easy turtles repeatedly.

Levels: turtles 1–20 return to the sentence words. Turtle Dash gains two new rows. Turtles 21–25 (Pebble → Willow, "Simple other words") answer in one to four easy words. Turtles 26–30 (Glacier → Golden, "Other words") answer in short descriptions. Both rows draw on all 201 sentences of the four word sets and keep the five steps of turtles 1–5 (4, 6, 8, 10 and 12 steps; turtles 1–2 of each row never slip back). The other-words glossary and the no-reuse rule from the previous entry apply unchanged. Flash Dash and Shell Duel keep twenty turtles. The next turtle to beat glows and says "new". A child who beat turtle 20 finds turtle 21 open without replaying. These rows are not counted as word sets in the "sentences mastered" table.

Reading time: race time, including the mistake pause, counts as reading time only when the turtle has not been beaten yet. Time on beaten turtles goes to a separate `replayDays` record. The race's "For parents" panel shows it, but it is never added to the BlitzWord Parents dashboard. The turtle picker marks a beaten turtle as "practice race, not counted as reading time". Time already recorded is unchanged.

Verification: 21 Turtle Race unit tests, including per-race turtle counts, unlocking turtle 21 after 20, Flash Dash ending at 20, all 201 sentences and counted versus replay time. Full suite: 440 unit/backend tests and 125 UI-flow groups pass. Headless Chromium at three sizes confirms the six Turtle Dash rows, turtle 21 open and highlighted, and simple other-words choices with none in the sentence. It also confirms that racing turtle 21 adds counted time while a replay of turtle 3 adds only replay time. Physical iPad is not verified.

## A new opponent for each row — 27 October 2026

The user asked for other enemies besides turtles as the child progresses.

Each row of five levels now has its own creature from the approved BlitzWord enemy art. In the main race: Brook Turtle (1–5), Hazel Hare (6–10), Ember Fox (11–15), Frost Lynx (16–20), and in Turtle Dash only Gale Falcon (21–25) and Mist Leopard (26–30). Names follow the familiar ladder in every row: Sleepy, Little, Brave, Speedy, Champion (for example "Sleepy Hare", "Champion Leopard"). The expert edition keeps its turtles 1–5 and races Ink Ravens at 6–10 (Shadow, Night, Storm, Ancient, Legend Raven). Level numbers, rules, sentences, unlocks, wins, mastery and reading time are unchanged; existing saves keep their progress and only the names and pictures change.

Where the creature appears: the race card picture (the row he is on), the level picker (a small picture beside each row, including locked rows so he can see who comes next), the intro picture and Start button ("Race the Sleepy Fox"), the race lane or duel arena, and the result ("The fox wins the duel", "Same fox again"). Beating the last opponent of a row says "A new challenger: Sleepy Hare!". The level picker label is now "Choose your opponent". Race names (Turtle Dash, Shell Duel) and the how-to lines stay as they were, so the written text still matches the recorded voice.

Voice: opening a race against a new creature plays the existing BlitzWord introduction ("A Hazel Hare is on the path. Ready to battle?"); turtle rows keep the how-to line. Twelve new George lines say "The <creature> wins this time. Try again!" and "The <creature> wins the duel. Try again!" for hare, fox, lynx, falcon, leopard and raven: 444 characters in batches `turtle-race-003` and `turtle-race-004` (35.1 s), installed by `scripts/build-turtle-race.cjs` from the generation-only branch output with matching receipts (`docs/turtle-race/NARRATION_REQUEST_2.json`, `NARRATION_GENERATION_2.json`). Listening checks are decode, duration and alignment only.

Images: none generated. Six cutouts in `assets/turtle-race/opponents/` (at most 420 px) are crops of the approved enemy atlases; all face right like the turtle, so the existing flip rules apply.

Verification: 22 Turtle Race unit tests, including the opponent for every row of both editions, names, art files, the lose lines and introductions. Two existing tests changed on purpose because the level names changed, and the voice test now covers both voice sets. Full suite: 441 unit/backend tests and 125 UI-flow groups pass. Headless Chromium at 1024×768, 768×1024 and 390×844 shows the row creatures without horizontal overflow, a leopard race, a fox duel lost with "The fox wins the duel", and the expert raven row. Physical iPad is not verified.

## Turtle Dash other words in known words, with less time pressure — 28 October 2026

The user reported that paraphrasing itself was fine, but the other-words answers used too many words the child does not know, and together with the time pressure that was overwhelming.

Words: every other-words answer for Turtle Dash 21–30 was rewritten to use only words he already reads. These are the BlitzWord 200 list (`scripts/turtle-dash-known-words.json`, from the curriculum workbook) plus every word of the 201 main-race sentences, questions and choices he met in turtles 1–20; plural and possessive forms count. The first glossary had a word outside that set in 148 of 197 simple answers and 158 of 197 harder answers ("kitty", "crunchy", "sack", "feathers", "flour", "fruit", "meal"). Examples now: rock → "a stone" / "a big hard stone"; cat → "it runs after a mouse"; apple → "red or green, from a tree"; four → "2 + 2"; night → "when you go to sleep". Harder answers are at most eight words, except one of nine. The build now fails if an answer uses a word outside the known set or repeats its own word, as well as the existing rule that the right answer never reuses a sentence word.

Time pressure: turtles 21–25 and 26–30 now need 3, 4, 5, 6 and 7 steps (before: 4, 6, 8, 10 and 12), and a wrong answer never slips Pip back. The race is still 60 seconds, and the mistake pause still stops the clock. Unlocks, wins, saves and reading time are unchanged; turtles 1–20, Flash Dash, Shell Duel and the expert edition are unchanged. No audio or images were generated.

Verification: 23 Turtle Race unit tests, including a new test that every answer uses only known words, and the new step goals. One existing test changed on purpose because the step goals and the harder answer for "rock" changed. Full suite: 442 unit/backend tests and 125 UI-flow groups pass. Headless Chromium at 1024×768, 768×1024 and 390×844 plays turtles 21 and 26 with the new answers and no horizontal overflow. Physical iPad is not verified.

## Turtle Dash other words as a slower ladder of 35 turtles — 28 October 2026

The user reported that the other-words turtles were still too difficult and asked to start easier, ramp up more slowly and add more levels.

Turtle Dash turtles 21–30 are replaced by 35 other-words turtles, 21–55, in seven rows of five. Each row changes one thing:

| Turtles | Opponent | Answers | Choices | Sentences | Steps |
|---|---|---|---|---|---|
| 21–25 | Falcon | short meanings | 2 | first words (51) | 2, 3, 3, 4, 4 |
| 26–30 | Leopard | short meanings | 3 | first words | 3, 3, 4, 4, 5 |
| 31–35 | Bear | short meanings | 3 | first and new words (101) | 3, 4, 4, 5, 5 |
| 36–40 | Seal | short meanings | 3 | all four sets (201) | 3, 4, 5, 5, 6 |
| 41–45 | Owl | long meanings | 2 | first words | 2, 3, 3, 4, 4 |
| 46–50 | Otter | long meanings | 3 | first and new words | 3, 3, 4, 4, 5 |
| 51–55 | Stag | long meanings | 3 | all four sets | 3, 4, 5, 5, 6 |

A wrong answer never slips Pip back on any of them, and the race is still 60 seconds with the clock paused while a mistake is shown. With two choices, the wrong one is picked at random from the two recorded wrong answers. The answers are the known-words glossary from the previous entry. Retention checks during a race come only from the sentences that turtle uses, so an early row never brings in a harder word set. The picker shows each row's name and a short note ("2 choices · first words").

Saves: results on the old turtles 21–30 belonged to different levels, so they are dropped once and the child starts the new ladder at turtle 21 (marked by `dashLadder: 2` in the race save). Turtles 1–20, Flash Dash, Shell Duel, reading time, sentence milestones and the expert race are unchanged.

Opponents: five new approved creatures cropped from the enemy atlases (Moss Bear, Glacier Seal, Snow Owl, Lily Otter, Rowan Stag). Their introductions reuse existing BlitzWord recordings. Five new George lines, "The <creature> wins this time. Try again!" (183 characters, batch `turtle-race-005`), were generated on the generation-only branch and installed with receipts (`NARRATION_REQUEST_3.json`, `NARRATION_GENERATION_3.json`). No images were generated.

Verification: 23 Turtle Race unit tests. The other-words test was rewritten on purpose for the new ladder (rows, choices, steps, word sets, two-choice questions and the one-time save change). Level-count, save and card-dot expectations changed from 30 to 55 turtles, and the voice and opponent tests now cover the third voice set and the Turtle-Dash-only creatures. Full suite: 442 unit/backend tests and 125 UI-flow groups pass. Headless Chromium at 1024×768, 768×1024 and 390×844 loads a save with old turtles 21–23 beaten: it opens on turtle 21 (2 steps, 2 choices), keeps turtles 1–20 and reading time, plays a two-choice race and shows no horizontal overflow. Physical iPad is not verified.


## Expert race turtles 11–20 — 29 October 2026

The user asked for more expert levels. The standalone expert race (`assets/turtle-race-expert/`) grows from ten to twenty opponents in every race, in two new rows of five. The main BlitzWord race is unchanged.

| Turtles | Opponent | Sentences | Turtle Dash steps | Flash Dash | Shell Duel |
|---|---|---|---|---|---|
| 11–15 Master | Leopard (Silent → Master Leopard) | 40 new sentences of 12–20 words with rarer words (reluctantly, bewildered, scarce, triumphant …) | 7–11 | 8–12 steps, sentence shows 7 → 5 s | 6–10 shells, 13 → 9 s, 3 hearts |
| 16–20 Grandmaster | Lynx (Silver → Grandmaster Lynx) | both long sets mixed, 76 sentences | 8–12 | 9–13 steps, sentence shows 6 → 4 s | 7–11 shells, 11.5 → 7.5 s, 3 hearts |

All answers are in other words, as in turtles 1–10, and a wrong answer slips Pip back. Every expert sentence tests a different key word; the build rejects a repeated key word, a sentence under 12 words in the new set, and any right answer, matching sentence or yes-question that reuses the key word. Content: `scripts/turtle-race-expert-2.json`. The new sentences have no recording, like the first expert set; the review screen shows them in writing.

The picker shows four rows; the Master row counts its 40 sentences as a set, and the mixed Grandmaster row is not counted as a set of its own. Leopard and lynx reuse their approved art and existing voice lines; no images or audio were generated.

Saves: expert saves keep all results. A player who has beaten Legend Raven finds turtle 11 open and marked "new". A parent who used "Open all turtles" before this release presses it again to open 11–20.

Verification: 23 Turtle Race unit tests. The expert-race test changed on purpose from ten to twenty turtles (pools, names, descriptions, the mixed row, the open-11 save case), the item test now counts both expert sets, and the opponent and open-all tests cover turtles 11–20. Full suite: 445 unit/backend tests and 126 UI-flow groups pass. Headless Chromium at 1194×834, 834×1194 and 390×844 shows the four-row picker without overflow, races turtle 11 and Grandmaster Lynx in Shell Duel with all choices on screen and no console errors. Physical iPad is not verified. Build `turtle-race-expert-levels-20261029-r1`.


## Shell Duel clock from rounds, and expert turtles 21–30 — 30 October 2026

The user reported that in Shell Duel the 60-second clock ran out before the player could beat the opponent, and asked that the duel time follow how many rounds are played and how long a round lasts. The user also asked for more expert levels.

Shell Duel clock, both editions: a win can need every shell plus all but one heart lost, and each round may use its whole question timer plus the 650 ms hit animation; a mistake already pauses the clock. The clock is (shells + hearts − 1) × (question time + 0.65 s) + 0.9 s, rounded up to 5 s and never below 60 s. A duel is now only lost on hearts, never on the clock, when each question is answered inside its timer. The HUD clock, its ring, the last-five-seconds ticks and the level detail ("145 s clock") use the level's own time. Turtle Dash and Flash Dash remain 60-second races against the turtle.

| Edition | Turtles | Shell Duel clock |
|---|---|---|
| Main | 1–20 (each word set) | 90, 80, 65, 70, 65 s |
| Expert | 1–5 | 70–75 s |
| Expert | 6–10 | 90–100 s |
| Expert | 11–20 | 110–120 s |
| Expert | 21–30 | 140–155 s |

Expert turtles 21–30, 30 opponents per race:

| Turtles | Opponent | Sentences | Turtle Dash steps | Flash Dash | Shell Duel |
|---|---|---|---|---|---|
| 21–25 Champion | Falcon (Dawn → Champion Falcon) | 40 new sentences of 16–23 words with the hardest words (meticulously, exasperated, conspicuous, compassionate …) | 6–10 | 6–10 steps, sentence shows 7 → 5 s | 7–11 shells, 15 → 11 s, 3 hearts |
| 26–30 Legend | Fox (Clever → Legend Fox) | all three long sets mixed, 116 sentences | 7–11 | 7–11 steps, sentence shows 6.5 → 4.5 s | 8–12 shells, 13 → 9 s, 3 hearts |

Turtle Dash and Flash Dash goals for the longest sentences start lower than turtles 16–20, because those races stay 60 seconds and these sentences take longer to read. All answers are in other words; every expert sentence tests a different key word; the build rejects a sentence under 15 words in the new set. Content: `scripts/turtle-race-expert-3.json`, no recordings. Falcon and fox reuse approved art and existing voice lines; no images or audio were generated.

Saves: kept. Beating turtle 20 opens turtle 21. A parent who used "Open all turtles" earlier presses it again.

Verification: 24 Turtle Race unit tests (full suite: 446 unit/backend tests and 126 UI-flow groups pass), including a new test that plays the slowest possible win on every duel level of both editions (every allowed heart lost on a timeout, every shell hit just before its timer) and checks that the clock never runs out, while races stay 60 s. The expert-race test changed on purpose from 20 to 30 turtles. Headless Chromium at 1194×834, 834×1194 and 390×844 shows the six-row picker, the 145 s clock on Dawn Falcon and all choices on screen with no console errors. Physical iPad is not verified. Build `turtle-race-expert-30-20261030-r1`.
