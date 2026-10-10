## Continuous ninth-task scenes — 10 October 2026

The user accepted the detailed seamless Crystal Ferry review as the direction and requested four new main-game scenes. Four-panel composites are superseded for Sleeping Waterwheel, Lamps in the Mist, Nest Above the Falls and River Sings Again. Each replacement is one connected landscape at 4096×2731, assembled from overlapping detail passes anchored to a single base composition. [Provenance and checks](wimmelbild/RIVER_SEARCH_RELEASE.md). This does not approve new recurring hero or Pip designs.

## Large chapter search maps — 10 October 2026

Five new maps in `assets/wimmelbild/maps/` serve the ninth task in Crystal Ferry and the following four chapters. Each is a native-detail 3072×2048 composite of four separate 1536×1024 generated sections, assembled with explicit user authorization; source pixels were not enlarged. Twenty sections and all fifteen answer targets were visually audited. Fine atlas dividers separate regions. [Exact prompts/source hashes](wimmelbild/ninth-art-prompts.json), [final dimensions/hashes](wimmelbild/ninth-art-manifest.json), [answer evidence](wimmelbild/NINTH_TASK_RELEASE.md). Approved heroes, Pip and earlier assets are unchanged. Picture hit regions are no longer used for answers.

## New enemy final-look proposals — 10 October 2026

The 46 retained concepts have four proposed looks each in `assets/enemy-finals/`: original A plus three new variants. Stronger colours and elemental accents follow the first-round notes; the requested Snow Owl stays white. Built-in ImageGen produced 23 sheets (two creatures × three looks), preserving the painted storybook references. These are unapproved review assets, not production replacements. [Prompts](../assets/enemy-finals/prompts.json), [manifest](../assets/enemy-finals/artwork-manifest.json), [review rules](enemies/FINAL_LOOK_REVIEW.md).

## Dragon path Wimmelbild scenes — 10 October 2026

The user selected the map-reading mockup 3 and authorized its standalone mini-game with increasingly detailed scenes, zoom, and a many-dragon search. Four new built-in ImageGen illustrations in `assets/wimmelbild/scenes/` depict the harbour map, tree village, dragon valley and castle treasury. These are new environments and incidental creatures; no established hero or Pip asset is replaced. Clue evidence was visually checked in the final images: three red doors; contrasting dragon markings/tails; three green chests with different emblems/book states. Earlier hotspot coordinates are retained as reference data; picture taps no longer select answers. [Exact prompts, output dimensions and hashes](wimmelbild/art-prompts.json). Native images are 1536×1024, delivered as high-quality WebP; zoom does not invent higher-resolution detail.

# BlitzWord — Reference Image Plan

Use images for visual direction, composition, atmosphere, and state transitions. Do not use an image as the only source of behavioral truth. Written product rules belong in `BLITZWORD_PRODUCT_SPEC.md`. Current production assets and approved art decisions are maintained in this repository; no ChatGPT project attachments are required.

### Ship and kind shark — 7 October 2026

The user selected the ship/shark teaching moment and specified that the shark is kind. The source is the first tile of the second row in `assets/teaching/core-teaching.webp`, shared by the `ship` and `shark` entries in `content.js`. The [reference crop](adventures/references/ship-shark-teaching.png) preserves the wooden cream-sailed ship and blue-grey shark. Four built-in ImageGen scenes keep their painted storybook identities, with a calm closed-mouth shark helping the ship. These are chapter-six narrative illustrations; the teaching atlas remains unchanged. [Scenes and exact prompts](adventures/KIND_SHARK_RELEASE.md).

### Boy and map book — 6 October 2026

The user explicitly selected the bottom-right scene in `assets/teaching/core-teaching.webp`: a brown-haired boy in a cream shirt and green waistcoat drawing in an open map book. It is the identity and painted-style reference for the fifth Forest Lights adventure. Four built-in ImageGen paintings retain the boy, book, feather pen and warm rural storybook style; [gallery and exact prompts](adventures/MAPMAKER_RELEASE.md). These replace that mission's narrative art, not the battle hero. The approved mage and small Pip also receive a reference-based paired sad retreat illustration for the defeat screen; their existing battle assets remain unchanged.

### Creature mission illustrations — 3 October 2026

