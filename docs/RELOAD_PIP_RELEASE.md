# Reload and Pip crop fixes — 24 September 2026

Immediate reload during play could deliver an old pagehide storage event after the new document had already loaded and saved. Comparing event.newValue with the new store expected value raised a false conflict. The listener now reads the current primary save: stale notifications are ignored, real writes/clear/removal still block, and unrelated keys/storage areas are ignored. Save keys, backup handling and optimistic checks before writes remain.

Grown Pip used a viewBox without clipping the source atlas. A tall/narrow SVG viewport could display neighbouring cells in its letterbox area. Each image now has a unique clipPath with the selected crop's coordinates. Existing image bytes, forms, XP and animations are unchanged.

The new stale-event regression fails on the original source. A clean Node 22 install and npm test pass: 232 core tests and 83 UI-flow groups. New tests cover stale unload values, deletion notifications, genuine competing writes, storage clear, backup/other-area notifications, and explicit unique crop boundaries for all three grown forms. No existing behavior assertions were relaxed.

Twelve isolated Chromium scenarios exercise all three grown forms at 1180×820, 820×1180, 390×844 and 844×390. Immediate reload retains the question identity, choices and XP; a real second tab still triggers the conflict. No page errors or horizontal overflow. Growth/battle screenshots were inspected. Physical iPad/Safari remains untested.

Build: reload-pip-fixes-20260924-r1. Deployment verification follows in the docs-only batch record.
