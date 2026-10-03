# Fight artwork correction — 3 October 2026

Build: `fight-art-20261003-r1`. Deployed and verified. [PR #117](https://github.com/Ikarus-eth/Blitzword_app/pull/117) merged as `7d577a7ca16f8ff5bdba911763a6c90b0470c060`. [Pages run 37109896368](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/37109896368) succeeded; the live build and all five changed runtime/artwork files match local SHA-256 hashes. [Deployment evidence](DEPLOYMENT.json).

The mage's transparent blue-screen footage retained opaque and partly transparent blue edge pixels. His SVG still now applies an sRGB alpha matte; decoded animation sheets receive the same soft key once at load time and are cached. Original frame assets, poses, spell origins and timings remain. The key targets the mage only because his approved artwork contains no intentional saturated blue. Browser alpha rounding is allowed in the pixel check.

Pip's new friendly-neutral battle still replaces the lowered-brow rest frame for stage zero. It was made with the built-in ImageGen tool from `assets/battle-motion/pip-still.webp`, preserving the character identity and transparent background. The fire motion remains; its first 120 ms blend from neutral, and 850–1050 ms return to neutral. A held finishing attack therefore cannot leave him scowling. Existing later growth forms remain.

Validation: 282 unit tests and 99 UI-flow groups pass. An isolated Chromium check scans the mage's five decoded sheets plus still, checks all clips ready, captures assist states at 0/500/950/1050/1200 ms, and checks actual battle layouts at 820×1180 and 390×844. Phone/tablet screenshots and before/after comparison are retained here. Physical iPad/Safari remains unverified. Gameplay, storage, XP, curriculum, existing growth and parallel branches are unchanged.

Run the browser check with the repository served on port 8779, `PLAYWRIGHT_MODULE` pointing to Playwright and `CHROME_EXECUTABLE` pointing to an isolated Chromium executable: `node tests/fight-art-browser.cjs`. The test creates its own browser contexts and synthetic saves.

[Built-in ImageGen edit prompt and output path](ARTWORK.json).
