# Map reading layout — 11 October 2026

Deployed and verified through [PR #168](https://github.com/Ikarus-eth/Blitzword_app/pull/168), 11 October 2026 (Asia/Makassar). [Pages run 38094166255](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38094166255) succeeded. [All nine checked live files match](MAP_READING_LAYOUT_DEPLOYMENT.json). A live isolated main-game browser check confirms expansion, pinned clue and zoom-preserving answer navigation.

The Hidden Atlas collapses its introductory masthead while a map is open and restores it on the map chooser. Its map and reading panel sit side by side above 900 px, with a sticky map while the reading panel scrolls. Main-game River Song and Sky Stars searches use the same layout.

At narrower widths, the clue and question accompany the image. Expanded maps retain that text at every width. An Answers control closes expansion, preserves the camera and moves focus to the written choices. The clue refreshes when the question advances, when retry is needed, and on completion. The new control and clue are included in the standalone German text translation. Toolbar controls wrap on narrow phones and short landscape screens retain a usable picture area.

No gameplay, image, answer, reward, save-format or learner evidence changes. The separate four-scene Dragon path has its own viewer and is outside this map-search update. Review decisions and the proposed fourth adventure are in [the follow-up](../adventures/REVIEW_FOLLOWUP_20261011.md); shield and language-variant proposals are not implemented.

Validation: 371 unit tests and all 118 interface-flow groups pass, including the focused map assertions. The map-flow group additionally checks expansion, Answers returning without a saved-state change, zoom retention and clue refresh. Browser checks cover the standalone English/German screen, expanded clue, phone toolbar, main-game map and landscape mode; final results are recorded in CURRENT_STATUS.md. Physical iPad touch/audio remains unverified.
