# Active play release — 22 September 2026

This release supersedes the six-word limit, capped XP, early growth thresholds and pending-deployment notes in earlier implementation documents. It includes the previous first-session fixes and campaign map.

## Playable chapter

Thirty targets from the supplied Core 200 are divided into five six-word locations. Unlock each place by introducing all its words, practicing at least five successfully twice and securing its two-victory checkpoint. The next place then becomes available. A designated guardian encounter follows completion of all five places. Winning it with the chapter practice criterion satisfied completes the story. Review remains playable afterwards, with no daily limit or XP cap. Challenges still end around seven confirmed active minutes and can be continued; new words remain limited to six per challenge.

The existing five enemy species rotate. Both choices exclude the two most recent species, and least-recently-seen species are prioritized to avoid a smaller repeated cycle. A stronger health choice is visually larger. Enemy identity and health persist through Home and reload.

Core 200 ranks verified from `BLITZWORD_CURRICULUM_200_1000(1)(1).xlsx`, sheet BlitzWord 200:

on (14) | rock (156) | tree (157) | green (120) | fox (164) | cave (159) | water (167) | bird (172) | wing (178) | jump (181) | over (99) | up (25) | big (64) | small (139) | two (96) | red (185) | book (163) | open (130) | night (91) | moon (166) | light (125) | fire (168) | owl (170) | forest (161) | dragon (160) | treasure (174) | coin (182) | gate (196) | castle (173) | magic (175)

## XP and growth

Every independent correct campaign response awards 1 XP, including review. Help, demo, assessment and speed earn no bonus. Old earned XP and forms are preserved. The three future thresholds are:

| Form | XP | Confirmed practice | Minimum time since first practice | Additional gate |
| --- | ---: | ---: | ---: | --- |
| Young Pip | 250 | 250 minutes | 14 elapsed days | None |
| Growing Pip | 750 | 750 minutes | 14 elapsed days | None |
| Rideable Pip | 1,500 | 1,500 minutes | 14 elapsed days | Final chapter victory |

Every condition must hold. Fourteen days means elapsed time, not fourteen distinct practice dates. The map displays XP, remaining minutes and remaining days. Story progress can advance today while growth remains gradual. XP is a game reward, not a reading assessment.

## Interaction-confirmed timing

`engagement.js` uses monotonic intervals and provisional segments. Only a meaningful game action confirms the preceding segment: answer, Ready, teaching replay/continue, correction continue, Home or manual pause. Pointer movement and arbitrary taps do not renew the timer. At 30 seconds without a game action, all provisional time since the last confirmation is discarded and the game pauses. This prevents an abandoned page receiving a 30-second grace-period reward.

Menus, map, result selection, parent dashboard and pause panels are excluded. Hidden pages, window blur and device sleep discard unconfirmed segments. A timer gap above five seconds is conservatively treated as suspension, rather than credited as elapsed practice. Reload never backfills time since the last save. Confirmed totals are saved locally, grouped by device-local date, with intervals crossing midnight split exactly. Session time uses this same ledger. A second tab cannot overwrite a newer save.

This is an interaction-based estimate, not measurement of attention. Thinking for over 30 seconds, a long browser stall or closing the page before confirming an interval can undercount. Idle totals show observed discarded reading intervals, not the duration of all later pauses/background time. These limitations are stated in the dashboard.

Previous versions counted foreground waiting. Their elapsed totals are preserved as historical unverified time, excluded from both new active totals and growth requirements. The dashboard deduplicates the current/completed session when displaying this historical total. Existing qualifying answer dates establish when practice began, but do not invent active minutes.

## Parent dashboard

Home → Parents → arithmetic gate. Shows active play today, total active play, growth-eligible practice, observed idle excluded, current growth conditions, introduced/practiced words, unaided answer counts and the latest 30 daily rows. Demo/assessment time is separated from campaign practice. Data stays on this browser/device; there is no cross-device aggregation or remote analytics.

## Teaching assets

`assets/teaching/chapter-teaching.png` was generated with the built-in image generator using `assets/teaching/fox.webp` for Pip identity and the existing watercolor/pencil style. It is a 1536×1024 four-scene atlas. Runtime SVG viewports select each complete panel without raster edits; artwork is never shown with answer choices.

Visual review confirmed: Pip airborne over water and an upward-flying bird with spread wings; exactly two red books, big/open versus small/closed; night forest with moon, owl and a fire illuminating Pip; castle gate, treasure chest and a magically levitating coin. Each sentence was checked against its panel, and each target has four distinct word choices. Teaching pictures continue to depict hatchling Pip.

## Verification

Generation prompt (built-in tool): Use case: illustration-story. Asset type: one 1536x1024 teaching-scene atlas for BlitzWord, EXACTLY a 2x2 grid of four equally sized 768x512 full illustrations, no gutters or text. Reference image is the established watercolor/pencil storybook style and exact hatchling Pip identity ONLY, not an edit target. Pip is a small orange dragon with cream furry chest, gold horns, blue-gray wing membranes with gold flame markings. Keep Pip secondary to the instructional objects. TOP LEFT: side view of Pip making a clear leaping jump OVER a narrow blue stream, hind feet airborne, two distinct banks; above Pip one small bird flies UP with both feathered wings widely visible. Clear visible water below, no ambiguity about airborne jump. TOP RIGHT: Pip comparing exactly TWO red hardcover BOOKS side by side on a tree-stump table. One book is obviously BIG and OPEN, showing cream blank pages and its red cover. The other is obviously SMALL and CLOSED, red cover visible. Pip points to the open large book. No other book-shaped objects. BOTTOM LEFT: a NIGHT forest clearing, large visible luminous MOON and dark starry sky, a recognizable OWL on a low branch beside Pip, a small campFIRE with bright flame casting LIGHT on Pip, owl and tree trunks. No other animals. BOTTOM RIGHT: a CASTLE courtyard with a large iron GATE, an open TREASURE chest spilling golden COINS. Hatchling Pip the DRAGON, prominently visible, uses a raised paw to make golden magical sparkles swirl and levitate ONE COIN just above the treasure. The rest of coins sit in the open chest. Distinct stone castle towers visible behind gate. No UI, words, numbers, labels, watermarks or panel borders. Each 768x512 quadrant must be a complete independent wide composition safely inside its boundary; important objects away from edges.

43 core/audio/storage/timing tests and ten controller-flow groups pass. A simulated hour with occasional errors/help covers 360 answers, 30 targets, all five enemy types, five explored places and the final chapter victory. Eight completed challenges lead into the ninth. It earns 317 XP during the hour and another XP on a subsequent answer. Twenty-five added wall-clock minutes of inactivity do not increase the 60-minute active total. The dragon remains a hatchling on day one.

Timing tests cover full provisional-interval discard, background/blur/suspension, excluded screens, separate demo/assessment, local midnight, historical migration, repeated reload, two-week/250-minute/XP gates and storage failures. Controller tests cover automatic idle pause, unchanged questions, gated dashboard values, all four teaching panels and resumption. `npm test` is the reproducible command. GitHub Pages now runs these tests and deploys only the static app and isolated visual-review entry points, excluding development dependencies.

Live browser and deployment results are recorded after release verification. Physical iPad/Safari behavior remains a device-specific follow-up; cloud Chrome does not establish Safari audio behavior.
