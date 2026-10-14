# Clear details and direct searches — 14 October 2026

Deployed and verified. This revision supersedes the original expert clue set and answer audit in ../RELEASE.md, following the user’s playtest correction.

All twelve questions now ask players to find a plainly described object and report a visible colour, object, count or displayed time. Location directions are optional hints. Remove metaphors, arithmetic, multi-location combinations and instrument identification. The maps remain 6144×4096 with six searches each and 24× zoom. Adult difficulty remains unmeasured.

Four targeted built-in ImageGen edits repair the pink-dressed flautist’s hands and missing instrument, fused market figures and purple-clad child, malformed railing owl, and parrot/lantern. Patches are applied to the original lossless assembled panoramas before one WebP export, avoiding repeated lossy compression. Existing composition is retained outside feathered crop patches. [Exact prompts](prompts.json), [patch geometry and provenance](art-repairs.json).

## Answer audit

Crops were taken from final exported WebPs. [Harbour answers](clockwork-harbour-answers.jpg) and [Archive answers](underground-archive-answers.jpg), with overview-coordinate crop bounds in [answer-audit.json](answer-audit.json).

| Search | Harbour | Archive |
| --- | --- | --- |
| 1 | White shoulder scarf | Three lift passengers |
| 2 | Yellow musician’s bag | Ten o’clock on the fish clock |
| 3 | Black-and-white cat | Lantern below the parrot’s perch |
| 4 | Winged dragon on blue banner | Four books beside the boat lantern |
| 5 | Brick chimney in front of telescope | Yellow lower butterfly |
| 6 | Bird ornament on gold jug | Owl on bridge railing |

These checks establish visible answers, not flawless anatomy for every incidental background figure.

## Saves and delivery

Revision r2 preserves solved steps, completed maps and remaining lives. Only the pending selection/wrong-answer flag is cleared, preventing an old selected option from being submitted against a changed question. Asset URLs and script references are versioned to refresh cached artwork and text. Classic maps and main-game data are unchanged.

## Verification

All ten standalone atlas unit tests pass, including migration of r1 saves with three, five and six solved searches. Sixteen bilingual browser journeys pass across desktop, phone portrait/landscape and tablet sizes: all answers, hints, image dimensions, zoom, wrong-answer handling, retry, replay, reload and preserved classic/main saves. [Local browser evidence](local-checks.json). Expanded-view navigation and classic three-question completion also pass at three widths. All twelve final answer crops were visually checked. Deployment verification follows.

## Deployment

[PR #196](https://github.com/Ikarus-eth/Blitzword_app/pull/196) merged as `859b989e6364976f788026e950910e3d69074858`. [Pages run 38570659339](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38570659339) passed the full regression suite and published successfully. All twelve checked public files returned HTTP 200 and exactly match merged-source SHA-256 hashes. [File evidence](DEPLOYMENT.json).

All sixteen bilingual browser journeys passed against the public app after publication, covering every revised answer, four viewports, full-size images, 24× zoom, reload/retry/replay and preservation of old saves. [Live browser evidence](live-checks.json).