Twelve integrated fal.ai paintings in `assets/adventures/` depict the active male mage, Small Pip using the selected friendly B design, and the approved enemy cast. These are new mission scenes, not replacements for battle motion. Character reference paths, exact prompts and request IDs are recorded in [the campaign artwork prompts](adventures/art-prompts.json) and [generation provenance](adventures/art-requests.json). The full 3:2 scenes are uncropped in mission pages. Puzzle answers are specified in text/cards and diagrams, rather than relying on exact generated object counts. Code-generated line icons serve simple answer controls. [Provider setup and cost](FAL_AI_IMAGES.md).

### Pip B and campaign clarity — 3 October 2026

The user chose alternative B, the natural slim dragon jaw, after reviewing three mouth/chin alternatives. `assets/battle-motion/pip-friendly-b.png` is the exact selected 1280×1280 image, replacing the previous friendly still only in small Pip's battle renderer. The existing fire clip and return to neutral remain.

`assets/campaign-hd/` contains seven built-in ImageGen restorations referenced from the approved scenes. The six 512×512 atlas panels become standalone 1254×1254 images, shared with their matching chapter scenes. The first campaign restoration retains 1536×1024 dimensions and clearer painted detail; it is not a pixel-dimension increase. Landmark subjects, composition, time of day and palette are retained, with newly generated fine detail. These are restorations, not lossless enlargements. [Prompts](still-resolution/GENERATION_PROMPTS.json), [asset dimensions and hashes](still-resolution/ASSETS.json), [release and honest resolution limits](still-resolution/RELEASE.md).

### Fight expression and cutout correction — 3 October 2026

`assets/battle-motion/pip-friendly.png` is the targeted, built-in ImageGen edit of the existing small Pip battle still: relaxed brow, friendly neutral eyes and closed mouth; the orange/cream identity, pose and wings remain. The existing fire motion is retained, with a short return to the friendly still before feedback ends. Other growth artwork remains the existing approved art. The mage's still and five animation sheets receive matching runtime blue-edge alpha suppression. Source frames are retained unchanged. See [implementation and verification](fight-art/RELEASE.md).

### Story rescue illustrations — 30 September 2026

The user rejected the pilot's generic scenes, missing full Artus and pasted enemy cards. Six new integrated paintings now depict the fox-cub rescue: tunnel, broken bridge, troll's locked gate, owl's chest store, tower doors, and reunion. Artus and Pip appear in every image; the supporting characters share the scene's perspective and lighting. The full 3:2 images are uncropped, with no character overlays. The owl's four chests were edited into a single row to match the reading clue. [Exact prompts, references and hashes](story-pilot/RESCUE_ARTWORK.json), [release](story-pilot/RESCUE_RELEASE.md).

Artus uses approved Knight boy D; Pip uses Small Pip; the guests use Imp C, Troll C, Owl C and Ram B. This authorization applies to story illustrations. Main battle rigs and the broader smooth-animation approval gate remain unchanged. The earlier pilot's still-card arrangement is superseded.

The later tower correction replaces the blank door plaques with clearly engraved Sun, Moon and Star medallions, left to right, in `assets/story-pilot/scenes/gate-labelled.webp`. It is one targeted edit preserving the cast and scene. [Exact edit prompt](story-pilot/DOOR_ARTWORK.json), [riddle presentation](story-pilot/DOOR_RELEASE.md).

### Final character still-art selection - 29 September 2026

The [complete character artwork document](artwork/README.md) and [exact asset manifest](artwork/character-selections.json) record the accepted future lineup: 20 enemies, six heroes and four retained Pip stages. These choices supersede earlier lineup choices for the future image replacement. Mage boy E, Knight boy D, Archer boy Current, Mage girl Current, Knight girl C and Archer girl A are final. Enemy tie-breaks are Reed Serpent D, Lantern Wisp C and Briar Bat C; all other enemy choices follow the recorded family rule.

The user explicitly deferred replacing game images until a smooth, connected animation approach is established and reviewed. The historical references below still explain current production assets. Neither the rejected archer rigs nor the new Pip motion experiments are approved production replacements. The four existing Pip stages remain the dragon identity reference.

### Approved male hero revision — 21 September 2026

The approved complete male lineup is `assets/rowanfire-boys-2026-09-21.png` in `Ikarus-eth/Blitzword_app`. It replaces all earlier male hero depictions, including the boys in the original Option 17 character bible and the five comparison sheets. The final combined lineup is authoritative; the comparisons only record how it was selected.

