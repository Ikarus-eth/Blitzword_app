# Pip B and still-image clarity — 3 October 2026

Build `pip-b-scenery-20261003-r1`. Implemented and locally tested; deployment pending.

## Changes

Small Pip uses the exact approved B alternative at `assets/battle-motion/pip-friendly-b.png` (1280×1280); the old friendly image is retained for provenance. The existing fire motion, 850–1050 ms return to the neutral face, and finishing-blow behavior remain. [Selection and prompt](PIP_B.json).

Campaigns 2–7 previously stretched individual 512×512 cells from a six-image atlas across the screen. Each now loads a standalone 1254×1254 restoration: 2.45 times the linear pixel resolution, about six times the pixels. The matching six chapter-background references also use these files. The first map uses a detail-restored 1536×1024 version of the existing illustration; its pixel dimensions did not increase. Original images remain in the repository. The images preserve the scene composition and recognizable landmarks but their fine detail is regenerated, not recovered from an unavailable larger original.

The map uses ordinary `cover` sizing with preserved proportions, and no longer downloads/renders a second low-resolution atlas behind it. Only the active map is requested. All seven generated sources were inspected. Delivery uses WebP quality 90 with no resizing, leaving the 35 chapter backgrounds within the existing 16 MB total / 950 kB per-image budgets. Saves, map positions, curriculum, XP, growth and animation sheets do not change.

## Audit and limits

[Machine-readable inventory](AUDIT.json) covers 89 unique bitmap files across 313 uses: campaign/chapter scenery, battle stills, teaching pictures and their actual crop dimensions, meaning pictures, growth, story adventures, shared portraits and fallback sources. Review-gallery alternatives, retired prototypes and animation sheets are excluded. The reproducible read-only audit is `scripts/audit-still-images.cjs` (requires an existing Sharp installation via `SHARP_MODULE`).

At an 820×1180 CSS-pixel viewport, the six new square scenes supply 1.063 source pixels per CSS pixel (formerly 0.434). At 2× device density that is 0.531 source pixels per device pixel: a material improvement, **not a guarantee of pixel-for-pixel Retina resolution**. The image tool returned 1254×1254 / 1536×1024 native files despite larger requested sizes; no dimensions were fabricated and no simple enlargement was used to claim extra detail.

The other 29 chapter scenes and story-adventure paintings are 1536×1024; growth illustrations are 1024×1024. The existing character stills are 512×512 files with smaller effective transparent crops, and teaching atlas cells can be as small as 362×362. They can look soft when enlarged or on high-density displays. Their native limits are recorded rather than silently replacing approved character/teaching artwork. This release fixes the campaign atlas issue; it does not claim every legacy still is Retina-native. Physical iPad/Safari visual quality remains unverified.

## Verification

283 unit tests, 99 UI-flow groups, 21 isolated Chromium map checks across portrait tablet, landscape tablet and phone layouts, and decoding all 89 still-image sources. Map checks assert the active full-size source, cover sizing, no horizontal overflow, no old atlas request and retained pending battle / XP / chapter progress. Existing motion-browser checks verify Pip B in phone/tablet battles and the attack-to-neutral transition. The only changed UI test expectation is that the redundant map underlay is hidden while the map terrain itself has the correct campaign image.

[Browser checks](browser-checks.json). [Built-in ImageGen prompts](GENERATION_PROMPTS.json). [Actual files, sizes and hashes](ASSETS.json).
