# First-session feedback — 21 September 2026

The subsequent campaign-map and growth update is described in `CAMPAIGN_MAP_AND_GROWTH.md`; it supersedes the progress-meter and growth limitations below.

## Implemented

- Opening art places Pip walking on a forest path with ground contact, rather than a separate central cutout. Landscape and portrait layouts keep the parent-assisted form.
- Reading check opens with a short visual/narrated explanation. Assessment items, adaptation, exposure durations and stopping rules are unchanged. Finishing the check opens a clearly labelled Chapter 1 encounter with a Start button; no child-facing score report intervenes.
- Chapter progress is visible at Home, encounter entry, in battle and after battle. It counts introduced active curriculum words toward the planned 30. It does not claim mastery or completed story progress. Checkpoints remain separately tied to every two victories.
- Home is available in gameplay, teaching, results and hero selection. It preserves the active question, correction, encounter identity, health and learning records. Leaving during exposure uses the existing interrupted-exposure support rule. The generic Adventure label is removed from combat.
- Five species: Thornling, Moss Golem, Moon Moth, Root Sprite and Cave Troll. Both next-opponent choices avoid the two most recent encounters, including after reload. The chosen preview and encounter use the same saved identity. Legacy fights retain Thornling.
- Enemy size grows with health in both choices and battles, within the space available on screen. Exact health remains visible. Species artwork is fitted by height to reduce silhouette-based size discrepancies. Reading exposure is independent of enemy health. At the three-heart floor after defeat, both choices are distinct three-heart creatures.
- Opponent cards use artwork, hearts, a direction symbol and one short label: Same, Stronger or Easier.
- A wrong choice first shows the actual selected word beside the correct target, with target narration. It holds until the child taps the arrow, then opens the reviewed illustrated sentence. Question-mark help shows the target without inventing an incorrect choice. Help, replays and the first independent demo mistake remain free. Delayed rechecks and observations are preserved.
- Correct answers produce a class-specific projectile/slash, lunge, impact burst, damage number and enemy recoil; a defeated enemy exits. Independent wrong answers produce an enemy attack and hero recoil before teaching. Effects run only after the answer, are cleared before the next word, and respect reduced motion. These remain transformations of still sprites, not frame-by-frame character animation.

## Curriculum correction

The supplied `BLITZWORD_CURRICULUM_200_1000(1)(1).xlsx` contains `sat` at row 756 of BlitzWord 1000, selection rank 755, marked Expansion, with Fry rank 551. It is absent from BlitzWord 200. The prototype had selected it from an existing teaching example rather than the approved Core 200.

New selections now use `on` instead, Core 200 rank 14 (row 15 in BlitzWord 200), with “Pip is on the rock.” The existing picture visibly places Pip on the rock. Other active targets remain rock, tree, green, fox and cave; all are in the supplied Core 200. Past sat records, active saved questions and teaching cards remain supported without being newly scheduled. No workbook was changed.

## Scope boundary

The playable slice still has six reviewed practice words. The remaining 24 words, full chapter completion, final boss and dragon growth are not implemented by this change. Ordinary encounters are not described as bosses. The 30-word indicator expresses the chapter target; this build cannot yet fill it. Assessment still draws on its existing broader pools. Narration remains device speech, not bundled professional audio.

## Assets

Built-in image generation produced `assets/forest-opponents.png` and `assets/pip-forest-welcome.png`. Originals were copied into the repository, preserving alpha in the opponent atlas. Visual inspection checked distinct silhouettes, complete figures, transparent backdrop, Pip identity and scene placement.

Opponent prompt: a transparent 1536×1024 two-by-two storybook watercolor/pencil atlas. Moss Golem top left, Moon Moth top right, Root Sprite bottom left, Cave Troll bottom right. Whole bodies facing left, each isolated within its quadrant, no words, UI or scenery. Existing character atlas supplied for style only.

Welcome prompt: 1536×1024 blue-green woodland with a warm lantern ruin. Exact approved Pip identity from the character atlas, small and walking in the lower-left third with a raised forepaw, looking back, feet touching the path. Existing forest supplied for setting and style. Dark low-detail right half leaves room for the form. No text or UI baked into the image.

## Verification

31 core/audio/storage tests pass, including species rotation and reload, selection identity, health/size independence from reading exposure, legacy sat continuity and non-destructive chapter counts. Seven controller flow groups pass using isolated memory storage: first-battle win/loss/help, returning victory/defeat, save failures and Home/resume during correction and teaching. Browser visual review of the changed build remains pending: automatic approval review rejected the GitHub push, so the live version has not changed. Physical iPad/Safari audio and animation performance remain unverified.

Rollback point before this work: `213f80ae70c842e88e68f84219ec7819625a8685`. Reverting this change must not reset learner storage.
