# Male mage and three-enemy motion candidate

Historical pilot record, superseded by [the all-enemy release](enemies/ALL_ENEMY_MOTION_RELEASE.md). At the pilot checkpoint this was implemented on a review branch, not deployed. The user requested a male-mage pilot with three enemies, including a group, shown in the existing game before deployment.

## Artwork and actions

The pilot uses approved Male Mage E, Thornling D, Moss Golem B and Bark Beetle C designs. Battle poses were prepared with ChatGPT's image tool; short motion sources were generated through fal's Wan 2.2 Turbo service. Whole painted frames preserve connected faces, hair, clothing and limbs. No face stretching or independently warped body patches are used.

| Character | Included motions |
| --- | --- |
| Male mage | Aimed staff cast, distinct braced staff cast with Pip, recoil, kneeling defeat, fist-pump victory |
| Adult Thornling | Contact lunge, recoil, resting defeat, victory |
| Ancient Moss Golem | Fist slam with a ground shock wave, guarded recoil, resting defeat, victory |
| Bark Beetle | Contact charge, brief flinch, folded-leg defeat, raised-leg victory |
| Small Pip | Aimed fire assist, sharing the mage's one committed hit |

The group review uses three independently drawn beetles with one health bar. Only the active member charges or recoils; a defeated member disappears at the end of its reaction and stays retired. Other members remain still. Existing baby/young variants and later Pip stages retain their established artwork and behavior.

The latest user correction replaces palm casting with a two-handed staff aim. Solo and assisted actions have different whole-frame motion sources and separate crystal launch coordinates. The staff settles before the spell launches at 400 ms; Pip’s flame and the spell reach the active enemy at 660 ms. The assisted stance is lower and wider. The mage and Small Pip are spaced apart so both silhouettes stay readable. This correction used two additional $0.05 clips.

## Integration

`battle-motion.js` draws complete transparent sprite frames over the actual battle elements. It measures the current layout, aims the spell from the held staff crystal and moves melee attackers into contact. A rear group member moves toward the foreground as it approaches the mage. Mage feedback stays inside the existing 1,200 ms window; health presentation changes at 660 ms. Celebrations run once for 1,600 ms. Reading and choices have no running idle animation.

Pause, Home, navigation and hidden-page handling cancel playback. Final defeat poses hold without a running animation loop until navigation. Reduced motion and unavailable animation sheets retain the existing feedback path. The game makes no generation-service calls and stores no API credentials. Animation changes do not alter damage, XP, curriculum or learner-save schemas.

Only the current enemy's motion sheets are retained alongside the mage and Small Pip. Sources are trimmed and packed into transparent WebP atlases; the source-index curves and prompts are recorded in `docs/mage-motion/` for review and reuse.

## Review and verification

Open `tests/motion-review.html` from a local server. It loads the actual game in an isolated in-memory save, with opponent/action selectors and a portrait toggle. It does not read or write learner storage. The exported battle videos use the same production frame renderer and timing, with a Canvas recreation of the current battle layout; they are **not browser screen recordings**.

Automated checks cover impact timing, one-target group behavior, retirement, held final-heart defeat, cancellation, missing sheets, reduced motion and existing learner flows. **274 core/unit tests and 94 UI-flow groups pass.** Final counts and asset checks are recorded in `docs/mage-motion/verification.json`.

Browser visual verification is outstanding: the browser tool denied the local review URL because its admin-enforced security policy could not be verified. No alternate browser or automation route was used to bypass that denial. Physical iPad/Safari performance remained unverified at the pilot checkpoint. The user subsequently accepted the direction and explicitly authorized the all-enemy deployment; see the current release record.

## Cost

This pilot submitted 20 Wan 480p clips at the published $0.05 per clip: **$1.00 estimated generation cost**, including rejected/replaced takes. The accepted four Thornling sources were reused without a generation charge. Including the previous pilot's conservative $0.52 reservation, the combined reserve is **$1.52**, below the user's $10 total ceiling. This is a model-price estimate, not a reconciled fal invoice. Runtime playback has no per-play fee.

Pricing reference: [fal Wan 2.2 Turbo image-to-video](https://fal.ai/models/fal-ai/wan/v2.2-a14b/image-to-video/turbo).


The optional `docs/mage-motion/render_review.cjs` exporter needs Node, `@napi-rs/canvas` and FFmpeg; `BLITZ_MOTION_OUTPUT` sets its output folder. It reads only the shipped atlases. `pack_assets.py` takes the external source-frame directory as its first argument and requires Pillow/NumPy; the earlier Thornling frames sit in the sibling `game-combat-pilot` directory. Runtime play needs none of these tools.
