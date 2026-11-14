# Pip and the Wizard's Tower — release record (14 November 2026)

Sixth story campaign, after the Moon Key. Rules: [product spec](../../BLITZWORD_PRODUCT_SPEC.md).

## Why
Artus's progress report of 14 November 2026, 07:40 Bali time (sequence 611, build painted-fire-20261112-r1): 34,128 XP, 32 quests done, Moon Key quest 7 (The Nest) under way, 414 words secured or kept, 23 learning, 43 of the last 50 answers right. The parent asked for another big chapter like the Moon Key with a wise old wizard and a friendly giant, pictures from fal.ai for at most $2.

## What
- `story-source.js`, `questions-source.js`, `glossary-source.js`: the reviewed text. `build-campaign.js` writes `assets/adventures/wizard-tower/campaign.js`.
- Eight quests, 16 stories, 3,575 words, 40 questions, 64 targets, 110 new glossary meanings.
- Known-word check on the 14 November report: 86.2% known, 91.8% with names.
- At 44,000 XP the Pip Grows Up hold still stops new quests, including tower quests (unit test); Artus is likely to reach it during this campaign.

## Pictures (fal.ai nano-banana edit, `mission-art.yml`)
- 48 generations, about $1.90 at roughly $0.04 each (the rate recorded for earlier releases; not checked against the fal.ai bill): 2 character references (Oren, Gus), 33 scenes (cover plus four per quest, one picture per two pages), 7 first retakes, 2 second retakes, 4 teaching pictures (giant, pocket, hat, page).
- Retakes fixed the giant or wizard wearing Artus's armour, Gus missing or too small, and Artus missing from the last picture. Borders trimmed on wt-farm-a1, wt-lake-1 (retake), the giant teaching picture, and a painted signature cropped from wt-tower-a2. Record: `art-shipped.json`.
- Two art runs generated all their pictures but could not push them back because another workflow pushed first; a temporary branch-only workflow copied their saved artifacts. `mission-art.yml` now rebases before pushing.
- Known art limits: the cover shows Artus, Pip and Oren but not Gus; Gus is sometimes drawn only a little taller than a man instead of six times Artus's height.

## Voice (Kokoro af_heart, free, `story-voice.yml`)
773 clips: 395 words, 337 meanings, 40 questions. Whisper heard 358 of 395 word clips alone or in a group. Not heard clearly: bean, egg, across, hundred, page, a, Artus, no, know, sits, I, Oren, brave, me, wants, sit, knows, than, she, an, too, path, two, how, oh, eleven, twelve, round, keeps, walls, sees, under, thinks, face, Artus's, four, sleeps. These need a human listen.

## Checks
- `tests/wizard-tower.test.js`: order and unlock after mk-moon, 64 new targets, every word a curriculum word, target, name or listed story word, every content word has a meaning, the whole campaign plays through and survives saves, every picture exists, the 44,000 XP hold.
- `tests/wizard-tower-browser.cjs` (headless Chromium): the longest page of all 16 stories at 1180×820, and of the first and last quest also at 820×1180 and 844×390: 24 checks, no page errors, all pictures loaded, no sideways scroll.
- Physical iPad and listening are not verified.
