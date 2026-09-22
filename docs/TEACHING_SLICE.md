# Six-word practice slice — 21 September 2026

This is a small implementation milestone for option A, not the complete free chapter. Preserve all historical assessment and practice observations, including targets outside this slice. This slice only selects practice targets with reviewed teaching support.

| Target | Sentence | Production illustration |
| --- | --- | --- |
| on | Pip is on the rock. | assets/teaching/sat-rock.webp |
| rock | Pip is on the rock. | assets/teaching/sat-rock.webp |
| tree | The tree is green. | assets/teaching/green-tree.webp |
| green | The tree is green. | assets/teaching/green-tree.webp |
| fox | Pip follows the fox. | assets/teaching/fox.webp |
| cave | Pip is by the cave. | assets/teaching/cave.webp |

The original slice used `sat` from the prototype. The first-session correction replaces new `sat` selections with Core 200 word `on`; historical saves remain supported. See `FIRST_SESSION_FEEDBACK.md`. Distractors were checked for distinct options, exactly one target, and close real-word or plausible spelling contrasts. Existing assessment pools, exposure steps, axes and numerical stop thresholds are retained. Interrupted exposure is now explicitly supported evidence and excluded from calibration blocks; the existing 25-observation ceiling remains.

## Illustration review

Generated using the built-in image-generation tool with `assets/pip.webp` as the identity reference. The approved heroes were not regenerated or changed.

Visual review checked Pip's orange scales, cream underside, horns, facial identity, wing markings and tail across the four scenes. The sitting pose rests on the rock, the green tree dominates its scene, the fox is distinguishable from Pip, and the cave has a dark opening in a rocky hillside. The cave sentence was changed from the generation prompt's action sentence to “Pip is by the cave.” because the output shows Pip at the entrance. No text is baked into the pictures.

The two shared images support closely related target words, with a separate highlighted target in the sentence. These are reviewed prototype materials, not a claim of externally validated learning outcomes. Child comprehension and actual iPad voice behavior still need observation.

## Production prompts

Shared prompt: “Create one production illustration for BlitzWord's reading teaching card. Reference image 1 is the EXACT Pip hatchling identity: preserve orange/ember scales, cream underside, dark wing membranes with warm flame veins, horn shape, big brown eyes, dorsal spines, tail and head shape. Use warm hand-painted storybook watercolor and pencil, restrained forest colors, quiet uncluttered composition. Wide landscape 3:2. No words, letters, captions, borders, UI, humans, or other dragons. Full scene, not a sprite sheet. One easy-to-read teaching idea. Pip should look exactly like the reference, never like a redesigned dragon.”

- sat-rock: “Pip is SITTING on one large gray rock in a quiet woodland clearing. Show the full body in profile/three-quarter view, bottom clearly resting on the broad flat top of the rock, hind legs bent and feet forward, forepaws relaxed beside the body. This must unambiguously show sitting, not standing or hovering. The rock is a clearly recognizable natural boulder occupying the lower middle. Minimal soft woodland background. This image supports the sentence 'Pip sat on the rock.'”
- green-tree: “One small full GREEN tree is the main subject, with a clear brown trunk, branches and rich green leaves. Pip stands beside the trunk gently holding a low branch and gazing up at the leaves. Whole tree fits in view. Put the tree against a warm cream sunlit clearing with no other prominent green objects or trees. This image supports the sentence 'The tree is green.'”
- fox: “One recognizable orange-red woodland FOX with white chest, pointed ears and big bushy white-tipped tail walks right along a quiet forest path; Pip follows just behind, looking at the fox. Fox in foreground is dominant and fully visible. Pip smaller but recognizable. No other animals or distracting objects. This image supports 'Pip follows the fox.'”
- cave: “One broad dark CAVE opening in a natural rocky hillside is the dominant subject. Pip in side view steps into the opening, with front half already inside and tail still outside, looking into the cave. Show the exterior hillside and clear deep cave interior, not a freestanding arch or door. Minimal soft forest around it. This image supports 'Pip goes into the cave.'”

## Practice and evidence rules

- At most six unfamiliar targets are introduced per challenge. Due reviews and repeated errors take priority; further introductions slow when accuracy or unfinished-word load calls for it.
- Both correction and teaching are stored as support exposure. Replays are free. Teaching targets wait for two different intervening answers before another independent check.
- Guided demonstration and interrupted-exposure attempts are stored as supported practice and do not change health. The first independent demonstration mistake is free; later independent mistakes can cause defeat.
- Two independent successes schedule the first one-day review. Actual due checks can expand to 3, 7, 14 and 30 days. Early practice does not advance those stages. A miss shortens the next gap without undoing campaign checkpoints.
- “Words practiced” in the session summary does not mean mastered, decoded, pronounced correctly, or retained long term.
- Assessment answers and battle answers are saved individually. A saved question contains its actual option order, response time excluding pauses, configured and observed exposure, prior support context, and a unique identifier for duplicate protection.

## Reliability boundaries

Reloading an exposed word restarts that same item and marks it as interrupted supported practice. Reloading the choices preserves the same fixed-size mask, shuffled alternatives and accumulated active response time. Feedback, correction, teaching and results resume without applying damage or rewards twice.

Seven minutes counts active foreground campaign time, including teaching and opponent selection. Pauses and background time do not count. The session ends after feedback/teaching or at an opponent-choice boundary. A large enemy is not a reason to force play past the session boundary. Exact fight health and pending question survive voluntary early stopping.

There is no remote transmission of names or learning observations. Progress remains local to this browser; changing devices does not transfer it. Browser speech and asset caching are platform-dependent. TestFlight and a full offline package are not part of this milestone.