| Hero | Hair colour | Hairstyle | Face and outfit |
| --- | --- | --- | --- |
| Male Mage | Ash blond | Soft medium-short waves | Approved sheet 4 face; final lineup's Rowanfire robes and ember staff |
| Male Knight | Golden blond | Short and tousled | Approved sheet 4 face; final lineup's armour, red scarf and botanical shield |
| Male Archer | Chestnut | Soft side-swept fringe | Approved sheet 4 face; final lineup's green cloak, leather equipment and bow |

Preserve the final lineup's exact face, skin tone, child proportions, clothing, equipment and hair identity in every later screen or illustration. Female Mage, Knight and Archer retain their approved Option 17 identities. Pip retains the Ember Guardian identity.

The original `00a_heroes_character_bible.png` records the approval of the three female heroes; their production portraits and full-body art are preserved in the repository. The user retired the earlier setup, battle-scroll and teaching-card mockups on 23 September 2026. They are no longer active composition, flow or character references. Do not generate new boys from an old six-character sheet.

## Active references

### Archer animation study — 25 September 2026

`assets/heroes/prototype/archer-boy-parts.png` is a generated transparent parts atlas for a separate movement prototype, derived from the approved boy archer in `assets/rowanfire-boys-2026-09-21.png`. It does not supersede the approved lineup or replace production art. The head, sleeves, bracers, hands, torso, cloak, quiver, legs, boots and bow are assembled by `assets/heroes/prototype/archer-rig.js`. [Exact built-in image-generation prompt](heroes/ARCHER_ART_PROMPT.json); [implementation and review limits](heroes/ARCHER_PROTOTYPE.md).

The user raised the boys' similar faces and hair as a potential revision. No replacement face lineup has been approved; retain the existing reference and keep the study head replaceable.

### Full-screen campaign Home — 25 September 2026

