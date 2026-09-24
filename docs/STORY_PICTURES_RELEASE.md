# Story picture checks — point 6

Implemented and locally tested; awaiting merge and Pages deployment verification. Build: `story-pictures-20260924-r1`. The user approved all 34 entries from [PR #66](https://github.com/Ikarus-eth/Blitzword_app/pull/66) on 24 September 2026 before implementation.

## Child flow

The established narrated introduction is unchanged. The next screen presents the approved child-read sentence and two pictures, with the prompt “Which picture shows what you read?” All 34 sentences and pairs match [the approved review](STORY_SENTENCE_REVIEW.md). The exact-token audit remains 158/161 previously available word occurrences; the only exceptions are jump, the and look in entries 01, 03 and 04. These words are underlined buttons that speak only the word. Listen remains available for the whole sentence. Reading is untimed and does not start speech automatically.

The two positions are shuffled once per story and saved with the sentence and correct-picture key. The first tap commits the outcome immediately. The matching picture receives a green border and check mark after either choice, and Continue returns to the original pending battle. A wrong choice does not ask for a retry or affect health. There is no XP, word evidence, chapter progress or active-time credit. Existing approved images are drawn with explicit clipping rectangles so neighbouring atlas panels cannot bleed into the choices.

Image load failure or an eight-second stalled request offers Continue and records pictures unavailable, with a null answer instead of an invented error. No new assets or narration clips are generated. The existing narrator uses exact matching recordings where available and device speech otherwise; personalized names continue to use its existing fallback.

## Saves and Parents

Each pending scene snapshots `reading`: version, sentence, untaught-word key, shuffled option keys, match key, first choice, outcome, answer time, sentence-listening flag, unique word-listening list and picture-unavailable flag. Accepted outcomes are also stored immediately in the bounded per-area `story.scenes` record; Continue adds completion time. Duplicate taps, old controls and callbacks after Pause/Home cannot replace an accepted response.

Migration adds a check only to an unfinished old intro/read scene. It preserves the phase, narration completion, earlier Listen help and pending battle. Earlier completed stories remain completed, with no invented correct/incorrect result or retroactive replay. The `blitzword_state_v1` key and all backup keys are unchanged. Backup export/restore preserves pending choices, help and feedback.

Parents → Story picture checks lists chapter, sentence, first-choice outcome and listening before that choice. Summary counts include real picture answers only; unavailable art and older confirmations are labelled separately. The view explains the two-option 50% chance level and does not treat a picture match as proof of independent reading or mastery. Broader Parents changes remain point 8.

## Validation

[Machine-readable local verification](STORY_PICTURES_CHECKS.json).

- Clean dependency install and `npm test` on Node 22.23.3; 184 core tests and 63 UI-flow groups pass.
- Eight new core cases cover the entire approved content set, earlier-field vocabulary, exact asset hashes/crops, both picture positions, persistence and no-credit rules, bounded listening help, old-scene migration, backups and unavailable pictures.
- Six new interface groups cover both outcomes, all three word buttons, speech locks, stale taps, Pause/Home/reopening, Parents, unavailable images and stalled image requests. Existing story/scenery tests now choose a picture before Continue because confirmation behavior intentionally changed. The personalized-name fixture moved from Reed Path to River Gate because the approved Reed Path sentence no longer contains Pip; all original phase, scenery, naming and continuation assertions remain.
- Forty Chromium scenarios cover all 34 entries, iPad landscape/portrait and phone portrait/landscape, exact displayed crops, saved feedback/order, parent results, legacy migration, failed image loads and the stalled-request fallback. Speech completion is stubbed in browser flow checks; this is not listening QA.
- Physical iPad/Safari/WebKit and real-device listening remain untested. The existing immediate-reload conflict and growth/battle sprite issues remain outside this point.

## iPad check

At the next unseen chapter, listen to its introduction, read the sentence and choose either picture. For entries 01, 03 or 04, tap the underlined word and check that only that word is spoken. Try one wrong choice: the matching picture should be marked and Continue should proceed without damage or XP. Use Home, leave and reopen during reading and after choosing; the same pair/order and feedback should return. Parents should show the first outcome and any listening.

Previously completed stories are deliberately not replayed. No save reset is needed or appropriate to test this change.

## Deployment

Pending. The implementation PR must merge current main, pass the Pages workflow, then verify the live build marker and changed runtime files byte for byte. A separate docs-only PR will record that verification.
