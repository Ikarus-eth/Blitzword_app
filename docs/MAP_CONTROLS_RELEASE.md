# Decluttered campaign map — 25 September 2026

Build: `map-declutter-20260925-r1`.

The current chapter's gold number and full name now form the continuation button. The fifth forest chapter is labelled **Hidden Nest**, its existing full name, instead of the confusing abbreviation **Home**. The separate destination/Play panel is removed. Completed and locked markers can still be inspected, while the current entry stays visible and continues the saved activity. Repeated stale taps do not restart it.

The pending “Today · 0 / 1 chapters” field is removed. A completed chapter and returning bonus appear only when earned; narrow portrait and short landscape show only the active XP boost. Daily reward rules are unchanged.

- Parent access is a small gear in the lower-left corner. Each opening generates a new subtraction question: 300–999 minus 40–249, with both numbers written in British English words. For example, “five hundred and twenty-six minus one hundred and forty-eight”. The answer is entered as digits; blank, decimal, hexadecimal and scientific-notation input cannot unlock it. Cancel discards the challenge.
- The current movement icon opens a compact speed dropdown. It toggles closed, closes on Escape/outside click, restores focus where appropriate, and saves the selected existing pace. Calibrated reading-check timing and Ride/Fly locks are preserved. The Pause screen retains its larger speed dialog.
- The hero picture opens the existing hero selection. The separate Hero button is removed. The portrait is kept reachable on small screens, below the upper-right tools in narrow portrait.
- Chapter numbers have no blurred text shadow. Parchment surfaces, dark forest text, gold accents and the full-screen approved artwork remain. All 35 current destinations have responsive positioning; portrait uses an alternating trail.

Only `index.html`, `app.js` and the campaign-scoped portion of `styles.css` change the playable app. No curriculum, core gameplay, save format, approved image or recorded audio changes. The existing Pages workflow and storage keys are preserved. Main `1980f97d` was integrated before release, including the independently published archer prototype; this update does not adopt it into gameplay.

## Verification

- Node 22.23.3: `npm ci --ignore-scripts --offline` and `npm test` passed: 239 automated tests (including the five intervening archer-rig tests) and 86 UI-flow groups.
- New UI checks cover direct chapter entry, locked previews, repeated taps, removal of the empty quota/footer, hero selection, speed dropdown toggle/Escape/outside/select/Pause behavior, and parent worded-subtraction boundaries, the user's example, invalid answers, cancel and successful entry. Existing assertions changed intentionally for the removed controls and new accessible labels.
- Isolated Chromium: all 35 active destinations at six viewport sizes (210 cases), plus five selected destinations with earned completion/boost/returning rewards at every size (30 cases). Sizes: 1180×820, 820×1180, 390×844, 844×390, 320×568 and 667×375.
- Every map filled the viewport. No marker/active label overlapped the floating controls; no target/control extended outside the viewport; no horizontal overflow, blurred number shadow or page errors. Active label hit tests passed. Speed, hero, parent-gate cancel, direct chapter entry and Home-return interactions passed at all six sizes.
- Review fixtures used memory-only synthetic saves, with zero learner-localStorage writes. Tablet, phone, dropdown, parent-gate and earned-reward renders were visually inspected. [Recorded checks and source hashes](MAP_CONTROLS_CHECKS.json).
- Physical iPad/Safari and hardware safe areas remain untested.

## Deployment

Implemented and locally tested; deployment verification is pending. The previous verified playable build is `fullscreen-map-20260925-r1`. After release, reload the app and check the gold chapter label, speed dropdown, hero portrait and lower-left gear on the iPad. No save reset is needed.
