# Forest soundscape — updated 24 September 2026

The previous deployed soundscape used synthesized wind and two sustained tones. This release integrates the approved original forest composition as synchronized background and accent layers: home (80 s), battle (64 s), number duel (48 s), transition (20 s), victory (16 s). The instrument palette is preserved, with slightly reduced flute vibrato. All audio is original synthesis; no third-party samples, soundtrack excerpts or paid APIs.

## Playback behavior

- Start audio only after a tap or key event. Missing or blocked audio never blocks gameplay.
- Battle fixation, exposure, mask and choices retain the same restrained music/forest mix as the rest of the encounter. Only one-shot effects are suppressed during unanswered reading. Spoken battle words smoothly duck the background, and combat effects still begin only after pronunciation finishes. Assessment, teaching and chapter-story reading remain quiet.
- Both music layers start at the same audio-clock time. Battle questions leave their mix and loop position unchanged; narration alone ducks the music. Scene changes fade old sources; stale downloads cannot start the wrong scene.
- Keep two scenes decoded for battle/teaching reuse. Decode only requested scenes, with bounded downloads and no heartbeat retry loop. Delivery assets total less than 5 MB.
- Narration, music, forest ambience and effects have independent saved controls in pause/grown-up settings and the parent dashboard. Quiet play suppresses non-speech audio. The child sound button retains its existing non-speech mute behavior.
- Short synthesized victory (2.6 s) and defeat (1.65 s) cues play once per saved result. Victory melody recedes after one phrase; defeat settles into forest air. Effects cover Mage, Knight, Archer, Pip, shield, damage, answer feedback and menu selection, with small variations.
- Optional final-three-second duel cue is off by default, follows the actual clock and does not repeat within a second. No accelerating score.
- Pause, background and mute cancel pending effects. Inaudible music cannot resume from stale async work. Returning to a saved result does not replay its cue.

## Source and validation

`scripts/render-soundscape.py` regenerates the delivery files with Python, NumPy, SciPy and FFmpeg. `assets/soundscape/manifest.json` records source duration, hashes, decoded peaks and boundary measurements. MP3 layers are independently encoded with gapless metadata; playback applies an 8 ms endpoint repair for decoder differences. Loop timing, decoded length and signal boundaries have technical checks; perceptual continuity and balance on a physical iPad still require listening.

Regression coverage includes speech/effect priority, no downloads before a user gesture, synchronized layers, delayed downloads after scene changes, bounded failures, saved independent controls, optional countdown and narration volume. Existing learning, combat, shield, multiplication, migration and XP tests remain required. The new XP release was merged into this branch before the combined regression run.

## Deployment concurrency

Continue using the existing GitHub Pages workflow. Do not overwrite main or force-push. The release is based on real current main and merged through a task PR. Workflow concurrency remains in the existing `pages` group, with active deployments allowed to finish. A current-main check before artifact upload/deployment skips outdated runs and old manual reruns. A newer main commit receives its own queued deployment; verify the final Pages run and live assets after merging.


## Continuous battle mix — 24 September 2026

The previous reading gate muted all background audio for most of each turn, making the music audible only in short gaps. The user requested a redesign. The replacement uses one low, continuous forest composition throughout battle, with the familiar instrument palette and no question-driven swells.

- The battle music bus runs at 60% of the saved Music setting. The existing bed stays intact; the flute/percussion stem is held at 12% of its original level throughout the battle. No assets are regenerated.
- Fixation, words, masks, choices and combat keep the same background level. Timed and self-paced reading both retain music. Reading separately gates one-shot effects.
- Narration ducks battle music and forest ambience to 40% of their current level, using a 55 ms exponential time constant. Recovery uses 650 ms (about two seconds to settle), avoiding an abrupt return after a short word. Other scenes retain narration silence. These values are initial mix choices, not a claim of perceptual validation.
- Full silence still applies to pause/background, mute, Quiet play, assessment, teaching, story reading and evolution reading. Volume preferences are not overwritten. A zero Music setting remains zero while Forest can remain independently audible.
- Existing synthesized combat and result cues, narration priority, stale-download protection and bounded load failures remain. The score follows the same audio clock throughout a question sequence.

Build and soundscape markers: `continuous-battle-20260924-r1`. Runtime changes are limited to `app.js`, `soundscape.js` and their `index.html` versions; learner saves need no migration.

Validation and deployment are recorded in [current status](CURRENT_STATUS.md).
