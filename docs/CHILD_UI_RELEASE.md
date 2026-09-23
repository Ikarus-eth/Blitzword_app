# Child interface release

This change addresses the feedback after the recovered release. It simplifies setup and the map, fixes all shared teaching illustrations, adds a static galaxy mask and Pip reactions, exposes voluntary reading speeds, adds fullscreen and soundscape controls, and changes new multiplication rounds to net scoring with a visual countdown.

Verification covers saved questions retaining their exposure, locked Ride/Fly, unchanged assessment calibration, negative scores, PR/target calculation, old-round compatibility, Home/reload, permanent XP, and the actual hidden attribute on teaching SVGs. The existing one-hour gameplay simulation and all other save/migration tests are retained.

The subsequent recorded-voice release added 165 clips; expanded Core 200 narration remains outstanding. See [narration history and limits](NARRATION_RELEASE.md). The later [adaptive forest soundscape](SOUNDSCAPE_RELEASE.md) is implemented and deployed. See [current status](CURRENT_STATUS.md) for the active backlog.

Fullscreen source: https://webkit.org/blog/13966/webkit-features-in-safari-16-4/ documents the Fullscreen API on iPadOS. https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen documents its user-activation requirement. Actual iPad voice/fullscreen behavior still requires a device check.
