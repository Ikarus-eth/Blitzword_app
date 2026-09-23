# Campaign map and Pip growth — 22 September 2026

> Historical release note. The later Core 200 and XP-only growth releases supersede this milestone’s word limit, growth thresholds, time/day gates and deployment status. See [current status](CURRENT_STATUS.md).

The later `ACTIVE_PLAY_RELEASE.md` supersedes this milestone’s XP cap, growth thresholds, six-word limit and deployment status.

## Implemented behavior

Campaign Home is now a five-location illustrated map: Lantern Trail → Fox Crossing → Old Grove → Lantern Ruins → Hidden Nest. The hero marks the current place. Tapping a landmark shows its short story goal; completed locations have a check. The chapter meter counts explored places out of five on the map, encounter entry, battle and results. Available-area details separately show introduced words, practice and the two-victory checkpoint.

Reading-check completion explicitly says “Reading check complete · Chapter 1 begins” on the map before the first campaign word. Home preserves the activity and exact question, options, correction, teaching card, health and committed answer. The map pauses the challenge clock. Returning to an answer does not award XP or apply damage again. Hero selection remains available from Home.

Pip’s growth panel shows the current form, total XP, a progress bar, XP remaining to the next form and illustrated stage previews. Portrait layouts also put the next-stage caption beside the chapter overview so it is visible before scrolling. Accepted qualifying answers show +5 XP after answering; a growth answer changes the companion art and announces the new stage. Results repeat the total and next-stage requirement.

## Permanent rewards and completion rules

| Reward | Rule |
| --- | --- |
| XP | 5 XP for each of the first two independent correct campaign answers per target; maximum 10 XP per word |
| Hatchling Pip | 0 XP |
| Young Pip | 60 XP |
| Growing Pip | 180 XP |
| Rideable Pip | 300 XP **and** Chapter 1 completed |
| Lantern Trail explored | All six active words introduced; at least five have two practice successes; checkpoint at two victories secured |
| Future chapter completion | All chapter targets introduced, at least 80% with two practice successes, every available area explored, and an explicitly designated final encounter won |

Demo, assessment, supported answers and speed do not award XP. Mistakes and defeats never subtract XP or earned forms. Previously recorded independent campaign successes recover credit once during migration; ambiguous legacy records without task/support metadata do not invent credit. Repeated reloads merge the same capped credit. Existing assessment, battle and teaching observations are preserved.

Explored story locations stay explored even if a later retention check fails. Current word practice can change independently. XP and story progress are game rewards, not mastery scores or evidence of long-term retention.

## Current content boundary

Lantern Trail has the six reviewed words: on, rock, tree, green, fox and cave. The other four map locations are explicitly labelled Coming soon; they can be inspected but cannot be started. The current slice earns up to 60 XP and reaches Young Pip. Existing saved legacy-word credit is retained if supported by qualifying records.

The remaining chapter words, teaching support, area-specific encounters and final boss remain unimplemented. Repeating the six-word slice cannot farm the 180/300 XP stages or falsely finish the chapter. Existing teaching illustrations continue to depict hatchling Pip; stage-specific teaching illustrations would require another art review. The map is a Chapter 1 overview; later chapters are not represented.

## Asset provenance

The built-in image generator produced these 1536×1024 originals, copied into the repository without raster editing:

- `assets/campaign-forest.png`: opaque illustrated woodland backdrop. The existing forest clearing supplied the established watercolor/pencil style. Generation brief: a bird’s-eye forest route with a lantern clearing, river and bridge, hollow oak, lantern ruins and distant nest/cave; paths connect distinct landmarks; no text, UI or baked-in progress. Functional map markers, path, buttons and progress are HTML/CSS/SVG overlays.
- `assets/pip-growth.png`: transparent four-stage atlas, based on the approved `00b_pip_character_bible.png` Ember Guardian reference. Generation brief: hatchling, young, growing and rideable versions of the same Pip, with warm orange scales, cream chest fur, gold horns and blue-gray wings with gold flame details. Increasingly strong neck, wings and mature muzzle; rideable guardian has saddle equipment. Complete isolated figures on transparency, no labels or scenery.

Both generated images were visually inspected. The growth silhouettes retain the approved character features, and all figures are complete. SVG viewports use alpha-bound measurements to isolate each stage. The existing approved hatchling sprite remains the actual stage-zero art; generated older forms are used after growth. No generated text represents state or learning information.

## Verification and release status

37 core/audio/storage tests and eight controller flow groups pass. Coverage includes XP caps and exclusions, migration without double credit, growth thresholds, area requirements, permanent progress after defeat, unavailable future areas, assessment → map → battle, exact Home/reload resume, growth feedback and hero changes. JavaScript syntax and whitespace checks pass.

`tests/visual-review.html` now provides isolated Campaign map, 5 XP to grow and Young Pip fixtures at the existing iPad/phone viewport presets. These fixtures use memory only and never touch learner storage.

Visual browser review of this changed build and physical iPad/Safari audio checks remain pending. The earlier automatic approval review rejected the GitHub push because the remote was not accepted as verified/authorized. No push or deployment was retried for this update. The implementation is local on `feature/campaign-map-and-pip-growth`, on top of the two first-session fixes. The live site is unchanged pending explicit push/deployment approval.

Rollback for this feature is `5e1ecf2`; rollback to the prior live build is `213f80ae70c842e88e68f84219ec7819625a8685`. Reverting code must not erase learner saves or newly earned permanent progress.
