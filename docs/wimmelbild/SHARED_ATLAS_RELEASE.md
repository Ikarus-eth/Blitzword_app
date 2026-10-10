# The Hidden Atlas — shareable maps-only edition

The user requested a separate link for the five large search maps, without access through the page to the whole game. Share `https://ikarus-eth.github.io/Blitzword_app/assets/map-quest/`.

All five maps are immediately available. The page reuses the approved 3072×2048 images, fifteen questions and existing viewer. It contains no main-game launcher, battles, profile setup, campaign prerequisites, XP or learner-save integration. All navigation stays within the five-map experience. The main site remains publicly hosted; this page is not an authentication boundary.

Each map starts with four lives. Wrong submitted answers cost one; duplicate or stale callbacks are rejected. At zero, an explicit retry restores four lives at the current question, retaining solved questions. Completed maps can be replayed individually. Progress uses only `blitzword.hidden-atlas.v1`, independent of both the main learner save and the earlier Dragon path. Invalid saves and concurrent changes are reported without overwriting them; failed writes do not commit in-memory progression.

Pinch, drag, wheel, keyboard, zoom buttons and big-picture view use the existing viewer. Questions and written-only choices sit below the image. Clue and individual-word speech use the browser's speech support. Selecting answers leaves the image and camera intact.

Validation: four focused unit tests cover all fifteen answers, life loss, duplicate/stale submission rejection, retry/reload, corrupt saves and isolated entry. Browser checks complete all five maps at 1180×820 and 390×844, including life loss, zero-life retry, zoom, image dimensions, picture taps, reload and completion. A main-save sentinel is unchanged; no main runtime is requested and no links lead to the main game. See `shared-browser-checks.json`. Physical iPad speech/gestures remain untested.

Deployment verification will be recorded after publication.
