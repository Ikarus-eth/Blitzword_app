# Child interface release

This change addresses the feedback after the recovered release. It simplifies setup and the map, fixes all shared teaching illustrations, adds a static galaxy mask and Pip reactions, exposes voluntary reading speeds, adds fullscreen and soundscape controls, and changes new multiplication rounds to net scoring with a visual countdown.

Verification covers saved questions retaining their exposure, locked Ride/Fly, unchanged assessment calibration, negative scores, PR/target calculation, old-round compatibility, Home/reload, permanent XP, and the actual hidden attribute on teaching SVGs. The existing one-hour gameplay simulation and all other save/migration tests are retained.

Prerecorded narration is implemented by the subsequent recorded-voice release. See `NARRATION_RELEASE.md` for generation provenance, playback behavior and verification limits. The soundscape remains separate, locally synthesized audio.

Fullscreen source: https://webkit.org/blog/13966/webkit-features-in-safari-16-4/ documents the Fullscreen API on iPadOS. https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen documents its user-activation requirement. Actual iPad voice/fullscreen behavior still requires a device check.