The user's iPad photograph identifies the campaign Home screen and the dark green frame to remove; it is not a new artwork source. Keep `assets/campaign-forest.png` and the six campaign panels in `assets/chapter-scenes.webp`. The approved composition is edge-to-edge artwork with floating parchment controls and legible dark text. Preserve the art's proportions and crop to the viewport. See the [product decision](BLITZWORD_PRODUCT_SPEC.md#full-screen-campaign-map--25-september-2026) and [implementation and verification](FULLSCREEN_MAP_RELEASE.md).

The later same-day refinement makes the full chapter name and gold number the direct entry control, removes the separate Play/Home panel and empty daily counter, uses a quiet lower-left settings gear, and moves speed selection to an icon dropdown. The existing hero portrait becomes the hero-selection button and remains reachable on phones. No new or replacement character/map art is introduced; the separate archer study remains independent. See [map controls](MAP_CONTROLS_RELEASE.md).

### Golden word-mask spiral — 24 September 2026

The [user-supplied spiral crop](references/golden-spiral-20260924.png) is the approved direction for the mask after word exposure: tilted golden ribbons, bright cream centres, soft amber light and small star sparks. Source: the user's attached image on 24 September 2026, preserved unchanged. It guides only the spiral, not the background or Pip. The runtime artwork is an inline SVG in `galaxyMask()` with styles in `styles.css`; it remains static and fixed-size for every word.

### Selected enemies — 23 September 2026

`assets/enemies/selected-lineup.png` records the user's selections: 01–05 A,
06–08 C, 09 B, 10–11 C, 12–13 A, 14–20 C. The twenty transparent parts atlases
in `assets/enemies/layered/` preserve these identities for articulated 2D combat.
See [the enemy release](enemies/LAYERED_ENEMIES_RELEASE.md) for source prompts,
runtime rigs, review controls and the distinction between base forms and proposed
growth/group variants. The 25 September group release applies the approved HP ranges and renders repeated rigs for groups. Age forms derive from these same painted parts with different anatomical proportions and staged foliage; see `enemies/GROUP_ENCOUNTERS_RELEASE.md`.

On 25 September 2026, the user requested removal of a detached green fragment
behind the Thornling's tail. It came from a neighbouring atlas piece. A runtime
source-coordinate clip excludes it while preserving the approved PNG and the
tail's original size, position and animation; no replacement artwork was generated.

Character coherence is mandatory across all references. Attractive one-off variations are not acceptable substitutes for the approved hero/Pip identities.

### 00a_heroes_character_bible.png — female heroes only

Selected reference: **Option 17 — Rowanfire Companions**.

This is the authoritative visual reference for the three female appearances: Mage B, Knight B and Archer B. Its male figures are superseded by the 21 September lineup. The female identities in this image remain approved; later assets must preserve the same faces, hair, skin tones, proportions, costume silhouettes, equipment, and class identity.

Approved shared visual language:

- forest green, natural leather/wood, warm cream cloth;
- restrained ember-red accents that visually connect the heroes to Pip;
- small rowan berry/leaf and woodland motifs;
- warm orange ember light for mage magic;
- practical rather than ornate fantasy equipment.

Class anchors:

- Mage: wooded/leafy staff with ember glow; green-and-red forest robes;
- Knight: silver armour with red scarf/cape details and red/gold botanical shield language;
- Archer: forest-green cloak/leather equipment with small red/rowan accents and a wooden bow.

Do not treat the sheet merely as palette inspiration. The three female figures remain recurring characters; use the final revised male lineup for the boys.

### Ember Guardian Pip — approved identity

Selected reference: **Ember Guardian**.

This is the authoritative visual direction for Pip and Pip's growth stages. Preserve across all stages and scenes:

- orange/ember scale palette and cream underside;
- darker wing membranes with warm flame-like markings;
- horn structure, head identity, dorsal spines, tail form, eye treatment, and signature markings;
- the same recognizable dragon identity from hatchling through rideable stage.

Growth direction is important: Pip starts youthful and approachable but becomes progressively stronger, more confident, and more protector-like. Later stages should have a longer muzzle, stronger neck/shoulders, larger wings, stronger horns/spines, and a more grounded guardian stance. Rideable Pip should feel powerful enough to protect and carry the hero, not like a baby dragon enlarged.

Use the revised male lineup for the boys, the approved female identities preserved in `assets/hero4.webp` through `assets/hero6.webp` and `assets/forest-characters.webp` for the girls, and `assets/pip.webp`, `assets/forest-characters.webp` and `assets/pip-growth.png` for Pip. The historical character-bible filenames record provenance; they are not required project attachments. When hero and Pip appear together, their palette should feel intentionally connected: forest greens and natural materials on the heroes, ember-red/orange accents shared with Pip.

Rules for both sheets:

- these are fixed characters, not loose style suggestions;
- later art may change pose, expression, lighting, weather, camera angle, and minor wear, but not core identity;
- the dragon companion begins with the name `Pip`; a later rename changes only the displayed name, never the visual identity;
- do not bake labels or child-facing text into reusable character art.

## Retired mockups — 23 September 2026

The user retired the old setup/hero sheet (`9bdd6498-fbaa-4dcf-b12f-0c62908fc422.png`), battle-scroll sheet (`02_battle_scroll_flow_SELECTED(1).png`) and teaching-card sheet (`735017dc-8764-465e-9cd9-b351be85ba03(1).png`). Do not request their reattachment, regenerate them as a recovery step or treat their composition, text, characters or flow as current requirements. Read the current specification and inspect the existing implementation for the task at hand. Implementation/specification discrepancies still require review rather than silently changing the approved rules.

## Rule for future references

When a screen or flow is approved, preserve one clean image in GitHub with a stable filename and provenance, and add the exact corresponding behavior to the spec. Avoid keeping multiple near-identical old mockups as equal references; archive or clearly mark superseded ones.

Before approving any image containing a recurring character, check it against the character bible. Reject visual drift in face, hair, costume, equipment, proportions, or Pip's defining features even when the individual illustration looks good.

## Portrait sources and historical replacement coverage

`assets/rowanfire-boys-2026-09-21.png` contains the exact approved 1536 × 1024 male lineup. The game renders square CSS viewports onto that source without redrawing, recolouring or altering the chosen faces. Sheet labels and neighbouring heroes remain outside every portrait viewport.

| Runtime identity | Source | Portrait viewport, in source pixels |
| --- | --- | --- |
| Male Mage / index 0 | `assets/rowanfire-boys-2026-09-21.png` | x=183, y=145, width=320, height=320 |
| Male Knight / index 1 | Same approved source | x=636, y=145, width=320, height=320 |
| Male Archer / index 2 | Same approved source | x=1099, y=145, width=320, height=320 |
| Female Mage / index 3 | `assets/hero4.webp` | Existing approved portrait |
| Female Knight / index 4 | `assets/hero5.webp` | Existing approved portrait |
| Female Archer / index 5 | `assets/hero6.webp` | Existing approved portrait |
| Pip | `assets/pip.webp` | Existing approved hatchling |

The shared portrait renderer covers setup, hero selection, route, teaching and battle, including saved profiles on reload. Earlier male files `assets/hero1.webp`, `assets/hero2.webp` and `assets/hero3.webp` are removed from the active repository and deployment. Historical commits are rollback records, not active references or fallback assets. Versioned script/style URLs and the new source filename refresh cached assets when the page reloads. A tab already running an earlier release needs a reload; this artwork change does not reset local learning or campaign data.

The portrait-replacement details above describe that earlier art milestone. The current game also renders full-body battle/story sprites from `assets/forest-characters.webp`, growth forms from `assets/pip-growth.png`, and answer-locked combat reactions. See [combat reactions](COMBAT_REACTIONS.md), [current story picture checks](STORY_PICTURES_RELEASE.md) and [current status](CURRENT_STATUS.md); this paragraph does not introduce new artwork or animations.

## Chapter scenery — 23 September 2026

The 35 chapter settings are mapped in `content.js` (`chapterBackgrounds`) and documented in [CHAPTER_SCENERY_RELEASE.md](CHAPTER_SCENERY_RELEASE.md). Twenty-eight new backgrounds were created with the built-in image-generation tool from the chapter names and existing story lines; [the exact prompt set](CHAPTER_SCENERY_PROMPTS.json) records the constraints and generation source. Seven approved settings are retained (the original clearing and six individual atlas panels). New backgrounds contain no characters or controls. The campaign-map atlas remains unchanged.

## Evolution frames — 23 September 2026

`assets/evolution/pip-stage-0.webp` through `pip-stage-3.webp` are the four new evolution-screen illustrations, generated from the approved `assets/pip-growth.png` and `assets/pip.webp`. They preserve the orange scales, cream chest, amber eyes, cream horns, ember spines, dark flame-marked wings and tail. The final form retains its saddle and chest gem. Existing battle/map sprites remain in place. [Exact built-in image-generation prompts](EVOLUTION_PROMPTS.json) and [flow details](EVOLUTION_RELEASE.md) are maintained here.


## Male mage and three-enemy motion candidate — 30 September 2026

The user requested deployment preparation and previews for only the male mage and three enemies, including a group. The review branch derives battle poses from Mage E, Thornling D, Moss Golem B and Bark Beetle C. Small Pip retains his established battle identity. These are whole-frame motion derivatives of the selected character artwork; other heroes and juvenile enemy forms are outside this pilot. The previously accepted Thornling interaction set is reused. No deployment or final visual approval is claimed. See [the motion candidate](MAGE_MOTION_PILOT.md) and its source provenance.

The user's latest explicit direction is that the mage points his staff at the enemy and casts from its head. The corrected candidate contains separate solo and Pip-assisted staff motions; the latter has a lower, two-handed brace. The previous palm cast is superseded.

## All-enemy motion selection — 30 September 2026

The user accepted the corrected mage direction and authorized expanding and deploying it. The earlier three-enemy/deferred-replacement gate is superseded for Male Mage E and all 20 selected enemies. Every enemy uses derivatives of its recorded selection in `artwork/character-selections.json`; groups share those frames, and younger forms use uniform scale. Five other heroes are temporarily unavailable, with saved preferences preserved. Pip's existing stage artwork is retained; Small Pip's fire joins the assisted cast. [Current scope, costs and visual-check limits](enemies/ALL_ENEMY_MOTION_RELEASE.md).

### 6 October: imaginative boy and wizard scenes

The user requested varied adventures using the original boy picture’s painted style, and explicitly likes the wizard from the other teaching moment. Chapter 5 now pairs the boy with that blue-robed, white-bearded wizard and white unicorn across four different settings and actions. The original teaching atlas remains the visual reference. [Final assets and prompts](adventures/WIZARD_MAP_RELEASE.md).

## Artus’s 45 approved additions — 10 October 2026

The user authorized integration after Artus’s final-look vote. `docs/enemies/APPROVED_SELECTIONS.json` identifies each winning source cell; `ARTUS_FINAL_RATINGS.json` preserves all 184 ratings. Ore Ant is excluded. Production derivatives are nine transparent 1536×1024 atlases in `assets/enemies/approved-20261010/`, with per-creature crop metadata in `roster.js`. Built-in ImageGen generated nine sheets and one layout repair; exact prompts and final hashes are in `docs/enemies/APPROVED_ART_PROMPTS.json`. Old 20-family artwork is unchanged. [Release, verification and limits](enemies/APPROVED_RELEASE.md).
