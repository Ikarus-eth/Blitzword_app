# Automatic reading challenge — 30 September 2026

Build: `adaptive-reading-20260930-r1`. Implemented, tested, deployed and verified.

## Accepted direction and calibration

The parent reported boredom from familiar words, reaching the 32-HP enemy ceiling, and requested an update that automatically adjusts toward a productive accuracy level (asking whether 70–80% was optimal). This supersedes the fixed six-word field / three-preview teaching ceiling and routine not-due filler.

Start with an **80–90% unaided-success band**, centred on 85%, as a tuneable product hypothesis. It is not a validated optimum for seven-year-olds doing four-choice reading. [Wilson et al. (2019)](https://www.nature.com/articles/s41467-019-12552-4) derives approximately 85% for particular binary-classification learning models; that result does not establish an exact target for this game. Measure delayed recall, frustration and willingness to return alongside accuracy. Do not manufacture mistakes by shortening every display or guaranteeing a fixed error quota.

## Selection rules

- Use the latest 20 usable campaign checks, including help requests as not-yet-known outcomes. Exclude demo, assessment, guided work and interrupted displays. Use at least ten checks before a full-window decision. Three or more unsuccessful checks in the latest five promptly select support mode.
- Above 90%, stretch mode allows up to six unresolved words and prefers a new word on two of three turns. At 80–90%, steady mode allows four unresolved words and prefers new material on alternating turns. Below 80%, support mode allows two unresolved words, prioritises completing that set, and only prefers a new word every sixth turn. Once the set is resolved, introduction can resume. Existing larger sets are worked down, not erased.
- Two unaided successes separated by other words remove a word from ordinary unfinished practice. This is provisional familiarity, **not secured or retained mastery**. A wrong answer or valid help request returns the word to practice; help does not become an independent miss, damage health, or earn XP.
- Due missed-word repairs have priority. Reserve at least every third selection for eligible due reviews; they include words learned ahead of the map. Successful reviews reschedule using the existing expanding 1/3/7/14/30-day rules. Recent help cannot advance delayed-retention stages.
- Introduce words in the reviewed Core 200 order without the old story-field, per-session six-word or three-preview ceiling. All targets retain reviewed distractors and teaching cards. At most six unresolved words normally remain active. A start-of-learning spacing exception permits a third word when a two-word set cannot supply two distinct intervening answers after help.
- Known not-due words are fallback material only, during recovery or when the finite curriculum is exhausted. Prefer the least-practised today and least-recently-seen. Do not cycle these ahead of available new work. There is no faster-refill fallback. Selected movement pace and existing Ride/Fly access gates remain unchanged.
- Every path preserves two distinct intervening answers after help. Already-prepared questions keep their target, choices and timing across updates, settings changes and reload.

The story still advances in order with its ten-minute minimum, three reading wins, number duel and word objectives. Reading can run ahead without falsely clearing map fields. The original workbook remains at `curriculum/BLITZWORD_CURRICULUM_200_1000.xlsx`; playable content remains the same 200 words in `content.js`. No new story/comprehension task or artwork is introduced here.

## Combat and reporting

Increasing enemy health mainly increases required correct answers. Three hero hearts against a 32-HP enemy conflicts with a learning mix that includes errors. New non-demo battles therefore start with `max(3, ceil(enemyHP / 4) + 2)` hero hearts: 3 at 3–4 HP, 4 at 8 HP, 6 at 16 HP and 10 at 32 HP. One independent mistake still costs one heart, or consumes an earned shield. Existing enemy ranges, encounter identities and the 32-HP catalog ceiling remain. The demo retains three hearts.

The compact heart/count display and encounter message explain longer-battle health. Health still appears at attack impact; reload shows the committed value. Legacy pending battles keep their saved health, maximum, identity and exact pending question, with no mid-battle refill.

Parents now shows the target band, sample count, current success rate and whether selection is opening new material, balancing practice, or providing more support. Help and timing exclusions are explicit. Mastery/retention reporting remains separate. New raw records retain selection kind and challenge mode. Adaptation is derived from bounded retained history; no unbounded log or new storage key is added.

XP amounts, growth thresholds and earned rewards remain unchanged. Moving two-success words out of massed practice delays their third-success word bonus until later encounters/reviews. The seven-day pacing regression now allows 700–1,400 XP per 30-minute model day rather than the old 900–1,100 range; it separately verifies that more practice, accuracy and eligible faster review remain rewarded. These are model envelopes, not promised payouts.

## Verification

- 265 core/asset/regression tests pass, including adaptive boundaries, help and interruption exclusions, learning ahead, bounded unresolved sets, review priority, mastery separation, legacy migration, shield behavior and five-hour/all-35-chapter progression. Existing 90-day save compaction checks pass.
- All 91 UI regression groups pass, including adaptive selection with unchanged pace and pending-choice resume, plus ten-heart impact timing/reload and the parent explanation.
- Isolated Chromium at 1180×820, 820×1180 and 390×844 verifies encounter/battle layout, adaptive selection, pending-question reload, parent summary and no horizontal overflow or page errors. Screenshots were visually reviewed. Physical iPad/Safari is untested.
- A read-only copy of the supplied export preserves profile, dragon/XP, assessment, settings, battle and all learning data exactly during migration. No private backup or child identity is checked into GitHub.
- Reproducible hypothetical 100-answer streams compare baseline main `72583c76adc90026605c81f7f9e1c858151eb762` with this implementation. At a fixed 85% answer accuracy from the supplied save, new distinct targets rise from 0 to 36; already-successful/not-due turns fall from 75 to 0; forced defeats fall from 5 to 0 with the revised heart allowance. Fixed outcomes are independent of word difficulty, so this is scheduling/health evidence, **not evidence of learning gains or achieved human accuracy**. See [aggregate results](ADAPTIVE_READING_CHECKS.json).

Reproduce core/UI checks with `npm test`; scheduling comparisons with `node scripts/simulate-adaptive.cjs <baseline-sha> [private-backup.json]`; isolated browser checks with `PLAYWRIGHT_MODULE=<installed-playwright> node tests/adaptive-browser.cjs` while serving the checkout on localhost:8776. The optional backup input is read only; output contains aggregate counts, never its identity or contents.

## Deployment

Deployed through the existing GitHub Pages route in [PR #112](https://github.com/Ikarus-eth/Blitzword_app/pull/112), merge `6882e3bbea690699890bf631b65a3e1451e63e29`. Current main was checked at `72583c76adc90026605c81f7f9e1c858151eb762` immediately before merge, with no intervening changes. [Pages run 36685268337](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36685268337) passed all checks and deployed successfully. At 07:45 UTC on 30 September, the live build marker and all four changed runtime files matched the merged source byte for byte. A fresh isolated live Chromium profile passed encounter health, adaptive selection, pending-question reload and parent reporting checks at all three tested sizes, with no errors. [Machine-readable deployment evidence](ADAPTIVE_READING_DEPLOYMENT.json). No real learner storage was written during verification.
