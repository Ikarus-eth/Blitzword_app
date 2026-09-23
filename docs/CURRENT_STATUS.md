# BlitzWord current status — 23 September 2026

This page tracks current implementation and remaining work. Dated release notes preserve historical behavior and test results; their old limitations are not automatically current tasks. Latest approved user decisions take precedence over earlier plans. A difference between approved behavior and code remains a discrepancy, not a new product decision.

The [original curriculum workbook](../curriculum/README.md), maintained documentation and approved production assets are now in GitHub. No standing ChatGPT project attachments are required. The old setup, battle-scroll and teaching-card mockups are retired; see the [project maintenance guide](PROJECT_DESCRIPTION_UPDATE.md).

## Implemented

| Area | Current behavior | Details |
|---|---|---|
| Curriculum | 200 distinct workbook targets; seven campaigns with five chapters each; continued review after completion. | [Core 200](CORE200_RELEASE.md) |
| Chapter pacing | A battle is one enemy; a chapter is one map field; a campaign is one five-chapter map. New chapters require at least ten active minutes, three reading victories, a completed number duel and learning objectives. Extra battles fill the remaining time; a living battle cannot auto-complete. | [XP and pacing](SUCCESS_XP_RELEASE.md) |
| Growth and naming | XP-only evolution at 3,000 / 8,900 / 13,400 XP. First growth unlocks naming. Successful reading, word milestones, delayed recall, reliable speed and chapter accuracy earn XP. After ten active daily minutes, a one-time 20 XP bonus and visible ×1.75 answer-XP multiplier last for the rest of that date. | [XP and pacing](SUCCESS_XP_RELEASE.md) |
| Chapter scenery | 35 distinct chapter backgrounds; 28 newly generated illustrations and seven retained scenes. Active story/encounter IDs determine scenery; campaign maps retain their established art. | [Scenery mapping and verification](CHAPTER_SCENERY_RELEASE.md) |
| Chapter stories and labels | 34 illustrated transitions after the guided first encounter; narrated introduction, one child-read sentence, optional Listen and child confirmation. Pause/Home/Rest/reload preserve progress. Labels identify the actual campaign and chapter. | [Chapter stories](CHAPTER_STORIES_RELEASE.md) |
| Choices and number duels | Close distractors, multiple-choice-only multiplication, 60 seconds, net +1/−1 scoring, PR-based target, compact results and defeat reactions. Three reading wins plus a won duel earn one non-stacking shield. | [Choices and shields](CHOICES_SHIELD_RELEASE.md) |
| Combat and presentation | Mage staff/lightning, Pip assists/final blows, answer-locked reactions, cancellation and reduced motion; teaching-image framing, enemy names and Easier-left/Same-right defeat choices. | [Combat](COMBAT_REACTIONS.md), [child feedback](SEPT23_CHILD_FEEDBACK.md) |
| Soundscape | Approved adaptive forest music and effects are integrated and deployed, with scene changes, speech priority and independent saved controls. | [Soundscape](SOUNDSCAPE_RELEASE.md) |

## Outstanding work and ownership

- Expanded prerecorded narration is the next audio task. The app retains 165 recordings and immediately uses browser speech for unrecorded text. This documentation change does not generate audio or resume bulk uploads. Existing recordings use static target highlighting; accurate recorded word-boundary highlighting remains unfinished. The reported “gate” pronunciation uses the existing “gait” speech workaround pending a reviewed replacement recording.
- Enemy artwork expansion and creature-specific health ranges belong to the user's parallel thread. They are not changed by this documentation task. At this checkpoint, five base creature designs share tier-based health bands.
- The 35 chapter backgrounds are deployed and verified against source bytes. Rendered tablet/phone scenery QA remains blocked because the browser could not verify its admin-enforced security policy; [chapter scenery](CHAPTER_SCENERY_RELEASE.md) records the exact limit and isolated review fixtures.
- Physical iPad behavior and listening remain unverified. XP pacing is calibrated by deterministic simulations, not observed child play.
- An additional dragon after full growth is an optional future idea, not an approved unfinished feature. Pip remains a provisional child-facing label; no commercial rename is established. Native App Store packaging remains a later phase after web iteration.

## Verified release checkpoint

The chapter-scenery implementation merged as `a9d39efef14200dd9494b8c779182cc64ec9e73d` in [PR #28](https://github.com/Ikarus-eth/Blitzword_app/pull/28). [Pages run 35833726978](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35833726978) completed successfully for that exact commit, including the deployment step. The live [web app](https://ikarus-eth.github.io/Blitzword_app/) reports build `chapter-scenery-20260923-r1`, scenery marker `35-chapters-20260923-r1`, and the unchanged soundscape marker `forest-v2-20260923`.

All 110 core tests and 33 UI-flow groups passed. All 35 background files decode, have distinct hashes and map to the existing stable chapter IDs. Live HTTP 200 responses and source-byte equality were verified for all 35 backgrounds plus seven app/review files on 23 September 2026; see [the deployment record](CHAPTER_SCENERY_DEPLOYMENT.json). These checks establish integration and delivery, not rendered layout quality. Actual browser viewport checks were blocked by the browser security-policy service; no physical iPad test occurred.

This documentation checkpoint adds no runtime or asset changes. Subsequent documentation-only deployments retain the same application bytes and build marker. The previous checkpoint remains available in Git history and the dated chapter-story and soundscape release notes.
