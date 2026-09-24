# Pip evolution scenes — 23–24 September 2026

Integrated build: `pip-evolution-20260924-r1`, on top of the narration recovery, backup file, text-selection fix, smaller-save, narration QA and approved-narration releases. The user approved publication. Implemented, locally tested, reviewed in headless Chromium and deployed on 24 September 2026 (merge `589c821`, [Pages run 35957905729](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/35957905729)); see [current status](CURRENT_STATUS.md) for the verification limits.

The previous app changed Pip's form and offered an XP comparison panel and naming. It did not have a separate evolution animation. This update adds three earned evolution scenes using four new illustrations.

## Child flow

1. Finish the current battle and any pending number duel. Earned XP and the new stage are saved immediately, while the old sprite remains visible until the celebration is complete.
2. Hear “Look! Your dragon is glowing. Let's see what happens.” Tap Watch when ready.
3. Watch a 2.6-second warm glow and a 1.8-second reveal. This uses image scaling, a light ring and a dissolve, with no strobe. Skip goes directly to reading. Reduced motion omits the animated phases.
4. Read two lines with no countdown or automatic reading aloud. Listen plays the exact two sentences; I read it completes the scene.
5. After first growth, choose a name. Later headings use the chosen name. The short first-person lines do not need new audio for each custom name.

| Earned stage | Child reading |
|---|---|
| 3,000 XP | I am big. I can help. |
| 8,900 XP | My wings are big. I can help you. |
| 13,400 XP | Hop on my back. We can go far. |

## Save and progression behavior

`dragon.evolutionSeen` and `dragon.evolution` preserve completion and the current phase. Interrupted animation restarts only its current short phase; reading remains reading. Home and Rest leave it pending. Pausing and backgrounding cancel speech and timers. No evolution or replay time counts as practice, and listening or reading confirmation adds no learning evidence or XP. Replaying from the growth panel preserves all earned progress. Existing earned forms are grandfathered and can be replayed, rather than forcing a backlog of celebrations.

Growth thresholds and riding/flying entitlement requirements are unchanged. No new gameplay unlock or second dragon is introduced. Several thresholds crossed together are celebrated in order. Image failure uses the established sprite underneath without blocking the scene.

## Assets and narration

Four WebP frames are in `assets/evolution/pip-stage-{0,1,2,3}.webp`. The built-in image-generation tool used the two approved Pip references. [Exact prompts](EVOLUTION_PROMPTS.json) are saved. Existing production sprites remain unchanged.

Four local MP3s are in `assets/narration/evolution-{0,1,2,3}.mp3`. They use the existing Tom voice and `eleven_multilingual_v2` at speed 0.88; after the user's narration QA on 24 September 2026, evolution-3 was re-recorded at 0.82 and approved, and evolution 0–2 were approved as they were. [Receipts and hashes](EVOLUTION_NARRATION.json) record their provenance. All four decode fully with ffmpeg. The narration workstream had already added the four files and receipts to `main`; this release adds them to the approved corpus, the generation receipts and the exact-text runtime manifest (`recorded-voice-20260924-r4`). The corpus now holds 994 recordings, all mapped at runtime. `scripts/build-narration.cjs` reproduces the manifest from those files; the older `prepare-narration.cjs` is unchanged. No recording was generated or bought for this release.

## Verification

On 24 September 2026, after integration with current `main`: JavaScript syntax checks, all 132 core tests and all 49 UI-flow groups pass locally. The recovered checkpoint had passed 114 core tests and 39 UI-flow groups on the older fullscreen-removal base. All four image files decode at 1024 × 1024, and all four voice clips decode fully. Local regression checks cover earned-stage queues, old saves, pending-scene migration, no duplicate rewards, narration cancellation, all three scenes, pause/background, Home/reload, untimed reading, optional Listen, first naming, replay, missing-image fallback, reduced motion, Rest and the final-answer-to-evolution-to-result boundary.

Rendered review in headless Chromium (Playwright) from a local server, 24 September 2026:
- All three scenes at 1180 × 820 and 1024 × 768 tablet landscape, 820 × 1180 tablet portrait, 375 × 667 and 390 × 844 phone portrait and 844 × 390 phone landscape: no page errors, no scrolling, no horizontal overflow. The dragon, both sentences and every visible button fit inside the viewport; the title does not overlap the toolbar. Wings, horns and tails are fully visible in all four forms.
- Timing: Watch → glow 2.6 s → reveal 1.8 s → reading. Skip is the only control during the animation and jumps to reading. Reduced motion shows the still scene.
- Audio: the intro requests `evolution-0.mp3`; Listen requests the matching `evolution-1/2/3.mp3` (HTTP 200 each). The clips themselves were approved in the user's narration QA; playback inside the evolution scene was not listened to.
- Real `index.html` with a seeded test save: the XP-crossing final answer shows “Pip is glowing!” with the old form, combat finishes, the evolution opens with the battle resolved and the win counted, a reopen during the glow returns to the map and Play resumes the scene, I read it returns to the result screen and offers naming. XP stayed 3,002 throughout.
- Watch again in the growth panel opens the current form. A blocked WebP shows the established sprite and still allows I read it.

Visual observations for the user's review (not changed):
- Stages 1–3 have an opaque dark background. A faint square edge is visible around the dragon, most clearly on phone landscape, where the stage is wider than the square image, and during the bright reveal. Fitting the edge mask to the square image removed the edge but faded the tail and claws, so that change was not kept.
- The missing-image fallback uses the established sprite painter, which also shows a strip of the neighbouring sprite-sheet row above the dragon. The same strip appears in the existing growth panel on `main`.

Not verified: physical iPad, Safari/WebKit, and listening to the clips inside the evolution scene.

Isolated review fixtures use memory only and never touch learner saves:
- `tests/review-app.html?scene=evolution-1-intro`
- `tests/review-app.html?scene=evolution-2-read`
- `tests/review-app.html?scene=evolution-3-read`
