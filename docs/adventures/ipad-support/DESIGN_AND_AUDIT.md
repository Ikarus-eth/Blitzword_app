# Landscape iPad follow-up — 11 October 2026

## Accepted and implemented in this release

The parent's observation is that occasional defeats followed by voluntary retries and eventual victory are valuable. Four quest hearts and the two-step retreat remain. Independent reading now earns a separate protective animal: eight consecutive correct answers or six consecutive Quick correct answers, at most one grant per fight, two grants per quest, one held shield. Help pauses the streak; an independent miss resets both counters. Quick uses the existing lightning rule (valid timing, exposure at most 950 ms, response under 1500 ms), not the stricter historical speed-XP rule. Slower accurate reading can always earn protection. The cap survives death/retry and save/reload; an existing duel shield occupies the same held slot. This feature applies to creature quests, not assessment/demo or Word trails.

On first grant, choose from met creatures; the regular companion is excluded when another family is available. With only one met family, another individual of that family is possible. The choice is remembered and can be changed in the Creature Book. Subsequent grants bring that choice back automatically. The supporter leaves when the shield absorbs a hit, at the combat impact; the regular companion remains. Existing once-per-quest companion protection is consumed first. Changing the regular companion to the active support family swaps the two choices. No undiscovered creature is unlocked by this reward.

Hero, Pip, regular animal, shield animal and opponents have separate landscape lanes. Support progress appears only during answer feedback, never the word exposure. Parchment/forest/gold modal panels now explain correct, incorrect, revealed and final answers on quest riddles/maps; the standalone Atlas uses the same panel and retains German support. Modal backgrounds are inert, focus stays inside, the next step requires a tap, and feedback time earns no reading credit. Existing solved/retry screens remain safe fallbacks on reload. Tiny fixed text sizes in the main app, quests, shared map viewer and Atlas were raised to at least 18 CSS px; main clues/answers use 22–28 px. Layout scrolls instead of shrinking reading text.

## Map reading time and XP

Previously a map question used the riddle cap of 180 seconds, allowing nine minutes of reading credit for a three-question search. Map reading now has its own 30-second cap per clue, 90 seconds per map per quest run. Visible foreground time contributes to the existing Reading riddles total and the ten-minute daily boost; it is not recorded again as active battle/teaching time. Pausing, hidden tabs, long heartbeat gaps and modal feedback are excluded. Per-question used time persists through retry/reload and switching to Word trails. Previously saved time is preserved without granting more on an already exhausted clue. Ordinary riddles retain their three-minute cap.

XP is unchanged: each map clue's first solve earns 50 XP, or 88 under the 1.75× daily boost (rounded). Three first solves therefore award 150 unboosted XP. Hints/listening and a preceding wrong attempt do not remove that reward. Wrong answers, repeat solves and searching duration give no solve XP. Capped map reading may help reach the existing daily milestone and its separate bonus. The standalone Atlas stores map progress/lives only and has no connection to the main learner's time or XP.

## Teaching inventory and fal.ai estimate

Computed from current `content.js`, `narration.js` and the actual audio matching function; exact missing texts are in `TEACHING_AUDIT.json`. This counts recordings, not whether device speech can read a missing clip.

| Asset | Available / missing | New text | First-pass estimate |
|---|---|---:|---:|
| 1,000 individual word pronunciations | All recorded | 0 characters | $0 |
| 976 distinct teaching sentences across 1,000 cards | 188 recorded / 788 missing | 23,198 characters | $2.3198 |
| 788 distinct tips across 800 expansion cards | 0 recorded / 788 missing | 54,760 characters | $5.4760 |
| Both missing audio sets | 1,576 clips | 77,958 characters | $7.7958 |

The previous approved batch (`docs/NARRATION_WORDS_FAL_REQUEST.json` and generation/release evidence) used 4,471 characters for 675 clips, estimated $0.4471. The same multilingual-v2 endpoint lists $0.10 per 1,000 characters: https://fal.ai/models/fal-ai/elevenlabs/tts/multilingual-v2 . These are character estimates, not tokens or provider invoices. Reserve 25% for selected pronunciation retakes: about $2.90 for sentences, or $9.75 for both sets. Personalized names still require device speech unless separately generated. No generation or spending is included in this release.

