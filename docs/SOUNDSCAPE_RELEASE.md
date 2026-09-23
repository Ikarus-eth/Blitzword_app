# Adaptive forest soundscape — 23 September 2026

The previous deployed soundscape used synthesized wind and two sustained tones. This release integrates the approved original forest composition as synchronized background and accent layers: home (80 s), battle (64 s), number duel (48 s), transition (20 s), victory (16 s). The instrument palette is preserved, with slightly reduced flute vibrato. All audio is original synthesis; no third-party samples, soundtrack excerpts or paid APIs.

## Playback behavior

- Start audio only after a tap or key event. Missing or blocked audio never blocks gameplay.
- Reading fixation, exposure, mask, choices, assessment and teaching suppress music and effects. Spoken words take priority; combat sounds begin only after pronunciation finishes.
- Both music layers start at the same audio-clock time. The question cycle changes volume without restarting the loop. Scene changes fade old sources; stale downloads cannot start the wrong scene.
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
