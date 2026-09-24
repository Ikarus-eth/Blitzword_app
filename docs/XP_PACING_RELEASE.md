# Whole XP and slower growth — point 9

Build: `xp-pacing-20260924-r1`. Implemented and locally tested; deployment verification pending.

## Approved direction

The parent reported that their son earned about 1,000 XP in 30 minutes and wanted slower growth, comparable to the effect of about 200 XP under the previous thresholds. The final decision is to keep whole XP and raise the cumulative growth thresholds to **15,000 / 45,000 / 70,000**, retaining rewards for longer, faster and accurate practice and adding some reward for consistency. These latest decisions supersede the earlier thresholds and model targets. They do not promise a fixed payout or an exact growth date for a child.

## Rewards

| Correct independent answer | Before ten active minutes today | After ten active minutes |
|---|---:|---:|
| Reading | 3 XP | 5 XP |
| Reliable fast review | 4 XP | 7 XP |
| Multiplication | 1 XP | 2 XP |

Reliable fast review retains its existing secured-word, Run-or-faster and 18-of-20 accuracy requirements. The existing internal 1.75 boost is rounded per answer to whole XP. The child sees **XP boost**. New-word, delayed-review and chapter accuracy awards remain 8, 4 and 10/5 XP with their existing conditions. These milestone awards are not boosted. Incorrect/helped/demo/assessment responses keep their existing zero-XP behavior. Multiplication score, facts, opponent targets, shields and penalties are unchanged; this is not point 10.

Ten confirmed active practice/math minutes still awards 20 XP once and enables the boost for the rest of the local date. There is no daily cap. At that milestone, a returning bonus awards **10 XP per qualifying date in the preceding six dates, up to 50 XP today**. A qualifying date has at least ten confirmed active practice/math minutes. It need not be consecutive: a missed date does not erase other recent dates or take away earned XP. The window uses local calendar dates across DST and year boundaries. Demo, assessment, menus, background and excluded idle time do not qualify.

Recent verified practice before this release can qualify a future returning bonus. No old reward is paid again, no prior day gets a retroactive award, and reopening does not duplicate the daily or returning award. The map shows the earned returning bonus; Parents explains the rule and recent qualifying-day count.

## Growth and saves

Ten static segments divide the interval to the next growth on the existing map, result and growth-panel bars. Result and growth-panel text shows whole XP remaining to the next step. Steps do not award extra XP or create new forms, reading evidence or entitlements. No reading-phase animation or new art is added.

Total XP, historical awards, forms, names, cleared chapters, pending questions, queued evolution scenes and all save keys remain. Earlier fractional residues are retained in storage and displayed as whole totals, as before; all new awards are whole numbers. Already-earned forms are not demoted. A small `growthRulesVersion`/`dragon.growthOrigin` migration records the old form's starting XP for its steps; that starting point stays fixed through reload until the next evolution. Newly earned forms start at the new thresholds. For example, an old Big Pip at 4,000.25 XP remains Big Pip with naming/replay access and a next growth at 45,000, while visible XP remains 4,000.

The chapter minimum, learning objectives, scheduling, word evidence, narration and other artwork remain. The known neighbouring sprite-row strip in the growth panel remains visible and is outside this change.

## Calibration

Run `node scripts/calibrate-xp.cjs 1acabb70eba2b9cf57054d6836545b4859916d14` to reproduce [the comparison and forecasts](XP_PACING_CALIBRATION.json). The old and new core run through the same play loop: eight-second reading attempts, 90% accuracy, Walk, six-health enemies, six-second multiplication answers at 90%, daily save/reload and the actual scheduler. Teaching/story time is not modeled. These are sensitivity checks, not measurements of this child's exact session or of learning/enjoyment.

| Daily active practice | Old day-one XP | New day-one XP |
|---|---:|---:|
| 15 minutes | 445.25 | 444 |
| 30 minutes | 961 | 949 |
| 45 minutes | 1,483.25 | 1,461 |

The first seven modeled 30-minute days earn **949–1,031 whole XP** each, including the returning bonus as it becomes available. The reference still receives roughly 1,000 visible XP; its progress towards growth is approximately one fifth of the previous amount. At 30 minutes, faster answer cycles, higher accuracy and qualifying Run review still earn more. Model growth dates from a fresh learner are:

| Daily active practice | First growth | Second growth | Full growth |
|---|---:|---:|---:|
| 15 minutes | Day 33 | Day 108 | Day 171 |
| 30 minutes | Day 16 | Day 51 | Day 81 |
| 45 minutes | Day 11 | Day 34 | Day 53 |

These are not calendar gates. Changing accuracy, response time, help, chapter mix, starting XP or practice days changes the outcome. The old 24-second calibration is now one comparison scenario, not the assumed real answer rate.

## Validation

- Clean install and full Node 22.23.3 suite: **232 core tests and 81 UI-flow groups passed**. All ten workflow syntax checks and three additional changed-script checks passed.
- Added checks cover whole awards, preserved old fractions, exact growth/step boundaries, all grandfathered forms, stable step origins, pending evolution and choices, consistency gaps/caps, duplicate prevention, year/DST boundaries, excluded time and calibration sensitivity.
- The existing 90-day, 45-min/day save-size regression still passes below one million characters.
- Sixteen isolated Chromium scenarios cover fresh, existing-form, returning-bonus and result saves at 1180×820, 820×1180, 390×844 and 844×390. They check whole labels and live answer rewards, static step bars, no horizontal overflow, 44 px close targets, Parents, saved XP and leave/reopen. No page errors. [Machine-readable checks](XP_PACING_CHECKS.json).
- Tablet growth and phone map/result layouts were visually reviewed. Physical iPad/Safari/WebKit and observed child pacing remain unverified.

Existing tests changed deliberately: threshold-crossing/evolution/naming fixtures now use 15k/45k/70k; boosted answers expect whole rewards and the new badge; map text expects growth steps. The extended all-chapter test now expects the first earned form, not full growth, because growth was deliberately slowed. The old exact calendar target test is replaced by reward and incentive checks around the parent's reference. Review fixtures follow current content thresholds. Existing save, learning and chapter requirements were not relaxed.

## iPad check and stop

Leave and reopen the app. Check whole XP after answers and battles; after ten active minutes, confirm the XP boost. Tap Pip to see the next small step and the new growth threshold. Previously earned forms and names should remain. After practice on another date, check the returning bonus and its explanation in Parents. Keep the existing save and backup.

Stop after deployment verification. Collect the next real 30-minute session's XP and the child's response to growth pacing. Point 10 and other parked work need a separate decision.