200 cards use 20 distinct illustrated image/crop views. All 800 expansion cards lack contextual illustrations; 44 already have a symbol/number treatment, which is useful but not equivalent to an illustration. We do not need 800 unique paintings. A planning envelope of **80–100 reusable scenes** assumes eight to ten genuinely compatible words per scene, matching the reuse pattern of the first 200. That is an estimate requiring a word-to-scene storyboard, not a verified final asset count. Concrete nouns/actions can share a scene; relations need paired contrasting views, and contractions/tense/function words often need short sequences or typography rather than a literal noun picture. Reuse approved hero/Pip art and never add answer clues during battles.

Recommended next production unit: **eight teaching compositions for chapter four**, one per subchapter, each with a focused base scene and a comparison/sequence where required. Audit existing art first and count new raster generations only after scene assignments. Record the 788 sentences after a sentence review. Rewrite the long generic tips into shorter, accurate teaching prompts before committing the optional tip batch. Image-generation cost is not included in the audio quote.

## Fourth campaign: practical vocabulary-aware design (proposal, not playable yet)

Keep **The Clockwork City Below** and its eight proposed residents from the review follow-up. Quest number cannot establish a common mastery level: the game permits help/retry, adapts word selection, and uses task completion rather than a word-mastery gate. Even a secured single word does not prove sentence comprehension. Do not author quest four assuming every child independently knows the same fixed list.

Build one reviewed puzzle and scene, then two or three equivalent clue variants. Each variant stores its literal text, vocabulary, intended relation, answer/distractors and annotated visual evidence. At first opening, choose a variant using the learner's existing word evidence and save the exact selection. Never rewrite a pending clue because the learner's history changes. Prefer surrounding words with separated independent successes and no unresolved recent misses; use delayed review as stronger evidence, while treating `familiar` alone as weak. Authored labels/names can be heard. A chosen variant should contain at most one deliberately new teaching target; if no variant fits, use the shortest clue with normal listening/teaching, without blocking the story.

Example storyboard, requiring new verified art: two boats beneath one bridge, one beside a mill; they carry differently coloured parcels. Short clue: “Find the boat by the mill. What colour is its box?” Longer equivalent: “Find the boat under the bridge, beside the mill. What colour is its box?” Both point to the same unique box. The longer version is invalid if the art has only one boat and the relation would be redundant. Retest “under” later with a different object and answer, without immediately preceding teaching.

| Subchapter | Keep vocabulary familiar; focus on one relation/contrast | Visible story change |
|---|---|---|
| Root door / Quartz Mole | under, through; use “door” and “path” instead of elaborate cave terminology | Door opens |
| Lantern street / Lantern Gecko | before, after; reuse light, shop, red, blue | Street lights up |
| Broken lift / Gem Spider | first, then, last; demonstrate “lift” once with picture/audio | Lift moves |
| Upstairs parcel / Slate Pangolin | above/below; call the parcel a “box” in clues | Box reaches its room |
| Echo caves / Echo Lizard | not, only; reuse door/path and colours | Safe passage opens |
| Copper gate / Copper Scorpion | left/right, same/different; use “gate,” not mechanical jargon | Gate opens |
| Warm workshop / Cinder Porcupine | more/fewer/enough with visible small groups | Clock starts turning |
| Clock again / Flint Armadillo | Recombine already encountered relations; no new required clue words | City comes alive |

These are candidate teaching targets, not an assertion that every listed word is new. Maximum one new required clue word at a time; reuse targets across the chapter. Put optional richer storytelling behind Listen. Before each puzzle, up to two already-eligible target words may be prioritised in the fight, after due reviews/struggling words. Never push untaught words into battle just to satisfy a story. Record sentence evidence separately (independent/listened/hinted/revealed); do not inflate single-word mastery from a correct puzzle option. No live generated language.

Pilot four linked puzzles in the first subchapter before expanding all eight. Include one later-session transfer check with different art. Measure how often reading needs support, whether the relation is actually necessary, and whether the child can explain the answer; don't time sentence solving. Actual fourth-campaign code, eight chapter paintings and paid narration remain outside this implementation pending content production.
