# Pip and the Dark Wizard — chapters 7 and 8 (21 November 2026)

Two story campaigns that form one arc, after the Wizard’s Tower. Rules: [product spec](../../BLITZWORD_PRODUCT_SPEC.md).

## Why
Artus’s report of 21 November 2026, 07:02 Bali time: 41,306 XP, 39 of 46 quests, 456 words learnt (344 kept after a week), 42 learning, 91% of his last 50 answers right, 74 of 75 story questions right first time since 8 November. The parent plans 45–60 minutes of reading a day for seven weeks and asked for:
- two chapters as one arc: a dark wizard takes Pip’s friend; someone seems to help but leads them into a trap; in the fight the wizard accepts that his helper dies while the hero escapes; the wizard is beaten, but it is unclear if he can come back;
- longer stories, harder questions, and the hard words in stories marked so that Artus taps them instead of guessing;
- the creatures Artus voted for on 20 November; pictures from ChatGPT, kept few.

## What
- Chapter 7, Pip and the Dark Wizard (6 quests) and chapter 8, Pip and the Wizard’s Fall (5 quests). Grax (the dark wizard) takes Jet; Rook leads Artus and Pip into a trap; in the great room Grax brings the roof down although Rook is still inside; Pip carries Artus out; Pip’s flame breaks Grax’s staff, Grax vanishes in the storm and leaves a black ring that glows green for a moment at the end. Rook’s loss is told gently and never shown.
- 6,888 words in 22 stories (626 per quest, 40% more than the Wizard’s Tower), 55 questions, 86 new curriculum targets, 169 new glossary meanings, 14 story words outside the curriculum (tower, cage, camel, pelican, okapi, triceratops, chain, horns, boom, storm, ring, staff, octopus, phoenix).
- Text rule as before: every word is a curriculum word, a name, a quest target or a listed story word. 88.7% of words are known from the 21 November report; targets were picked per quest from the unknown curriculum words that occur most in that and later quests.
- Stretch words: the remaining unknown words (and all story words) carry a dotted underline in the reader and the tip says so; this quest’s targets stay unmarked so he reads them himself. At most 7 marked word types per 100 words (test). Taps were already counted and the most-tapped words already return in the next quest’s fights.
- Harder questions: why, how, feelings, what came first, and wrong answers that use words from the same page.
- Eleven voted creatures (Sun Tiger, Red Phoenix, Reef Octopus, Digger Aardvark, Frost Bison, Star Camel, Wave Pelican, Wind Fish, Guard Okapi, Crest Cassowary, Lava Triceratops): Artus’s chosen ChatGPT pictures cut out locally (rembg isnet-general-use, no redrawing) as 512 × 512 RGBA PNGs in `assets/enemies/approved-20261121/`, registered by a roster that extends the October roster. Each is first met in one of these quests. The okapi faces right.
- Creature narration: 44 George lines (name, lore, two encounter lines per creature), ElevenLabs Multilingual v2 through fal.ai with the October voice and settings, 1,613 characters ≈ $0.16 at fal’s list price. `scripts/generate-creature-narration-fal.py`, workflow `creature-narration-fal.yml`, receipts in `docs/narration-november-creatures/`. Not yet listened to by a person.
- Both chapters share one voice set (`voiceSet: 'dark-wizard'`); the reader now uses it for tap-to-hear clips.

## Files
`story-source.js`, `questions-source.js`, `glossary-source.js` → `build-campaign.js` → `assets/adventures/dark-wizard/campaign.js`. `make-voice-request.js` → `voice-request.json` (Kokoro af_heart, free, 1,089 clips). `CHATGPT_PICTURES.md` lists the 22 pictures (one per story part; covers reuse two of them); `add-pictures.py` converts delivered pictures.

## Checks
- `tests/dark-wizard.test.js`: order after the Wizard’s Tower, unlocks, new targets never taught before, text rule, stretch lists, meanings, both chapters play through with saves, creature cut-outs (RGBA 512), lore hints and save identity, every picture present.
- `tests/dark-wizard-browser.cjs`: longest page of all 22 stories at 1180×820, first and last quest also at 820×1180 and 844×390; dotted marks match the stretch lists; no sideways scroll.
- Voice (Kokoro af_heart, free, `story-voice.yml`): 1,089 clips (550 words, 484 meanings, 55 questions). Whisper heard 508 of 550 word clips alone or in a group. Not heard clearly: eye, woke, sea, climbed, felt, ever, a, Artus, no, me, i, oh, she, slept, sat, saw, mouth, Grax, her, face, know, Oren, knows, ago, wants, be, brave, each, first, us, Artus's, called, Grax's, cage, seemed, walls, keeps, air, wall, thinks, choose, across. These need a human listen. The first push-triggered run fell back to the Moon Key request and re-recorded its clips; that commit was reverted and the run was dispatched with the right request.
- Physical iPad and listening are not verified.
