# BlitzWord — Current Product Spec

Status: approved decisions through 24 September 2026; documentation reconciled on 25 September 2026. Start with [current status](CURRENT_STATUS.md) for the implemented behavior and outstanding work. Earlier sections and dated milestones retain design history; later approved updates supersede conflicting terminology, growth gates, curriculum limits and release status.

## Source-of-truth order

1. Latest explicit user decisions determine intended behavior.
2. Current repository code and verified deployment determine what is implemented; [current status](CURRENT_STATUS.md) records the checked checkpoint. This specification records approved direction and dated changes.
3. Named reference images for visual direction.
4. Earlier chats and superseded mockups only when they do not conflict with the above.

When implementation differs from this spec unintentionally, treat it as a discrepancy to review rather than silently redefining the product.

## Current rule map

- A chapter is one map field: at least ten active minutes, three reading wins, a completed number duel and its learning objectives. A campaign contains five chapters; seven campaigns contain the fixed Core 200.
- Growth is XP-only at **15,000 / 45,000 / 70,000**, with whole XP awards, ten visible steps and the returning-day bonus. Earned forms and learner saves remain preserved. See [point 9](#point-9-whole-xp-and-slower-growth--24-september-2026).
- Practice uses rotating reviewed distractors; the 26 reading-check items use fair fixed sets. All 34 story sentences/picture pairs are approved and deployed. Their earlier review gates are closed.
- Narration recovery and gate pronunciation review are complete. The remaining recordings and synchronized highlighting are authorized but not deployed; [draft PR #80](https://github.com/Ikarus-eth/Blitzword_app/pull/80) was last blocked by ElevenLabs quota.
- Points 1, 2, 3, 4, 6, 7 and 8 and the later point 9 are complete; point 5’s final narration batch remains open. Number-duel changes and enemy extensions remain discussion items; native/commercial packaging is later work. See [current status](CURRENT_STATUS.md#outstanding-work-and-ownership).

## 1. Product thesis

BlitzWord is for children who can already handle basic letters/sounds and simple words but still expend too much effort reading. Their comprehension and interests can be well ahead of what they can comfortably read alone. The product trains accurate, confident word recognition and retention through competitive battles and visible progress without using babyish material.

Reading is the gameplay action. The child should not complete educational tasks merely to unlock unrelated entertainment.

## 2. World and chapter-one story

The provisional world is a mysterious forest. A child-selected hero protects creatures, rescues a hatchling dragon companion, and searches for its stolen siblings.

The dragon companion starts with the name **Pip**. Once Pip appears, Pip must remain the same recognizable character across battles, teaching scenes, story moments, rewards, and later growth stages. The child can rename Pip later in the game; renaming changes the displayed name only, never Pip's visual identity or progression.

Under the current terminology, the first campaign contains about 30 target words across five chapters. Growth depends on cumulative XP, not campaign completion: thresholds are 15,000 / 45,000 / 70,000, with naming unlocked at the first evolution. Existing movement and purchase locks remain separate. Growth must feel like the same dragon maturing, not a replacement character. Story progress does not require 30-day retention; retention continues in later practice.

The campaign map is the campaign Home screen. Show visible story milestones and permanent Pip XP with the next growth stage and its threshold. See [whole XP and growth](XP_PACING_RELEASE.md) and section 27’s chapter rules. Point 9 supersedes section 27’s original XP thresholds and calendar projections. Section 23 and `CAMPAIGN_MAP_AND_GROWTH.md` describe the earlier map milestone.

## 3. Onboarding and starting screens

### Approved setup

Use one compact parent-and-child setup flow that captures:

- child name or nickname;
- age;
- gender presentation for avatar selection.

The hero uses the child's entered name throughout the game. Treat the name as local display data; do not include it in analytics or logs unless a future privacy design explicitly approves that.

### Starting screen direction

The selected starting-screen direction is the previously approved option A. Required copy/detail from that review:

- primary caption: `Win the reading battle`;
- minimize explanatory text;
- green primary button should not contain a written word.

The earlier setup mockups were retired on 23 September. Use the current app and [active artwork references](BLITZWORD_REFERENCE_IMAGES.md); no replacement attachment or reconstructed mockup is required.

### Hero selection

Offer Mage, Knight, and Archer. Each has two gender-differentiated appearances, for six hero appearances total. They have identical gameplay ability and reading difficulty. Hero switching can be allowed later.

Approved visual direction: **Option 17 — Rowanfire Companions**. This establishes the shared art direction. The original `00a_heroes_character_bible.png` remains authoritative for the three female identities; the male revision below is authoritative for the boys. The shared visual language combines forest greens, natural leather and wood, warm cream cloth, and restrained ember-red accents so the heroes belong naturally beside Pip's Ember Guardian design. Rowan leaves/berries and related woodland motifs may appear as small identifying details, but should not become decorative clutter.

Class-specific visual anchors from the selected direction:

- Mage A/B: forest-and-ember robes, natural wood staff, warm orange ember light, subtle rowan/leaf details;
- Knight A/B: practical silver armour, red scarf/cape accents, red-and-gold botanical shield language, grounded forest materials;
- Archer A/B: predominantly forest-green clothing and leather equipment with small red/rowan accents, simple wooden bow and quiver.

Do not reinterpret Option 17 as a general palette prompt. Use the exact identities from the applicable current reference: the 21 September male lineup for the boys and the original Option 17 sheet for the girls.

### Approved male hero revision — 21 September 2026

The approved complete male lineup is `assets/rowanfire-boys-2026-09-21.png` in `Ikarus-eth/Blitzword_app`. It replaces all earlier male hero depictions, including the boys in the original Option 17 character bible and the five comparison sheets. The final combined lineup is authoritative; the comparisons only record how it was selected.

| Hero | Hair colour | Hairstyle | Face and outfit |
| --- | --- | --- | --- |
| Male Mage | Ash blond | Soft medium-short waves | Approved sheet 4 face; final lineup's Rowanfire robes and ember staff |
| Male Knight | Golden blond | Short and tousled | Approved sheet 4 face; final lineup's armour, red scarf and botanical shield |
| Male Archer | Chestnut | Soft side-swept fringe | Approved sheet 4 face; final lineup's green cloak, leather equipment and bow |

Preserve the final lineup's exact face, skin tone, child proportions, clothing, equipment and hair identity in every later screen or illustration. Female Mage, Knight and Archer retain their approved Option 17 identities. Pip retains the Ember Guardian identity.

The original `00a_heroes_character_bible.png` remains authoritative only for the three female heroes. Earlier onboarding, battle and teaching mockups were retired on 23 September; they are not active composition/flow references and their male characters must never override this revision. If an attachment conflicts with this section, follow this section and the final male lineup. Do not generate new boys from an old six-character sheet.

### Character coherence rule

The six heroes are six fixed, reusable characters, not six prompts that may be reinterpreted from scene to scene. Maintain an authoritative visual reference for each hero covering face, hair, skin tone, body proportions, outfit silhouette, materials, signature colours, equipment, and age range. Every onboarding screen, battle, teaching image, story illustration, victory/defeat scene, and later marketing mockup must use those same identities.

Class differences should read immediately through silhouette and equipment while all six remain part of the same visual world:

- Mage: consistent robe/cloak language and staff/wand family;
- Knight: consistent armour, shield/sword language, and proportions;
- Archer: consistent bow/quiver language, cloak, and proportions.

Do not casually change hairstyle, face shape, costume construction, weapon design, or signature colours between generated assets. Pose, expression, camera angle, lighting, weather, and minor dirt/damage may change.

Pip follows the same rule. The approved visual direction is **Ember Guardian**, preserved in the production assets listed in [active references](BLITZWORD_REFERENCE_IMAGES.md#ember-guardian-pip--approved-identity). Historical character-bible filenames record provenance; they are not missing attachments to recreate. Preserve its orange/ember scale palette, cream underside, darker wing membranes with warm flame-like markings, horn structure, facial identity, dorsal spines, tail form, and overall silhouette across every scene.

Pip's growth should visibly shift from a young companion toward a protector. The hatchling can remain approachable and youthful, but each later stage should become less baby-like through a longer muzzle, stronger neck and shoulders, larger wings, more confident stance, and more pronounced horns/spines. The rideable stage should read as a strong, capable guardian rather than an oversized cute hatchling, while remaining unmistakably the same Pip.

Use `Pick your hero`, not `Choose your hero` or `Continue`.

After hero selection, the child can enter an optional first battle before assessment. The primary route is `Try a battle`; `Reading check first` remains a secondary route. Both routes lead to assessment before the personalized campaign.

## 4. Optional first battle before assessment

The first optional encounter is a guided taste of the game, not a substitute for assessment.

Current direction:

- forest path;
- help a fox get past a small thorn creature;
- one short spoken introduction instead of a separate story-text screen;
- one guided example with an illustrated, narrated teaching sentence;
- roughly six battle turns;
- begin self-paced;
- preserve the separation of word exposure, masking, answer selection, and feedback;
- the first independent mistake is explicitly a practice turn and does not remove health;
- subsequent independent mistakes can remove hearts and defeat is possible;
- guided/helped answers do not cost health and do not count as independent mastery evidence;
- after a completed or lost encounter, proceed to assessment.

## 5. Assessment

The adaptive reading check is implemented. Its 26 reviewed fixed answer sets were deployed in PR #79; the earlier design-review gate is closed. Preserve the existing item routing, calibration, stopping rules and saved questions. This section records the design purpose; [the fixed-set release](ASSESSMENT_CHOICES_RELEASE.md) and `game-core.js` define the verified implementation.

### Assessment purpose

The initial assessment should feel like the actual game, not like a separate school test.

The core mechanic must remain the BlitzWord battle mechanic:

1. fixation;
2. word shown briefly on a scroll;
3. neutral fixed-size mask that does not reveal word length;
4. four written answer choices on scrolls;
5. a `?` button for `I’m not sure`;
6. feedback after the answer.

There should be no separate `hear a word and choose it` mechanic. Do not make the assessment audio-led.

### Child flow

- Skip the earlier parent-scored read-aloud screen entirely.
- Start directly with very easy visual-recognition items, then adapt upward depending on performance.
- The child should never need to read instructions. Any instructions should be visual and/or narrated very briefly, but the assessment itself is based on seeing a written word briefly and then selecting it.
- Keep the same interaction pattern throughout the assessment. Do not redesign the screen between easy, phonics, and harder questions.
- After the assessment, go directly into the first encounter. No child-facing results screen.
- The parent summary can exist later in the parent area, but it should not interrupt the child flow.

### Visual design

Follow the established BlitzWord visual direction and the selected battle flow.

- All words and answer choices appear on parchment scrolls.
- Use the same forest/adventure visual language as the rest of the game.
- Do not introduce generic cards, modern quiz UI, or parent-control looking chrome.
- The assessment should be visually calmer than combat but clearly feel like the same game world.
- Keep the screen readable and stable. Calmer does not mean a different mechanic.

### Opening words and progression

Begin with simple familiar candidates such as:

- `you`
- `cat`
- `car`
- `can`

These are not necessarily the final exact first four, but they represent the intended starting difficulty.

Then make words progressively harder by adding different spelling patterns and sounds.

Potential theme-fitting harder candidates include:

- `fox`
- `map`
- `rock`
- `tree`
- `green`
- `ship`
- `cave`
- `dragon`
- `forest`
- `star`
- `shark`
- `night`

Prefer words that fit the fantasy/forest/game world where possible. If educational coverage requires a less thematic word, educational value takes priority.

### Distractor philosophy

This is a critical design rule.

The child must not be able to solve the task by noticing only:

- first letter;
- last letter;
- word length;
- rough word shape.

Each target gets three close distractors. For practice questions this is superseded by point 2: each word has 5–7 candidates and each question draws three; see [Rotating wrong answers](#rotating-wrong-answers-point-2--approved-23-september-2026). The reading check uses the [26 fair fixed sets](ASSESSMENT_CHOICES_RELEASE.md), with shuffled answer positions.

Prefer real words where possible. Ideally, two or three of the four options are real words. When suitable close real-word neighbours do not exist, use one or two plausible made-up forms.

Examples from the deployed fixed reading-check sets (asterisks mark constructed distractors in this review only):

| Target | Wrong answers |
|---|---|
| can | con, cap, cop |
| cat | cut, bat, but |
| rock | rack, lock, lack |
| night | light, nought, lought* |
| you | your, yau*, yaur* |

The [complete reviewed table](ASSESSMENT_CHOICES_RELEASE.md) and `content.js` are authoritative. The earlier illustrative choices were superseded by the fairness review.

Made-up words are acceptable in this recognition task because they are distractors, not teaching targets. They must never accidentally duplicate a real curriculum word.

### Adaptive scope

Assessment length should depend on both accuracy and time spent.

- A child who struggles on early words such as `can` should not be forced through a long assessment.
- A better/faster reader should receive more questions and harder patterns.

Working direction:

- struggling child: roughly 8–12 scored items;
- typical child: perhaps 12–18;
- strong child: more and harder probes, never more than 25.

These ranges explain the design intent. The implemented `shouldStopAssessment` and `adaptAssessment` rules govern actual counts and adaptation; they are not pending design work. The assessment stops using its saved evidence, not a fixed checklist. Do not visibly label difficulty or tell the child they are moving up or down.

### Difficulty varies on two separate axes

1. Word complexity
   - simple CVC words;
   - close vowel contrasts;
   - consonant blends / digraphs;
   - long vowels;
   - r-controlled vowels;
   - more complex multi-letter patterns;
   - eventually somewhat longer words.
2. Exposure duration
   - start generous;
   - shorten only when accuracy supports it;
   - if performance drops, move back toward a comfortable duration.

Do not change both dramatically at once if that would make the result hard to interpret. The purpose is to find a reasonable starting region, not the absolute shortest exposure the child can survive.

### Assessment outputs for v1

Even if the app cannot yet fully use all the data, store useful item-level observations.

At minimum, the assessment should influence:

- which words enter the child’s initial practice pool;
- which words are treated as already familiar;
- which words require more repetition;
- starting exposure duration;
- whether certain spelling patterns appear to need additional practice.

Keep observed data separate from inferred ability.

Examples:

Observed:

- `rock`, correct at 1500 ms;
- `lock`, incorrect at 1500 ms;
- selected `rack`;
- response time 2.3 s.

Inference:

- possible difficulty distinguishing this vowel/spelling contrast.

Do not turn one mistake into a phonics diagnosis.

### Curriculum consequence

For v1, use the full reviewed curriculum/library as the source pool rather than restricting personalization to only a tiny fixed 20-word subset.

The current release uses fixed chapter assignments within the reviewed Core 200, with the first campaign containing about 30 targets. Reading-check observations personalize familiarity, repetition and initial exposure rather than constructing a new chapter vocabulary. Selection of a personalized chapter from a wider library was earlier design direction, not an implemented feature.

### Teaching moments after assessment

Assessment itself does not become a teaching screen. When the child later needs support during practice, use the teaching-moment flow in Section 7: reviewed sentence + illustration, synchronized narration/highlight, combat paused, no health cost, and delayed recheck after intervening material.

### Historical assessment design checklist — resolved

The following review items were resolved by the existing reading-check implementation and the later fair fixed-set release:

- exact first 8–12 candidate target words;
- final distractor sets;
- thresholds for increasing word complexity;
- thresholds for shortening exposure duration;
- early-stop logic for struggling readers;
- continuation logic for stronger readers;
- exact learner-model fields written afterward.

This list does not authorize another assessment redesign. Any future change must preserve mechanic consistency, reading validity, calm presentation and saved questions.

## 6. Selected battle screen: scroll flow

The earlier `02_battle_scroll_flow_SELECTED.png` mockup is retired. Preserve the current scroll implementation and [active spiral/character references](BLITZWORD_REFERENCE_IMAGES.md).

The selected direction is an ancient scroll inside the battle scene. The scroll holds the target word during exposure and becomes a neutral mask before the answer tiles appear.

### Battle sequence

1. Encounter state shows hero, companion, enemy, hero hearts, enemy health bar, pause, and environment. Child-facing text is minimal.
2. Fixation briefly centers attention.
3. Word appears clearly on the scroll for the selected exposure duration. No answer choices are visible. Characters and combat effects stay still.
4. Word disappears behind a neutral mask that does not reveal word length. Do not use a number of question marks, dashes, blocks, or blanks matching the number of letters.
5. Four equal answer choices appear. Distractors should be confusable enough that precise reading is required; avoid answer-position or picture cues.
6. Correct independent answer: speak the target word, then animate the hero's attack and remove one enemy heart. Feedback stays brief and the next item continues quickly.
7. Wrong independent answer: speak/show the correct target, remove one hero heart, and animate the enemy reaction only after the answer is locked. The correction remains available until the child continues; replay is available.
8. Battle resolves when enemy health reaches zero or hero health reaches zero.

Battle reactions must never animate during fixation or word exposure. Teaching also pauses combat.

Approved spiral refinement — 24 September 2026: after the word disappears, the shared battle/reading-check mask uses tilted golden light ribbons, a warm diffuse glow and small star sparks, following the [user's spiral reference](references/golden-spiral-20260924.png). The artwork stays motionless, identical for every target and fixed at 180 × 110 CSS pixels. Word exposure, masking and answer timing retain their existing rules. Only the spiral is a new reference; the pictured scenery and character do not replace existing art.

## 7. Teaching moments

A teaching moment is supported meaning/pronunciation practice, not another test. Combat pauses completely.

### Trigger and return flow

Trigger teaching for:

- a newly introduced word answered incorrectly;
- repeated difficulty with a word;
- selected review moments where extra reinforcement is useful.

Replay/help never costs health. Do not retest the target immediately after teaching; insert intervening material first. A supported teaching response is not independent mastery evidence.

### Screen composition

Use one reviewed teaching card with:

1. one short sentence on parchment, usually about 3–7 words;
2. the target word in the sentence, yellow-highlighted and underlined;
3. one large illustration below the sentence;
4. replay and continue controls only;
5. no combat movement, health loss, or competing UI.

Narrate the complete sentence slowly and clearly in a calm, deep voice. Highlight the target word in sync when it is spoken. Keep the rest of the sentence visually neutral.

The companion should normally be the subject or central participant. Use the companion's current name dynamically; it starts as `Pip` but may be renamed later. The selected hero can be the central actor when that makes the concept clearer, as in `The hero sat on the rock.`

### Image teaching rule

Every image should teach through a tiny story: an obvious action, relationship, comparison, sequence, or interaction. The child should be able to infer the sentence meaning from the scene before hearing the narration.

- Concrete nouns: make the object unmistakable and show Pip/hero using or interacting with it rather than standing beside it.
- Verbs: show the most diagnostic instant of the action, e.g. jumping visibly midair between two surfaces.
- Relational/abstract words: encode the relationship explicitly; do not expect proximity alone to teach it.
- Remove decorative details that create competing interpretations.

Expressions, gaze, pointing, distance, body position, sequencing, and object scale are instructional tools and should be used deliberately.

### Approved concepts for difficult high-frequency words

Use these as teaching-pattern references, not mandatory sentence templates:

- `they`: several characters actively do the same thing together; Pip stays visibly separate from the group.
- `that`: a prominent object is clearly farther away and Pip points toward it.
- `this`: use a direct comparison; Pip points to the nearby/relevant item, e.g. two hats of clearly different sizes.
- `me`: make Pip unmistakably the referent/recipient, e.g. Pip points to itself or another character hugs Pip.
- `then`: show a visibly ordered two-step sequence, e.g. Pip eats, then naps.
- `think`: show visible pondering plus a thought bubble; the thought object exists only in the bubble, not physically in the scene.

### Asset development

Pre-generate and review teaching assets; no live image generation occurs during play. Recorded timing alignment is approved but incomplete in draft PR #80, so the synchronized-highlighting requirement above is not yet a production claim.

Use the existing teaching-card implementation and approved teaching assets for composition and tone, and the [active character references](BLITZWORD_REFERENCE_IMAGES.md) for the exact hero/Pip identity. The old teaching-card mockup is retired. Keep recurring characters visually coherent across all assets.

For visually obvious words, create the strongest concept directly. For abstract, relational, or ambiguous words, first compare three meaningfully different A/B/C concepts that test different teaching mechanisms rather than camera angles. Choose based primarily on whether a young child can infer the target meaning, whether sentence and image say exactly the same thing, and whether any misleading cue remains.

The Mentava list may supply candidate vocabulary and sound-pattern context, but its order is not a reading-frequency ranking and does not determine early-curriculum priority.

If teaching interruptions become frequent, reduce new-word introductions rather than compressing or skipping the teaching moment.

## 8. Daily practice and challenge structure

The earlier seven-minute challenge target is superseded. A chapter is one map field with a minimum of ten interaction-confirmed active minutes, three reading wins, a completed number duel and learning objectives. One chapter per day is the visible goal; further play and later review remain available. See [chapter pacing](SUCCESS_XP_RELEASE.md).

The stopping point should occur at a natural boundary. Do not force the child to continue until an enemy is defeated. Save unfinished fights exactly.

### Word mix

Each challenge mixes:

- retained/review words due for another independent check;
- currently unfinished words;
- difficult words receiving extra practice;
- new targets when capacity permits.

The current chapter pool and due reviews follow [the approved scheduling/refill rules](SCHEDULING_RELEASE.md). Three independent correct answers cap ordinary current-field practice for the day; freed turns can preview up to three next-field words at sufficient recent accuracy. The final fallback is one faster exposure step. This replaces the earlier generic six-new-words-per-challenge planning rule.

Aim for a productive level of difficulty rather than a fixed error quota. Working hypothesis: familiar-word unassisted accuracy around 85–90% is a reasonable starting calibration range. The often-cited 85% rule does not directly validate an exact failure rate for young children's four-choice reading practice, so measure retention, frustration, and return behavior rather than optimizing blindly to one percentage.

## 9. Speed / movement system

The implemented movement ladder is Crawl (self-paced), Walk (1800 ms), Stride (1500 ms), Jog (1200 ms), Run (950 ms), Ride (600 ms) and Fly (350 ms). Crawl through Run are free choices. Ride/Fly require the existing final-form, free-campaign-completion and expansion-entitlement gates. Growth itself is XP-only; completing the free campaign does not automatically grant the rideable form. See [point 7](#point-7-optional-speed-guidance-and-quick-words--24-september-2026).

Movement level changes exposure speed, not curriculum difficulty or enemy strength. The story remains completable at the free movement levels.

### Speed nudges

Offer a slower/faster suggestion between battles, not while the child is reading. Initial calibration rule:

- suggest one step slower when recent independent accuracy on familiar words is below roughly 80%;
- suggest one step faster when it is above roughly 90% with enough observations;
- the child can decline either nudge;
- concentrated errors on specific words should trigger word-level support before assuming global speed is the problem.

The implemented rule uses 20 eligible recent answers, strictly below 80% for slower and strictly above 90% for faster, with word-concentrated misses handled first. Point 7 defines the full eligibility and offer-spacing rules. These are calibration choices to evaluate through real play, not measured learning outcomes.

## 10. Battle difficulty, routes, checkpoints, and defeat

The hero always has three hearts.

Enemy strength is primarily enemy health:

- minimum three hearts;
- stronger is always possible by adding hearts;
- weaker means fewer hearts, down to the three-heart floor.

Each independent correct answer removes one enemy heart. Each independent wrong answer removes one hero heart. Helped/teaching interactions do not deal damage.

### After every battle

After a victory, offer two visual choices:

- same-strength opponent;
- stronger opponent.

After a defeat, offer:

- same-strength opponent;
- weaker opponent, down to the three-heart floor.

Use large enemy portraits and simple visual strength cues rather than instructional text. Same strength usually means a different creature so repetition is avoided.

### Checkpoints

Secure a checkpoint after every two victories.

A defeat rolls campaign progress back to the previous checkpoint, so an unsecured earlier victory can be lost. This is intentional: defeat needs to hurt.

Never roll back learning observations, retention evidence, practice credit, unlocked permanent content, or dragon growth. Quitting or pausing is not defeat and should preserve the exact current fight state.

## 11. Enemy library

Build toward at least 100 different enemies / mythical-creature types so the child does not repeatedly see the same opponent.

Creature identity, size variant, and health are separate properties. Examples can include baby troll, adult troll, and giant troll, as well as unrelated creatures. Size should visually matter without determining the learning difficulty by itself.

Avoid recently encountered creature types when alternatives exist. Rematches may deliberately preserve identity when narratively useful.

Do not build 100 pieces of final art before the core loop works. Start the implementation with a small reviewed set and make the data model capable of scaling to the full library.

## 12. Chapter progression, reliability, and retention

The first free campaign contains five chapters and approximately 30 fixed targets. Each chapter is one map field with the ten-minute, three-win and number-duel requirements in section 8. The campaign learning/finale objectives are:

- all chapter targets have been introduced;
- at least about 80% meet the current reliability criterion under independent checks;
- the final chapter encounter is won.

Do not require a 30-day wait before story completion. There is no elapsed-day retention gate for story completion; the ten-active-minute minimum per chapter still applies.

Retention is continuous. Continue checking previously successful words over at least 30 days using expanding gaps such as roughly 1, 3, 7, 14, and 30 days. A miss shortens the next interval and may trigger more support. A chapter remains completed even if a later retention check fails; the word returns to practice.

Do not call short-term success long-term mastery. Record actual time since the last exposure/help when interpreting retention evidence.

## 13. Curriculum and distractors

Use reviewed curriculum pools rather than a pure frequency ranking. Frequency is one input alongside early-reader relevance, BlitzWord's forest/fantasy world, sound-spelling coverage, and usefulness for assessment and teaching moments.

Use these references when reviewing English vocabulary:

- 2024 Children's Picture Book (CPB) frequency data;
- Dolch 220;
- Fry 1,000 Instant Words;
- Mentava Alphabet Sounds examples for phonics/sound-comparison coverage.

Mentava is a source of candidate examples, not a validated BlitzWord curriculum or assessment.

### Working curriculum pools

| Tier | Working size | Role |
|---|---:|---|
| First free campaign | About 30 fixed targets across five chapters | Practice/review order adapts within the maintained chapter structure |
| Core curriculum | 200 words | First major pool combining high-frequency words, theme vocabulary, and broad sound-spelling coverage |
| Broader curriculum | 1,000 words | Future expansion pool; its first 200 are exactly the Core 200 |

These sizes are content pools, not developmental milestones. The assessment may sample from the wider reviewed curriculum rather than only the child's free-chapter words.

Current Core 200 coverage in [`curriculum/BLITZWORD_CURRICULUM_200_1000.xlsx`](../curriculum/BLITZWORD_CURRICULUM_200_1000.xlsx):

- all 100 inspected CPB top-100 words;
- 144 of the Dolch 220;
- 121 of Fry's first 200;
- 65 Mentava examples;
- at least one example from all 68 extracted Mentava sound/comparison groups.

After the approved theme filter, every extracted Mentava group still retains at least three usable examples. If the word lists change, re-check this coverage rather than assuming it remains true.

### Theme filtering

Default rule:

- prefer words that fit naturally into a fantasy/forest/adventure world;
- allow ordinary relationship/life words where child relevance clearly outweighs theme mismatch;
- generally exclude modern technology, transport, institutional, and technical vocabulary when good alternatives exist.

Approved exceptions and exclusions:

| Word | Decision | Reason |
|---|---|---|
| `car` | Keep | Familiar, useful, and valuable for assessment |
| `mom` | Keep | Highly child-relevant |
| `dad` | Keep | Highly child-relevant |
| `school` | Keep in 1,000, not Core 200 | Important everyday vocabulary despite weak theme fit |
| `bus` | Remove | Modern transport; not important enough to break theme |
| `train` | Remove | Modern transport; not important enough to break theme |
| `doctor` | Remove | Profession does not justify the theme break |
| `plane` | Exclude | Modern transport and unnecessary for coverage |
| `phone` | Exclude for now | Modern object; insufficient reason to override theme |
| `computer`, `android`, `astronaut`, `helicopter`, `taxi`, `x-ray`, `robot`, `rocket`, `whiteboard`, `vacuum` | Exclude | Clearly outside the current world and unnecessary for phonics coverage |

Keep content rules and reviewed vocabulary fixed, but personalize which words the child starts with, their order, repetition, review timing, teaching support, and which sound-spelling patterns receive extra attention. Do not generate unrestricted bespoke vocabularies per child.

For each independent four-choice check, distractors should reduce guessing by superficial word shape. Prefer close real words; use reviewed pseudo-words where needed. Do not use pictures, colours, answer position, or mask length as shortcuts, and never allow a pseudo-word to collide with a real curriculum word.

Optional phonics side quests can come later if repeated pattern difficulties justify them between encounters. Do not build a comprehensive phonics engine into v1.

Curriculum artifact: [the maintained workbook](../curriculum/BLITZWORD_CURRICULUM_200_1000.xlsx).

## 14. Character and asset consistency

Character coherence is a product requirement, not optional art polish.

The authoritative character-bible references are now:

- Boys: the approved `assets/rowanfire-boys-2026-09-21.png` lineup; it supersedes the male figures in the original Option 17 sheet.
- Girls: the approved Option 17 female identities preserved in `assets/hero4.webp` through `hero6.webp` and `assets/forest-characters.webp`.
- Pip: the Ember Guardian production references, including `assets/pip.webp`, `assets/pip-growth.png` and the four approved evolution frames.

Use the applicable sources together for any scene containing hero and Pip. [The reference guide](BLITZWORD_REFERENCE_IMAGES.md) records paths and provenance; historical bible/mockup filenames are not required attachments. The shared production palette is forest green / natural wood / leather / cream with ember-red and warm orange accents. Red should connect the heroes to Ember Guardian without overwhelming the forest setting.

Extend the bible over time with expression/pose references and scale references where needed, but do not redesign the core identities.

For every new generated asset, use the relevant approved references as the visual source. Reject assets that are attractive but depict a different-looking hero or dragon.

Enemy variety can be broad, but recurring enemy families should also be internally coherent. A baby troll, adult troll, and giant troll should clearly belong to the same creature family while differing in size, proportions, age cues, and details.

Do not bake child-facing text into illustrations. UI text, target words, teaching sentences, highlights, health, and controls are separate interface layers so they remain readable, localizable, and testable.

## 15. Commercial structure

This is later-phase product direction, not implemented purchasing or an entitlement granted by the web preview. Current web play includes the Core 200, with no native package or purchase/restore flow. The older free-chapter/personalized-target outline below is not the current chapter allocation, and its rideable-growth promise is superseded by XP-only point 9. Pricing and launch settings remain undecided.

Meaningful free chapter:

- onboarding;
- assessment;
- teaching;
- continuing practice;
- about 20–30 personalized active targets;
- parent summary;
- dragon grows to rideable stage.

Paid expansion:

- one-time purchase direction;
- initially expands toward the reviewed Core 200;
- unlocks Ride and Fly after the free chapter has been completed;
- includes additional self-contained content rather than requiring a subscription to retain already unlocked practice.

The 1,000-word list is a future curriculum pool, not a currently approved App Store package or pricing promise. Defer commercial packaging beyond the Core 200 until usage, learning, retention, and payment evidence justify it.

The commercial validation plan is to reach actual App Store users quickly, run modest acquisition tests, observe installs/activation/return/learning/friction/payment, and iterate the product every few days. Do not substitute beta signup counts for real installs and active use.

## 16. Parent and child separation

Child UI: minimal text, large visual choices, voice where useful, no purchase decisions.

The implemented Parents area includes learning evidence, progress, difficult words, recent practice, retention, sound settings and save-file backup/restore behind its arithmetic gate. Purchase/restore controls belong to the later commercial phase; save backup/restore is already implemented.

Do not market BlitzWord as diagnosing or treating dyslexia or other conditions.

## 17. Data and analytics

Keep learner observations language-specific. Separate raw observations from inferred ability state.

Track at minimum:

- task type;
- target;
- alternatives;
- first response;
- correctness;
- exposure duration;
- response time;
- assistance/support;
- date/time;
- battle context where useful;
- teaching exposure;
- later independent checks.

Measure whether teaching transfers to later ordinary reading items. Do not treat performance inside a supported teaching scene as proof of independent learning.

For commercial validation, distinguish installs, assessment completion, first-battle completion, active sessions, return, learning/retention, friction, and payment. Avoid unnecessary child identifiers in analytics.

## 18. Current implementation sequence

The original web sequence below is historical and completed through its gameplay stages, with chapter timing and terminology superseded by later updates. Current work is narration completion and device/listening verification. Native packaging and commercial launch remain later work and require their own authorization; see [current status](CURRENT_STATUS.md#outstanding-work-and-ownership).

1. Build the approved onboarding/start screens and local child profile.
2. Build one complete selected scroll battle encounter with save/resume, correct/wrong feedback, victory/defeat, enemy health, and one reviewed teaching moment.
3. Build the adaptive assessment handoff.
4. Connect encounters into the roughly seven-minute challenge, opponent choices, speed nudges, and two-victory checkpoints.
5. Connect the 30-word free chapter and dragon growth.
6. Package for iPad/TestFlight and verify persistence, offline behavior, audio, orientation, parental gate, privacy, and one-time-purchase restoration.
7. Launch publicly only after explicit release approval, then run small acquisition tests and iterate from observed use.

## 19. Historical open questions from the initial specification

This list records the original decision backlog, not current missing features. Implemented assessment, teaching, speed and curriculum rules should not be reopened from this list. See [current status](CURRENT_STATUS.md) for remaining work and its ownership.

- Final exact chapter-one 30-word set.
- Exact teaching-trigger thresholds and how many retries before/after teaching.
- Exact assessment stopping rules and parent result presentation.
- Exact mapping of Crouch/Walk/Run/Ride/Fly to exposure durations.
- Exact enemy-heart progression step after choosing stronger/weaker.
- What the second option becomes when the child is already at the three-heart enemy floor.
- Final paid expansion price and App Store launch market/campaign settings.
- Final art production pipeline for the 100-enemy library.

## 20. Historical milestone: Implemented practice slice — 21 September 2026

Option A adds persistent returning play and one approximately seven-minute challenge using six reviewed targets: sat, rock, tree, green, fox and cave. This milestone does not complete the planned 30-word free chapter. The remaining curriculum and all older observations are preserved; this practice selector is limited to words with reviewed teaching support.

Implemented: Continue adventure; individual answer saving; unfinished battle and assessment resume; pause/background handling; recoverable local saves; teaching/correction support records; two-intervening-answer rechecks; due review gaps; session summaries; free self-paced demonstration; optional self-paced campaign practice; and idempotent checkpoint/defeat handling. At the three-heart floor, defeat offers one same-strength opponent rather than a duplicate weaker choice. The approved assessment item pools and numeric adaptation rules are preserved, with interrupted attempts separated from independent calibration evidence.

Four Pip illustrations live in `assets/teaching/`. See `TEACHING_SLICE.md` for exact word-to-sentence mappings, asset paths, prompts, review and limitations. These replace the portrait-on-rock teaching placeholder for this slice. The male and female hero references remain unchanged. Pip is now visible beside the hero portrait in battle.

The broader chapter, full battle-scene artwork, dragon growth, parent reporting, remote analytics, native iOS packaging, payments and offline asset caching remain unimplemented. Browser speech highlights the spoken target when word-boundary events are available; voices without those events retain the static highlight and underline.


## 21. Historical milestone: Forest and first-battle repair — 21 September 2026

The opening form now includes hatchling Pip in an illustrated mystical forest. Native name entry disables autocorrection and spellcheck. Battle uses full-length approved hero appearances, Pip and Thornling with separate word, answer, health and pause regions. Four equal choices and a separate `?` help action are always available during selection. Help is supported practice without damage.

Wrong answers open the reviewed teaching image and highlighted sentence directly, replacing the intermediate correction modal. The optional demonstration has a maximum of seven total attempts including the guided example, then a saved handoff to the existing reading check. Victory and defeat can end it sooner. Assessment logic is preserved. Natural-pitch device narration and narrator choice replace pitch-shifted speech; prerecorded narration is still pending. See `FOREST_REPAIR.md` for assets, verification and limitations.


## 22. Historical milestone: First-session feedback implementation — 21 September 2026

The latest corrections are recorded in `FIRST_SESSION_FEEDBACK.md`. They supersede the previous direct-to-example wrong-answer flow. Show the actual selected word and correct target first, hold for a tap, then show the teaching illustration. Add a clear narrated/visual reading-check entry and Chapter 1 encounter handoff without changing assessment scoring. Show introduced-word progress toward 30 separately from checkpoints and retention. The current six-word slice cannot yet complete that chapter.

Use distinct visual creature choices with short labels and hearts. Never repeat a won creature more than twice consecutively; the current five-species selector avoids the two most recent encounters altogether. Size grows with health within safe scene bounds, without changing reading exposure. Directed attacks and impact effects occur only after an answer. Remove the generic Adventure combat label and provide Home with exact save/resume behavior.

The supplied Core 200 excludes `sat`. New practice uses `on` and “Pip is on the rock.” Preserve historical `sat` evidence and pending saved teaching/questions. Do not infer that example words from reference art automatically belong in the early curriculum.


## 23. Historical milestone: Campaign map and Pip growth — 22 September 2026

This update supersedes the earlier no-map direction and introduced-word chapter meter. Campaign Home is an illustrated map of Lantern Trail, Fox Crossing, Old Grove, Lantern Ruins and Hidden Nest. Chapter progress counts permanently explored story areas out of five; local word/practice progress and checkpoints remain visible separately. Reading-check completion explicitly introduces the map before the first campaign word. Home always preserves the exact current activity.

The first two independent correct campaign answers per target award 5 XP each. Demo, assessment, help and speed give no extra XP. Repetition beyond those two credits cannot farm XP. Mistakes and defeat never remove XP or an earned form. XP is a game reward, not a reading score or proof of retention. Existing qualifying campaign observations recover credit once on migration.

Stages: Hatchling 0 XP; Young 60 XP; Growing 180 XP; Rideable 300 XP plus final Chapter 1 victory. Forms follow the approved Ember Guardian bible. Cleared areas stay cleared after later practice errors. Current first-area completion requires all six words introduced, at least five with two practice successes, and the two-win checkpoint secured. The planned finale additionally requires all chapter words introduced, at least 80% with two practice successes, and all playable areas explored.

Only Lantern Trail has reviewed playable content. Four later locations are previews labelled Coming soon. The current practice slice can reach Young Pip; it cannot complete the chapter or reach the two later stages through repeated battles. The remaining 24 words, their teaching support, area-specific encounters and final boss remain future work. The existing teaching illustrations continue to depict hatchling Pip; later-form teaching variants are not part of this update.

See `CAMPAIGN_MAP_AND_GROWTH.md` for art provenance, verification and deployment status.


## 24. Historical milestone: Active play release — 22 September 2026

The user's latest requirements supersede the prior six-word limit and rapid/capped growth rules. All five Chapter 1 places now have six fixed Core 200 targets and teaching support. The final guardian is playable, followed by unlimited review across the chapter. Correct independent review answers continue to earn 1 XP. At most six new targets are introduced per approximately seven-minute challenge; challenges can be repeated today without a daily cap.

The first new dragon form requires 250 XP, 250 interaction-confirmed practice minutes and 14 elapsed days since practice began. All conditions are required. Later forms require 750 and 1,500 XP/minutes respectively, remain subject to the 14-day minimum, and rideable Pip additionally requires chapter completion. Previously earned forms/XP are preserved. This explicitly replaces the earlier expectation that a single day's chapter completion grants a rideable dragon.

Parent reporting uses an idle-aware local activity ledger, with older foreground/waiting totals kept separate and excluded from growth. Unconfirmed intervals are discarded on 30-second inactivity, blur/background or suspended timers. The dashboard explains conservative undercounting and device-local scope. See `ACTIVE_PLAY_RELEASE.md` for exact rules, curriculum provenance, artwork and tests.

## 25. Historical milestone: Child interface and multiplication revision — 22 September 2026

The user's post-release feedback requests less text and fewer simultaneous progress measures. The campaign home now emphasizes one selected destination and its play button; a compact Pip portrait, XP badge and single growth bar remain. Detailed growth gates, practice counts and historical timing belong in Parents. The child growth bar is limited by every remaining gate, not XP alone. Setup labels and continuation buttons are shorter. The fixed neutral mask is a static galaxy identical for every word. Normal correct feedback uses the revealed word and combat reaction, without the green check badge. Supported answers remain labelled Practice.

Pip now hops and sends a small ember alongside selected successful attacks, celebrates a final blow, and recoils from enemy attacks. These effects never change damage and only occur after an answer. Reading exposure and answer selection remain free of combat animation and one-shot effects. The continuous battle mix described below supersedes the earlier soundscape silence rule. Reduced motion suppresses movement.

Crawl, Walk and Run are selectable on the map and in pause. Crawl is untimed; Walk uses 1,800 ms; Run uses 950 ms. Until the child chooses a mode, the existing assessment-calibrated exposure is retained. A saved question keeps its recorded exposure; changes apply to new questions. Ride (600 ms) and Fly (350 ms) additionally require rideable Pip, chapter completion and the existing paid-expansion entitlement. No payment flow or entitlement grant is added. Assessment itself is unchanged.

New multiplication rounds award +1 point per correct answer and −1 per wrong answer, including scores below zero. PR and enemy targets use net score. Correct responses still grant permanent XP; mistakes never subtract earned XP, story progress or reading observations. Existing PRs are preserved, and a round already in progress retains its original scoring rules until it finishes. A remaining-time ring supplements the numeric countdown. A synthesized forest ambience and gentle last-ten-second tones can be muted; ambience/effects fade for narration, pause, background and reading selections.

The missing shared teaching illustrations were a confirmed SVG visibility bug: setting the SVG's `.hidden` property did not remove its `hidden` attribute. Visibility now toggles the actual attribute. All existing artwork remains unchanged.

The fullscreen button introduced at this milestone was removed at the user’s request on 23 September 2026 because it was buggy. The app has no fullscreen toggle, fullscreen event handlers or unavailable-fullscreen notice. The existing web manifest and Home Screen presentation remain unchanged; the operating system controls the status bar. No learner data is cleared or moved to another browser context.

Core 200 means a mixed curated curriculum, not the 200 most frequent words. In the supplied workbook, water is Fry 84; bird is included for phonics and theme. The current chapter's 30-word selection is unchanged.

Prerecorded deep male narration is still pending. `NARRATION_CORPUS.json` contains the complete deduplicated fixed-word, teaching-sentence, correction and encounter recording list. `node scripts/prepare-narration.cjs` reproduces it without making network calls. No recordings or premium narrator are claimed until generation, listening review and integration have completed.

### Recorded narration update — 22 September 2026

The recorded-voice milestone added 165 local MP3 clips in a British adult male voice for its then-current content. This is not complete prerecorded coverage of the now-playable Core 200 or new stories. Playback waits for audio completion before attacks, stops on pause/Home/background, and uses browser speech for unrecorded text or playback failure. Recorded target highlighting stays static because verified word-boundary timing is unavailable. Expanded narration remains outstanding. See [narration history](NARRATION_RELEASE.md) and `NARRATION_GENERATION.json` for provenance and limits.


## 26. Historical milestone: Core 200 and combat-boundary update — 22 September 2026

The latest requested release makes all 200 approved words playable in seven chapters and 35 places. See `CORE200_RELEASE.md` for exact curriculum, progression and verification. Battles, including the demo, now end only at zero hero or enemy health. The seven-minute target waits for the combat boundary. Pausing preserves the living encounter. Chapter completion opens the campaign map. Creature variants have fixed three-point HP intervals and recent appearance families are excluded from opponent choices.

The child interface uses a short chapter title, a single control toolbar, a visible hero map marker, a static warm spiral, immediate speed selection, and a bundled reading font without ligatures. Tapping Pip shows separate XP, active-minute and elapsed-day meters. The after-battle screen shows total earned XP and XP progress towards growth. Existing growth gates and paid movement locks remain intact. No learner data is reset, assessment redesigned or purchase entitlement granted.

## 27. Success XP and chapter pacing — approved 23 September 2026

This section records the 23 September chapter rules and original XP calibration. Point 9 later supersedes its growth thresholds, fractional reward calculation and calendar projections; the chapter minimum/objectives remain. See `SUCCESS_XP_RELEASE.md` for that milestone’s rules and `XP_CALIBRATION.json` for reproducible model outputs. A battle is one enemy; a chapter is one map field; a campaign is one map of five chapters. New chapters require at least ten interaction-confirmed active minutes and finish only at a resolved battle/duel boundary. Three reading victories, a completed number duel and the existing word-practice objectives are required; extra battles fill a chapter that is still under ten minutes. One chapter per day is the visible goal. Seven campaigns retain all 200 words, and review chapters continue afterwards.

Evolution depends only on cumulative XP: 3,000 / 8,900 / 13,400. Remove minimum minutes, elapsed days and campaign completion from evolution, while preserving earned forms and separate movement/purchase locks. The first evolution unlocks the child's choice of companion name. Correct unaided reading earns 3 XP, with once-only new-word and delayed-retention bonuses, reliable faster-review bonuses and chapter accuracy rewards. At ten active minutes each local date, award 20 XP once and apply a visible but small ×1.75 multiplier to correct-answer XP for the rest of the date. No penalty is imposed for stopping early or missing a day. No new pet is added yet.

The model aims for evolution at two, six and ten weeks at fifteen active minutes daily, and full growth in three weeks at forty-five minutes daily. These are calibration targets, not time gates or guarantees for individual children. At that checkpoint distinct field artwork and expanded narration were still pending. All 35 backgrounds and the 34 story picture checks have since shipped; only narration completion/device review remains open. See [current status](CURRENT_STATUS.md).

## Chapter-story implementation — 23 September 2026

This historical milestone introduced a short illustrated narration followed by one simple untimed sentence and child confirmation. The confirmation was subsequently replaced by the approved two-picture check in point 6; see [current story rules](#point-6-approved-sentences-and-picture-checks--24-september-2026). The initial guided encounter keeps its existing introduction; the other 34 map fields have saved story transitions. Pause, Home, Rest and reload preserve the phase and pending battle. Optional Listen records help without creating mastery, XP or chapter-time evidence. The chosen dragon name is used in the story. Map/progress labels distinguish the campaign from the chapter within it. Existing approved scene and character art and the current speech fallback are reused. See `CHAPTER_STORIES_RELEASE.md` for migration and verification details.

## Soundscape and remaining work — 23 September 2026

The adaptive forest soundscape is implemented and deployed, including scene music, result cues, speech priority, cancellation and independent saved controls. It is separate from the unfinished expansion of prerecorded narration. See [soundscape behavior](SOUNDSCAPE_RELEASE.md).

The twenty selected enemy families and all 35 chapter backgrounds were subsequently deployed. Creature-specific health ranges and group/age variants remain proposals; they were not approved for implementation by the art workstream. An additional dragon is an optional future idea. This documentation update adds no gameplay or audio changes; [current status](CURRENT_STATUS.md) tracks the remaining work and verification limits.

## Chapter scenery — 23 September 2026

All 35 chapter fields have distinct setting artwork selected by stable area ID. Existing campaign-map scene indices remain unchanged. Encounter, battle, story, result and duel presentations use the saved active chapter, including old encounters across campaign boundaries. Artwork loads on demand and falls back to the forest without delaying reading. This is presentation only: learner saves, curriculum, scoring, XP, shields, narration and enemy behavior remain unchanged. See [chapter scenery](CHAPTER_SCENERY_RELEASE.md) for the complete mapping and verification status. This supersedes earlier statements that distinct field scenery is outstanding.

## Durable saves: backup file — approved 23 September 2026

Point 1 of the approved plan makes learner saves durable in two releases: first a backup file (1b), then a smaller save (1a). The backup file works as follows.

- Parents → Backup → **Save backup file** writes the whole save to one dated JSON file, `blitzword-backup-<child name>-<date>-<time>.json`, with the export time and build marker. On a touch device that can share files, such as an iPad, it opens the share sheet, which offers Save to Files. Otherwise the browser downloads the file. Cancelling the share sheet saves nothing.
- **Restore from file** accepts only a BlitzWord backup file or a raw BlitzWord save. It refuses other files, backups from a newer version and unreadable saves, and then changes nothing. Before anything is replaced, the parent sees the name, XP, introduced words and cleared chapters of both the backup and this device, plus a warning when the backup has less progress, and must confirm.
- A confirmed restore first keeps the current save in `blitzword_state_v1_before_restore`. Only the latest kept copy is retained. If storage is too full for the copy or the restored save, nothing changes. The app then reloads from the restored save.
- Reset this device also erases the kept copy.
- When a save fails because storage refuses it, the grown-up save-problem dialog also offers **Save backup file** for the progress still in memory. It is not offered when another tab saved newer progress or when the save cannot be read.

## Durable saves: smaller save (point 1a) — approved 23 September 2026

The save keeps recent raw history and rolls older history into totals, so it stays small however long the child plays.

- Raw lists keep the newest 500 reading answers, 200 teaching events, 200 help events, 50 completed sessions and 30 number duels. Per-word summaries (`learning.words`), the assessment, current activity, XP, forms, chapters, shields, settings and the daily time and XP ledgers are kept in full.
- Older entries roll, oldest first, into `archive`:
  - daily and per-word answer totals: attempts, unaided, correct, helped, due reviews and their results, retention by gap since the word was last seen (1, 3, 7, 14 and 30+ days), response-time count, sum, minimum and maximum, and quick answers (correct in under 1.5 s at 950 ms or faster);
  - per word: counts of each wrong choice, which letter positions differed (start, middle or end; vowel or consonant) and teaching and help counts;
  - session totals, including the older time kept for Parents;
  - for number duels, every duel's time, score, correct, wrong, target and result, plus per-fact totals.
- Parents totals and answer counts include the archive. Existing saves migrate in place on load; nothing earned or set is lost.
- The play tick saves at most every 10 seconds. Answers and other meaningful events, pause and leaving the page save at once. The new save is written before the previous one is copied to `_backup`, so a smaller save frees space first; if the copy does not fit, the older backup stays.

## Dragon evolution scenes — approved 23 September 2026

Each earned growth milestone gets a warm glow-and-reveal scene inspired by creature evolution games, preserving Pip’s Ember Guardian identity. Four original generated character images cover the existing four forms. The scene waits until combat and any pending number duel are resolved. A recorded introduction leads to Watch; one continuous glow and reveal lead to two short untimed sentences. The child reads first, may tap Listen, and confirms with I read it. First growth offers naming afterwards. Later scenes use the chosen name in their heading; first-person reading lines keep their recordings valid after renaming.

Pause, Home, Rest, backgrounding and reload preserve the current phase. Reduced motion omits transformation movement; Skip advances the animation to reading. Existing earned forms, XP, learning records and movement/entitlement locks are preserved. Evolution, reading confirmation and replay award no XP, mastery or active-play time. Watch again in the growth panel replays an earned form at a safe boundary. See [evolution scenes](EVOLUTION_RELEASE.md) for assets, recordings and verification.

## Layered enemies and health timing — 24 September 2026

Twenty user-selected base enemy families now use painted parts with articulated 2D attack, hit, defeat and celebration reactions. Enemies stay still during reading and answer selection. Damage remains committed immediately; visible health and shield consumption wait until the shared attack impact timing. Existing strength tiers, learner saves, narration fallback and scoring remain compatible. See [the layered enemy release](enemies/LAYERED_ENEMIES_RELEASE.md) for the selected identities, assets and limits.

The suggested creature-specific HP ranges, shared-health group encounters and distinct baby/young/adult forms remain proposals; this release keeps the existing tier-based health rules and three player hearts.

## Rotating wrong answers (point 2) — approved 23 September 2026

Practice questions no longer show the same three wrong answers every time.

- Each practice word has 5–7 reviewed wrong-answer candidates. Each question draws three.
- Every drawn set passes all of these:
  - the target's first letter alone, last letter alone, first and last letters together, and word length each match at least two of the four options;
  - every letter of the target appears, at the same position, in at least one wrong option, so one letter cannot solve the question (same-position sets such as night/light/right/might are rejected);
  - picking the option most like the other three (lowest total edit distance, a swap of neighbouring letters counting as one edit, ties split evenly) finds the answer at most half the time.
- Across all words, that "middle option" guess finds the answer no more than about 35% of the time. To keep it low, a word with two or more sets where the guess works at most one time in three draws only from those sets.
- Real words and pronounceable made-up words are preferred. A made-up word is never a curriculum word (the workbook's 1,000 words), and rude, violent or unkind words are never used.
- "a" and "i" are shown with three other single letters.
- A question already saved keeps its options.
- The later fair fixed-set decision closes the reading-check choice: all 26 reviewed sets are deployed, with shuffled positions. See [the accepted follow-up](#fair-fixed-reading-check-choices--24-september-2026).

## Scheduling, daily cap and refill (point 3) — approved 23 September 2026

The user authorized point 3 on 24 September 2026. A correct recheck of an overdue established review within 24 hours of help schedules the word for 24 hours after that help, without advancing its retention stage.

After three independent correct practice answers on the local date, a current-chapter word is skipped in ordinary selection for the rest of that date. Freed turns go in this order: due reviews; introduced older words not seen today, least recently seen first; up to three distinct words from the next chapter while recent independent accuracy is at least 80%; then current-chapter words at one faster exposure step. Next-chapter words count as introduced, keep the three-word preview limit across sessions and use the same three-correct daily limit during preview practice. Here a chapter is one map field, including when that field crosses a campaign boundary.

The exposure ladder is 2200 / 1800 / 1500 / 1200 / 950 ms. Faster refill is per question, one step from the current selected/calibrated speed; it does not change the saved speed setting. Crawl stays self-paced, Run does not exceed 950 ms through refill, and Ride/Fly keep their existing entitlement locks. An already saved question keeps its exact exposure and options. The next date permits ordinary practice again.

The existing last-eight-independent-answer accuracy measure, two-intervening-answer help spacing, ten-minute chapter minimum and all chapter objectives remain. Previews do not unlock the next chapter. Daily counts persist independently of raw-answer compaction; legacy counts are recovered from retained evidence without changing existing progress or inventing missing archived evidence. See [implementation, tests and reproducible simulation](SCHEDULING_RELEASE.md).


## Contrast corrections and adaptive teaching (point 4) — authorized 24 September 2026

After a wrong choice, show the chosen word above the target on the existing correction parchment. Align their letters and highlight only differences in both rows; an inserted or omitted letter has an empty aligned slot. Speak both words: “You chose rack. The word is rock.” Replay repeats the comparison without another hit. The correction waits for Continue.

The saved `q.needsTeaching` decision controls Continue: show the full picture card only for a newly introduced question, at least two consecutive independent misses, or a due review answered incorrectly. A first miss on an already introduced word stays brief, including when the word has no independent correct answer yet. Help (“?”) and interrupted/supported wrong answers apply the same conditions but do not increment the independent miss count. A help request shows only the target, with no invented chosen word or difference highlights. Supported correct answers never open a correction or count as mastery.

Correction/help still records support and requires two intervening items before a recheck. Health, shields, XP evidence, chapter objectives and saves keep their existing rules. Narration finishes before an attack; replay, Continue, Pause and Home cancel pending reactions safely. A last-heart miss still resolves the battle after its correction/teaching route.

New combined contrast phrases use the existing device-speech fallback. The approved shield prefix still plays first; target-only help can reuse the existing “The word was X.” recordings. No narration recordings or approved artwork are replaced. The separate narration workstream can record the stable new wording later.


## Point 6 review gate — 24 September 2026

This historical preparation gate is closed. The user subsequently approved all 34 child-read story sentences and picture pairs and authorized their implementation in PR #66. [The approved set](STORY_SENTENCE_REVIEW.md) and the following section record the accepted content. The existing approved point 6 behavior remains: use earlier chapter targets, permit at most one tap-to-hear untaught word where necessary in early chapters, show a two-picture meaning question, reveal the correct picture after a wrong choice and continue, award no XP, and record the result for Parents. All 34 sentences and picture pairs must be approved before gameplay implementation.


## Point 6: approved sentences and picture checks — 24 September 2026

The user approved all 34 sentences and their exact picture pairs in [PR #66](https://github.com/Ikarus-eth/Blitzword_app/pull/66) and authorized implementation. This supersedes the pending content-approval status above. [The complete set](STORY_SENTENCE_REVIEW.md) is unchanged from the reviewed PDF: 31 sentences use only targets from strictly earlier map fields, plus the dragon name; entries 01, 03 and 04 each allow one tap-to-hear word: jump, the and look. Some early lines recap familiar scenes because new location and grammar words have not yet been taught.

The existing spoken introduction remains, followed by the untimed sentence and “Which picture shows what you read?” Two approved pictures appear without reviewer labels. Their positions are shuffled once and saved with the sentence, so returning to the same scene preserves the question. The sentence never plays automatically. Listen speaks the whole sentence; an underlined exception word speaks only that word. Each kind of listening is saved separately.

The first picture choice is recorded immediately and cannot be replaced by a second tap. Either choice reveals the matching picture and offers Continue; a wrong choice never requires a retry. The scene awards no XP, health change, word mastery or chapter time. Parents shows first-choice outcomes and listening, explicitly noting the 50% chance level and that these checks do not establish independent reading. Earlier completed confirmations remain completed and are labelled as having no picture check; unfinished old intros/read phases migrate in place, retaining their pending battle and any earlier Listen help.

An unavailable picture or a request that has not loaded after eight seconds offers Continue without fabricating an answer. Save failures retain the existing save-problem flow. Pause, Home, Rest, backgrounding and reopening retain the current scene, choice order, feedback and help. No approved art or narration recordings are replaced. Point 7 still requires the next go.


## Point 7: optional speed guidance and quick words — 24 September 2026

The user authorized point 7 after the verified point 6 release. The approved rules are optional between-battle suggestions using at least 20 recent familiar-word answers, two intermediate exposure steps, correct current-speed highlighting and a per-word quick marker in Parents. The provisional names used for the new steps are **Stride (1500 ms)** and **Jog (1200 ms)**, with a long walking stride and a bent-arm jog as simple line icons. These names/icons are presented for review at this point's stop.

The free choices are Crawl (self-paced), Walk (1800 ms), Stride (1500 ms), Jog (1200 ms) and Run (950 ms). Ride (600 ms) and Fly (350 ms) retain all existing stage, free-campaign-completion and expansion gates. The Speed panel selects by effective exposure, including an unset choice that inherits the reading check. A 2200 ms reading-check result is shown as a highlighted current-pace note rather than falsely selecting Walk; it remains unchanged until the child chooses a speed. Each change affects future questions; even the older self-paced checkbox preserves an already saved question. The per-question faster refill remains independent of the chosen pace.

Initial, tuneable suggestion details:

- Use the latest 20 unaided, uninterrupted campaign answers at the current chosen/calibrated exposure. A word is familiar before the answer if the reading check found it familiar or it already has two independent correct answers. New-word, helped, demo, assessment and different-exposure refill answers do not enter this sample. Existing history has no reliable familiar-at-the-time field, so old saves start collecting new suggestion evidence without discarding any history.
- Below 16/20 correct (strictly below 80%) suggests one available movement step slower. Above 18/20 (strictly above 90%) suggests one faster. At 16–18 correct there is no offer. From the special 2200 ms calibration, the adjacent choices are Crawl and Walk. Crawl can suggest Walk; Run cannot suggest a locked Ride. No automatic setting change occurs.
- If the two words with the most misses account for at least 60% of all misses, suppress a slower-speed offer and keep the existing word corrections and repeated-miss teaching first. This concentration rule is a conservative implementation threshold, not a validated learning claim.
- Save the offer with the battle result. Try, No thanks, or choosing another opponent can continue. After an offer, require 20 new qualifying answers before another. A pace change starts a fresh sample, while selecting the same pace preserves its sample. Pending offers and responses survive reopening; they never interrupt a reading question or a number duel. The sample stays bounded at 20 entries.

Quick means an independent correct campaign answer in under 1500 ms after the choices appear, at a positive exposure of 950 ms or faster, with a finite positive response time and no timing interruption. Parents shows a historical **Quick recorded** marker and the count, separately from **In review**. This is evidence of one or more past quick answers, not a claim of mastery or retained reading. Accurate slow words remain in the existing spaced-review schedule, and quick words also continue to receive reviews. Retained raw answers and the existing per-word archived quick totals provide the evidence without a new unbounded log; earlier archived totals are preserved as recorded. New compaction rejects zero, negative and invalid timings for quick evidence. XP, chapter requirements and saves keep their established rules. Point 8 requires the next go.


## Continuous battle soundscape — 24 September 2026

The user reported that music was audible for only 1–3 seconds between words and requested a better concept and implementation. Battle audio now establishes one restrained forest background for the whole encounter: the existing plucked/padded bed continues through fixation, word exposure (including untimed reading), masking, answer choices, correction and combat. These phases do not restart the loop or increase its level. Battle flute and percussion remain quietly in the background instead of returning at full strength after each answer.

Spoken battle feedback smoothly lowers music and forest ambience to 40% of their current mix level and then recovers slowly; it does not switch them off. One-shot effects remain blocked throughout unanswered reading and narration, and queued effects are cancelled when either begins. Teaching, the reading check, chapter-story reading and evolution reading retain their quiet presentation. Pause, backgrounding, mute, Quiet play and saved independent volume controls still override the background. No learner records, curriculum, answer timing, XP, narration recordings or artwork change.

See [the soundscape release](SOUNDSCAPE_RELEASE.md) for mix settings, checks and deployment status.


## Point 8: parent learning view — 24 September 2026

The user authorized point 8 after the verified speed-guidance release. Parents keeps the existing arithmetic gate and now puts learning first, with sound settings at the bottom. This is a reporting change: no learning schedule, reward, chapter requirement, assessment choice or learner save is reset.

The map contains the exact 200 playable curriculum words, grouped by the seven campaigns, with search and state/quick filters. Colour is also expressed in text. The states show the highest recorded evidence:

- **New:** no saved introduction, observation, teaching, help or reading-check record, and no higher milestone.
- **Learning:** encountered without a higher recorded milestone.
- **Secured:** the existing saved word milestone (`securedAt` / `wordXPClaimed`), normally three separated independent successes across two battles. Earlier grandfathered milestones remain.
- **Kept after 7 days / 30 days:** an independent correct campaign answer whose saved pre-question gap is at least 7 / 30 full 24-hour days since the most recent known answer or help. A later miss remains visible and returns through the existing review rules; it does not erase historical evidence.
- **Quick** remains the separate point 7 marker and count. Neither quick nor a retained milestone removes a word from review or asserts mastery.

Tapping a word opens its history: practice totals, independent correct/helped answers, teaching/help counts, quick counts, available dates, mix-ups, differing letter positions and all retained individual practice/demo/reading-check/teaching/help events. Archived events remain in totals; individual events that were already compacted are not reconstructed. The first retained practice date is not labelled as a known introduction date. Recent response times and saved gaps are shown when available. Closing history returns focus to its word.

Tricky words shows the ten most common target → chosen pairs and the ten slowest words by mean valid independent response time, with sample counts. Correct and incorrect independent timings are included; helped, interrupted and non-positive timings are excluded. Letter-position counts preserve the existing direct positional comparison: start/middle/end, and vowels a/e/i/o/u versus consonants. One wrong choice can contribute several differing positions; these are descriptive counts, not diagnoses. The selected word's history also shows its own mix-ups and position counts.

Weekly retention shows the current and preceding eleven local Monday–Sunday weeks. Each word contributes its **first qualifying campaign check of that week**, after at least 24 hours without a known answer or help. Correct and unaided succeeds; wrong or helped does not. Interrupted displays are excluded. Later retries or more successful days cannot improve the same word's result for that week. The table shows successful words / checked words and their percentage. A week with no qualifying checks shows no score, not 0%.

New questions snapshot their gap when prepared, using the latest recorded word answer, help and assessment exposure. Leaving an already prepared/shown question and returning days later does not lengthen that snapshot. The answer also saves its local week. The snapshot and week are reporting evidence only. Existing pending questions keep their original choices and timing; without a gap snapshot they do not fabricate a delayed-retention result.

Earlier saves keep their raw records, archive totals and milestones. Earlier answer timestamps or aggregate gap buckets cannot reliably establish whether a question was already shown, whether another exposure intervened, or which word had the first qualifying check of a week. Such records do not generate new 7/30-day claims. Weeks with potentially qualifying older evidence that cannot be resolved are explicitly unavailable. New compacted evidence stores one first outcome per word/week plus the first qualifying 7/30-day dates, preserving the same report after raw-history compaction. It does not recreate missing old events.

The sequence through point 8 was subsequently deployed and verified. Point 9 was separately authorized and deployed as recorded below; point 10 remains parked. This parent-view milestone did not itself authorize either later point.


## Point 9: whole XP and slower growth — 24 September 2026

The user reported about 1,000 XP earned by their son during 30 minutes and wanted progression closer to the effect of 200 XP. The latest decision is to keep whole-number XP, increase Pip's growth thresholds instead of reducing awards to fractions, and use the round cumulative thresholds **15,000 / 45,000 / 70,000 XP**. This supersedes the earlier 3,000 / 8,900 / 13,400 thresholds and their calendar projections. Keep incentives for longer, faster and accurate play, and add a modest reward for consistency. Point 9 is now authorized; point 10 remains parked.

Implementation details within that direction:

- Normal correct independent reading remains 3 XP; after ten interaction-confirmed active minutes on the device's date it earns 5. Reliable Run-or-faster review remains 4 XP before the boost and earns 7 after it, using the existing secured-word and 18-of-20 accuracy conditions. Correct multiplication earns 1 before and 2 after. Boosted totals round to whole XP; the child sees **XP boost**, not a fractional multiplier. Incorrect/helped/demo/assessment answers keep their existing zero-XP rules.
- New-word, delayed-review and chapter-accuracy bonuses remain 8, 4 and 10/5 XP under their existing evidence requirements. Ten active minutes still earns 20 XP once, and the boost lasts for the rest of that date with no play cap. These milestone awards are not boosted.
- At that same ten-minute milestone, award 10 returning XP for each of the preceding six local dates with at least ten confirmed active practice/math minutes, capped at 50 XP today. Recent days may be nonconsecutive. No earned XP is removed for a gap; dates naturally leave the seven-day window. Today must qualify; repeated answers, reloads, midnight and already-awarded old daily rewards cannot duplicate the award. Existing verified recent time can qualify future bonuses, but there is no retroactive payout.
- Ten static visible steps divide the interval to the next growth. The map, result and growth panel reuse their existing progress bars; result/panel text states whole XP to the next step. Steps are a display of existing XP, not extra XP, new forms or learning milestones. No animation is added during reading.
- Existing total XP, historical awards (including old fractional residues), forms, names, queued evolution scenes, saves and entitlement locks remain. New awards and visible XP are whole numbers. An already-earned form retains its old starting XP for its step display until the next evolution; it is not demoted or repriced. Newly earned forms use the new thresholds as their starting points. Chapters retain the ten-minute minimum and learning objectives.

The 30-minute reference guides growth pace; it is not a fixed session payout, a cap or a guarantee for another child. The updated reproducible model varies answer cycle, accuracy and session length, and distinguishes model forecasts from observed play. See [the release record](XP_PACING_RELEASE.md). A spellbook, extra pets, number-duel redesign and other unchosen options are not part of this change.


## Reload, Pip crops, reading check and narration — 24 September 2026

The user authorized all three audit priorities in one batch, with deployment followed by a single completion report: (1) false reload conflict and Pip atlas bleed, (2) fair fixed answer sets for the 26 reading-check items, (3) remaining story/enemy/comparison recordings and synchronized teaching-word highlighting using the ElevenLabs key already stored in GitHub. This supersedes the earlier stop-for-go between these three points. Existing learner saves and parallel work remain protected.

The reload handler must compare the current primary save against the version loaded/written by this page, rather than trusting the value in a delayed storage event. True competing writes and removal/clear still block; notifications for another storage area or backup keys do not. Each grown Pip image clips the atlas to its selected cell, including when the SVG is letterboxed. Artwork, growth thresholds and save formats stay unchanged.


## Fair fixed reading-check choices — 24 September 2026

The user's request to fix all three audit priorities authorizes the recommended fixed-set correction for all 26 reading-check items. Apply the same letter/length and one-letter-giveaway checks as practice and prevent a similarity shortcut from outperforming chance across the check. Keep fixed options with shuffled positions, existing targets/levels/calibration, and saved pending questions. [Reviewed table and validation](ASSESSMENT_CHOICES_RELEASE.md).
