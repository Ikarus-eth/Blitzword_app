# Full-screen campaign Home — 25 September 2026

Build: `fullscreen-map-20260925-r1`.

The campaign artwork now fills the app viewport. The inset green board, header strip, footer strip, rounded outer border and inset shadow are removed. Campaign/daily progress, Parents, Hero, reading speed, sound, Play and Pip XP float above the art on warm cream parchment with dark forest text and gold accents. Muted sound keeps an opaque, readable surface and a crossed speaker.

The original forest and all six campaign atlas panels are retained. They fill the viewport proportionally; portrait and very wide views crop the artwork instead of stretching it. The chapter trail stays visible and interactive. Narrow portrait layouts reserve a central region between the controls and omit the decorative traveller; short landscape places Play at the bottom centre. Device safe areas protect edge controls. There is no browser fullscreen API or new fullscreen button.

Implementation is scoped to the campaign map at the end of `styles.css`. `show()` applies `mapHome` only while the map is active, and exiting restores the other screens' toolbar styling. The existing Pages workflow publishes the existing stylesheet without any workflow change. The build marker and changed script/style cache versions are updated. Learner storage, gameplay, curriculum, XP and approved character assets are unchanged. The intervening Thornling tail fix from main `6e7bf84` is preserved, including both enemy script cache versions. The subsequent documentation cleanup in main `f2bd911` is also retained.

## Verification

- `npm ci --ignore-scripts --offline` completed; 234 core tests and 83 UI-flow groups passed. The existing saved-map/resume regression now also checks that the map appearance switches off when entering battle.
- Isolated Chromium checked 40 layouts: first/final destinations in campaign one and the final destination in all six later campaigns at 1180×820, 820×1180, 390×844, 844×390 and 320×568. Every map fills the viewport; no chapter button overlaps the floating controls, no controls extend outside the viewport, no horizontal overflow and no page errors. The review entry uses in-memory saves; browser learner-storage writes were zero.
- Real browser interactions passed at six sizes (the five above plus 667×375): all five chapter buttons, locked Play, Parents/Back, Hero/return, speed choices, keyboard-opened Pip growth, sound, Play and Home. No learner-storage writes occurred.
- [Recorded local checks](FULLSCREEN_MAP_CHECKS.json).
- Tablet and phone renders were visually inspected, including all seven campaign artworks at landscape tablet size.
- Physical iPad/Safari playback and device safe-area behavior remain unverified on hardware.

## Deployment

Deployed and verified. [PR #84](https://github.com/Ikarus-eth/Blitzword_app/pull/84) merged as `addfc3745182eac0900a5c12cdf7a20ded201b18`. [Pages run 36077841263](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36077841263) completed successfully. At 00:31 UTC on 25 September 2026, the live build marker was `fullscreen-map-20260925-r1`; `index.html`, `app.js`, `styles.css`, `enemy-art.js` and `enemy-art-data.js` returned HTTP 200 and matched the merged source byte for byte. [Verification record](FULLSCREEN_MAP_DEPLOYMENT.json).

Reload the iPad app to load the changed asset versions. Check the edge-to-edge artwork, readable floating controls and Play/Pip panels in landscape and portrait. Physical iPad/Safari remains untested. Previous main `f2bd9115cc2fb0264e635696304190e51daf7668` is the rollback checkpoint; no learner save reset is required.
