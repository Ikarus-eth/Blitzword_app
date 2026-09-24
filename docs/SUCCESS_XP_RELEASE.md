# Success XP and chapter pacing — 23 September 2026

Historical release: its XP display, growth thresholds and calibration dates are superseded by [whole XP and slower growth (24 September)](XP_PACING_RELEASE.md). Its chapter pacing and evidence requirements remain unless the newer release explicitly says otherwise.

This release implements the user-approved XP-only progression and chapter minimums. It supersedes the earlier 14-day/active-minute evolution gates and 250/750/1,500 XP thresholds. There is no elapsed-day gate, daily play cap, or forced stop after a chapter.

## Rewards

- An independent correct reading answer earns 3 XP. Incorrect, supported, demo and assessment responses earn no XP and never remove earned XP.
- A new word earns 8 XP once after three successful observations with at least two intervening answers and at least two distinct battles. A miss restarts the unfinished evidence sequence. Existing observation/mastery fields remain separate.
- The first successful due review at least 24 hours after that word milestone earns 4 XP once, provided no help occurred in the preceding 24 hours. This delay qualifies a retention reward; it never gates evolution.
- A secured review word earns 1 extra answer XP at Run-or-faster exposure after at least 18 of the latest 20 independent responses at that actual saved exposure were correct. Selecting a speed alone earns nothing. Existing speed/entitlement locks remain intact.
- A completed chapter earns 10 XP at at least 90% independent accuracy or 5 XP at at least 80%, provided there were at least ten independent attempts. The award is persisted and cannot repeat on reload. Review chapters after the story can earn their own completion reward.
- Multiplication still gives 1 base XP per correct answer. The separate duel score remains +1 correct / −1 incorrect, with the existing PR target, shield cycle and 60-second rules.

At ten interaction-confirmed active practice minutes on the device's local date, award 20 XP once. Correct reading and multiplication answer XP is then multiplied by **1.75** for the rest of that date, including after twenty minutes. Milestone and completion bonuses are not multiplied. The static XP ×1.75 badge is visible during play and on the map, without animation, audio, or highlighting that could cue an answer. Fractional XP is retained exactly; child-facing totals show whole XP. Active minutes may accumulate across sessions. Menus, paused/background/idle time, assessment and demo cannot qualify.

## Growth calibration

Cumulative thresholds are **3,000 / 8,900 / 13,400 XP**. Growth depends only on XP, preserves already-earned forms, and does not grant a purchase entitlement. The first evolution unlocks naming. The child can keep Pip, postpone naming, or edit it later from the growth panel. Renaming preserves character art, word targets, growth, saved responses and progression; teaching uses the existing speech fallback for personalized text.

`node scripts/calibrate-xp.cjs` reproduces `XP_CALIBRATION.json`. The deterministic model uses one reading attempt per 24 active seconds, 90% accuracy, Walk exposure, six-health enemies, and one multiplication response per six active seconds with 90% accuracy. It includes the actual word scheduler, word/retention rewards, number duels, chapter completion, finite 200-word content, continued review, date boundaries and daily save/reload.

| Daily active practice | First evolution | Second evolution | Full growth |
|---|---:|---:|---:|
| 15 minutes | Day 14 | Day 42 | Day 70 |
| 45 minutes | Day 5 | Day 13 | Day 21 |

These are model outputs, not human learning or enjoyment measurements. Different answer rates, accuracy, help, speeds and retained-word evidence change the dates. The multiplier was increased from the earlier proposed 1.25 to 1.75 so the two requested schedules can both fit the same XP-only thresholds. A calendar gate would contradict the user's explicit instruction and is not used.

## Battle, chapter and campaign

A battle is one enemy. A chapter is one existing map field. A campaign is one map of five chapters. The existing 35 fields and seven maps keep their stored IDs so learner records and saved questions are not rewritten. Child and parent labels use the new terminology.

A new chapter requires: at least ten confirmed active minutes attributed to that chapter; at least three reading victories; one completed number duel (winning is not required); every chapter target introduced and at least 80% practiced correctly twice. If the third victory and duel finish at eight minutes, another battle stays in the same chapter. Crossing ten minutes in a living fight cannot complete it: resolution waits for a real zero-health battle boundary. Losing a duel does not remove reading wins or XP. The shield still requires three reading wins and a won duel with its existing non-stacking rules.

The duel is offered at the normal consecutive-win trigger and at each third chapter victory until one has been played, so a reading loss cannot indefinitely withhold the required chapter duel. It may be postponed, but an unplayed duel does not satisfy chapter completion. Global two-win reading checkpoints remain separate from the chapter's durable victories.

Two of every three word selections prioritize the current chapter, while the third can serve due earlier-word review. This prevents an expanding review backlog from consuming all the new chapter's turns. Six new targets per session remains the maximum. The final encounter closes a campaign after its five chapters. After all seven campaigns, saved review chapters keep the same ten-minute/three-win/duel requirements and continue the daily one-chapter goal.

## Migration and scope

Existing XP is not repriced. Previously earned forms and cleared fields stay earned. Old pending reading and multiplication questions, choices, scoring, time, PR, shields and records survive. Unknown historical per-field minutes are not fabricated; new chapter timing starts from attributable activity. Missing companion names default to Pip. Old result screens retain the combined reading and multiplication XP total.

This XP milestone did not add recordings, a soundtrack, another pet, new scene artwork or story interludes. Subsequent releases implemented the [adaptive soundscape](SOUNDSCAPE_RELEASE.md) and [34 chapter-story transitions](CHAPTER_STORIES_RELEASE.md). Expanded recordings and distinct artwork for every field remain outstanding; the existing 165 recordings and immediate speech fallback remain. An additional pet is only a future option. The provisional Pip / BlitzWord branding is not a commercial rename. See [current status](CURRENT_STATUS.md) for the active backlog.

## Verification

Tests cover daily reward idempotence, fractions, midnight/reset, bonus beyond twenty minutes, word/retention/speed eligibility, ten-minute completion boundaries, played/lost duels, all 35 chapters, continued review, migration, naming, UI persistence, idle exclusion, existing combat and score rules. The extended simulation checks five-hour capacity and continues through all content; the ten-minute chapter minimum means the old claim that every chapter can finish inside five hours is superseded. Physical iPad behavior, listening suitability and observed child pacing remain unverified.
