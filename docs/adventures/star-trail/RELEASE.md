# The Sky That Lost Its Stars

Implemented and locally verified, 10 October 2026. Deployment is recorded separately after the Pages workflow and live-file checks.

The user requested a third major adventure, eight subchapters with nine tasks each, and eight additional enemies. The original Forest Lights and River Song adventures retain their IDs, stories, allocation and saved progress. The third adventure opens only after both earlier adventures are complete.

| Subchapter | New approved creature | Treasure | Opens after |
| --- | --- | --- | --- |
| The Letter from the Snow Owl | Snow Owl | Silver star piece | River Song and Forest Lights |
| The Lynx and the Crystal Pass | Frost Lynx | Blue star piece | Letter |
| The Hare’s Winter Garden | Snow Hare | Green star piece | Letter |
| The Yak and the Cloud Lift | Cloud Yak | Cloud star piece | Pass and Garden |
| The Marmot’s Missing Stores | Pinecone Marmot | Amber star piece | Lift |
| The Falcon’s Wind Tower | Gale Falcon | Gold star piece | Lift |
| The Ibex and the Moon Steps | Lichen Ibex | Violet star piece | Stores and Tower |
| The Sky Shines Again | Aurora Elk | Aurora star piece | Moon Steps |

Each has four reading fights alternating with four authored riddles, then one map search containing three questions. That is **72 tracker tasks: 32 fights, 32 riddles and eight map searches**, with 24 individual picture questions. Reading health stays 8 / 9 / 10 / 12. Each chapter pairs its new family with a familiar friend; the new creature earns a champion stamp at fight three. Previously approved art, battle motions and name recordings are reused. Eight new families become earnable, bringing the available total to 28 of the 65 book entries; the remaining 37 keep their future-chapter messages. Normal discovery, clue, champion and companion rules apply.

Four shared hearts, wrong-answer penalties, the two-step retreat, first-solve rewards, time caps, adaptive reading and existing curriculum remain. There is no save-version change. Pending old choices, parked Word trails battles, completed quests, XP and existing companions survive. A small-screen layout correction keeps the tracker from shrinking beneath long chapter content. Campaign locking now checks all preceding adventures, treasure totals derive from each campaign, onward buttons select the next campaign, and parent reporting uses current mission/book totals.

## Artwork and search-answer audit

Eight separate built-in ImageGen calls produced eight continuous 1536×1024 paintings, saved under `assets/adventures/star-trail/`. They serve both as chapter illustrations and ninth-task search pictures. These are native-resolution images, not 4K assets or enlarged composites. No approved recurring hero, Pip or creature artwork is replaced. [Exact prompts and hashes](art-prompts.json).

The final images were inspected individually before finalising the following answers. Each three-question set stays on one image. All answers are written choices below the image; picture taps only explore. Searches mix distributed counting, locations, contents, colour identification and a traced connection.

| Picture | Question 1 evidence | Question 2 evidence | Question 3 evidence |
| --- | --- | --- | --- |
| Star Post | White cat in blue wheelbarrow, lower right | Red scarf on line, upper left | Yellow flowers in central stream boat |
| Crystal Pass | Brown dog on barrel, lower left | Red apples under green umbrella, upper right | Red boat under central stone bridge |
| Winter Garden | Two snowmen: by upper-left glasshouse and lower-centre path | Black cat on yellow bench, lower right | Carrots in red wheelbarrow, centre |
| Cloud Lift | White goat on shed roof, lower left | Yellow kite in pine, upper right | Two hanging cable baskets, centre and right; cart excluded |
| Pine Store | Blue ribbon held by squirrel in upper tree | White cat in green basket, lower left | Pumpkins in wooden cart by bridge, right |
| Wind Tower | Red kite string reaches girl in yellow | Blue bird on gold bell high on tower | Brown dog beneath wooden bench, lower left |
| Moon Steps | White rabbit inside red boat, lower left | Green lantern beneath right arch | Yellow backpack on upper-right wooden bench |
| Aurora Crown | White cat on red cushion outside upper-right dome | Four ducks: two above bridge, two below | Brown dog carrying green scarf on central bridge |

New story/riddle text uses the existing device-speech fallback. No paid narration was generated. The original recordings, including all 1,000 target words, are retained.

## Verification

- 371 unit tests and 118 UI-flow groups pass. The original 12-chapter playthrough remains covered separately.
- The added deterministic playthrough completes all 72 tasks, repeatedly reloads/round-trips backup files, earns all eight new Met/Clue/Star sets, selects each new companion and checks earlier campaign records remain identical.
- Additional gates reject bypassing either earlier campaign or either arm of a branch join. The new book path can reveal a locked chapter location without allowing it to start.
- [24 Chromium map journeys](browser-checks.json): all eight maps at 1180×820, 390×844 and 844×390. Each checks three answers, actual image dimensions, wrong-answer life loss, duplicate-submit guarding, reload retention, nine-task completion and no horizontal overflow. Real two-finger pinch events and expansion/Escape are exercised on the first map. No page errors.
- [Hub and battle browser checks](hub-checks.json): three tabs, eight chapter cards, 0/8 treasure label, nine-step intro and actual Snow Owl encounter at tablet landscape/portrait and phone sizes. Screenshots are retained alongside this release.
- The unchanged Pages workflow includes both new content modules through its existing assets copy. All changed script syntax and `git diff --check` pass.

Physical iPad/Safari, child enjoyment and subjective listening have not been tested. Automated timings are not an estimate of how long the child will take.
