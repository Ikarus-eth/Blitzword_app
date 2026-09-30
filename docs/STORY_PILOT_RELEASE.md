# Artus & Pip: five story adventures

**Historical r1 release.** The user rejected the generic scenery and separate portrait overlays, and requested linked puzzles and one rescue journey. See the [current rescue revision](story-pilot/RESCUE_RELEASE.md). The evidence below records r1 as it was deployed.

User decision, 30 September 2026: expand the approved standalone story to five; put an extra button on chapter-selection Home; remove the pilot’s Listen control and voice; keep words fairly simple while increasing riddle and maths difficulty. Reuse current approved artwork where useful. Deeper integration can come later.

Build `story-pilot-20260930-r1`. The **Story adventures** button opens `assets/story-pilot/` after saving the main adventure. Back to map returns to the existing game. The pilot is optional and all five stories are available immediately; Next story suggests the intended progression.

## Content and reasoning

`assets/story-pilot/stories.js` is the authoritative story, choice, hint and explanation source. These short stories use simple wording; they are not restricted to previously mastered Core 200 words and do not replace `content.js` or the original workbook.

| Story | Reading task | Maths | Answer |
|---|---|---|---|
| The Fox in the Cave | Track a changed item | 3 − 1 | Torch; 2 apples |
| The River Bag | Follow an object moved between bags | 8 − 3 + 2 | Blue bag; 7 nuts |
| The Troll’s Gate | An object must fit both riddle clues | 3 × 5 − 4 | Key; 11 coins |
| The Owl’s Chests | Combine position with an exclusion | (24 − 6) ÷ 3 | Moon chest; 6 gems |
| The Last Gate | Exactly one of three door signs is true; combine range and times-table clues | (3 × 9 − 6) ÷ 3 | Sun door; 56; 7 gems |

The final door puzzle has exactly one valid answer. If sun is safe, only the moon sign is true. Choosing moon or star would make two signs true. The arithmetic and uniqueness are independently checked in tests.

There is no clock, speech, auto-reading or audio dependency in the pilot. Text stays available for rereading. The scene art does not reveal the answer. Choices shuffle per story run, keep that order on reload, and use neutral selection styling. A wrong check gives no answer ticks. Hints point back to the relevant text. After a first try, Show me together opens an assisted ending with explanations. Replay keeps the first-check record. Correct answers open an illustrated ending; Next story continues.

## Progress and game boundaries

The pilot only reads/writes `blitzword_story_pilot_v1`. It never reads or writes the main learner record and gives no XP, health, mastery, chapter-time or curriculum credit. Artus and Pip are fixed story characters. Main-game voice, battles, rewards, narration and character rendering remain unchanged.

Each story retains its current choices, shuffled order, check count, hints, assisted-completion flag, first checked choices/matches/hints, replay count and whether an ending has been reached. The grown-up disclosure reports first-check matches and hints without claiming independent reading. Choices save after each action. The first check remains unchanged by retries and replays. Storage errors, unreadable saves and cross-tab conflicts stop editing and offer reload; unsupported saves are not overwritten.

Pilot progress is local to this browser and is **not included in the main game backup**. The grown-up panel states this. There is no remote reporting or additional service.

## Artwork

No new bitmap images were generated. Existing chapter scenery, the fox teaching picture, Artus’s existing portrait and Pip are reused. Four approved updated enemy stills appear as story guests: Acorn Imp C, Cave Troll C, Hollow Owl C and Stone Ram B. These selections match `docs/artwork/character-selections.json`. This user-authorized pilot use does not replace the battle rigs or relax the smooth-animation gate for broader game replacement.

Choice icons use local SVGs. Game-icons.net artwork is attributed in the pilot’s grown-up panel, under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/); background removal and colour adaptation only. Original files: https://github.com/game-icons/icons.

| Local icon | Original path / author |
|---|---|
| torch | delapouite/torch.svg — Delapouite |
| shield | willdabeast/round-shield.svg — Willdabeast |
| sword | lorc/broadsword.svg — Lorc |
| apple | lorc/shiny-apple.svg — Lorc |
| bag | lorc/knapsack.svg — Lorc |
| key, comb | lorc/key.svg, lorc/comb.svg — Lorc |
| saw | delapouite/hand-saw.svg — Delapouite |
| gem | lorc/gem-pendant.svg — Lorc |
| coin | delapouite/coins.svg — Delapouite |
| nut | lorc/acorn.svg — Lorc |
| chest | delapouite/chest.svg — Delapouite |
| sun, moon | lorc/sun.svg, lorc/moon.svg — Lorc |

Star and leaf use the standard Lucide paths under ISC; the licence is distributed at `assets/story-pilot/assets/LUCIDE-LICENSE.txt`. Existing Andika and artwork licences/provenance remain in the repository.

## Verification

264 automated tests and 90 UI-flow groups pass, including 12 new pilot tests and the map-launch/save-failure check. All five stories were completed in Chromium through actual controls, including a wrong first attempt, hint, corrected answer and reload with saved selection. First-check reporting retained the original miss. Checked desktop, iPad portrait, narrow phone and phone landscape layouts; 320 px map layout separates the new button from Pip’s card. No browser warnings/errors were reported during this flow. Physical iPad/Safari remains untested. See `STORY_PILOT_CHECKS.json` for the evidence record.

Deployment uses the existing GitHub Pages workflow with its existing regression checks and asset packaging, which includes the pilot in the normal site. Deployed and verified on 30 September 2026 in [PR #105](https://github.com/Ikarus-eth/Blitzword_app/pull/105), merge `bd30a889ba4cfef86e653113fbcf3687477251b0`. [Pages run 36664650101](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36664650101) succeeded. Forty-two live files matched the tested source, and Chromium verified the published map button opens the five-story pilot with no missing images or console errors. See [live evidence](STORY_PILOT_DEPLOYMENT.json).
