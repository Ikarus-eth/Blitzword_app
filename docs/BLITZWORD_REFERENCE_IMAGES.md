# BlitzWord — Reference Image Plan

Use images for visual direction, composition, atmosphere, and state transitions. Do not use an image as the only source of behavioral truth. Written product rules belong in `BLITZWORD_PRODUCT_SPEC.md`.

### Approved male hero revision — 21 September 2026

The approved complete male lineup is `assets/rowanfire-boys-2026-09-21.png` in `Ikarus-eth/Blitzword_app`. It replaces all earlier male hero depictions, including the boys in the original Option 17 character bible and the five comparison sheets. The final combined lineup is authoritative; the comparisons only record how it was selected.

| Hero | Hair colour | Hairstyle | Face and outfit |
| --- | --- | --- | --- |
| Male Mage | Ash blond | Soft medium-short waves | Approved sheet 4 face; final lineup's Rowanfire robes and ember staff |
| Male Knight | Golden blond | Short and tousled | Approved sheet 4 face; final lineup's armour, red scarf and botanical shield |
| Male Archer | Chestnut | Soft side-swept fringe | Approved sheet 4 face; final lineup's green cloak, leather equipment and bow |

Preserve the final lineup's exact face, skin tone, child proportions, clothing, equipment and hair identity in every later screen or illustration. Female Mage, Knight and Archer retain their approved Option 17 identities. Pip retains the Ember Guardian identity.

The original `00a_heroes_character_bible.png` remains authoritative only for the three female heroes. Earlier onboarding, battle and teaching images remain composition/flow references only; their male characters must never override this revision. If an attachment conflicts with this section, follow this section and the final male lineup. Do not generate new boys from an old six-character sheet.

## Active references

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

### 00b_pip_character_bible.png — append now

Selected reference: **Ember Guardian**.

This is the authoritative visual direction for Pip and Pip's growth stages. Preserve across all stages and scenes:

- orange/ember scale palette and cream underside;
- darker wing membranes with warm flame-like markings;
- horn structure, head identity, dorsal spines, tail form, eye treatment, and signature markings;
- the same recognizable dragon identity from hatchling through rideable stage.

Growth direction is important: Pip starts youthful and approachable but becomes progressively stronger, more confident, and more protector-like. Later stages should have a longer muzzle, stronger neck/shoulders, larger wings, stronger horns/spines, and a more grounded guardian stance. Rideable Pip should feel powerful enough to protect and carry the hero, not like a baby dragon enlarged.

Use each reference only for its subject: the revised male lineup for boys, `00a_heroes_character_bible.png` for girls, and `00b_pip_character_bible.png` for Pip. When hero and Pip appear together, their palette should feel intentionally connected: forest greens and natural materials on the heroes, ember-red/orange accents shared with Pip.

Rules for both sheets:

- these are fixed characters, not loose style suggestions;
- later art may change pose, expression, lighting, weather, camera angle, and minor wear, but not core identity;
- the dragon companion begins with the name `Pip`; a later rename changes only the displayed name, never the visual identity;
- do not bake labels or child-facing text into reusable character art.

### 01_starting_and_hero_flow.png — regenerate cleanly before appending

Should show the approved onboarding/start direction only:

- first-screen direction option A;
- exact caption `Win the reading battle`;
- minimal child-facing text;
- local name/nickname, age, and gender setup;
- Mage / Knight / Archer hero selection using the exact identities from the revised male lineup and original female character reference;
- `Pick your hero` wording;
- green primary button without a written label;
- visual continuation to `Try a battle` as primary and `Reading check first` as secondary.

Do not append the earlier broad v1 contact sheet as the authoritative start reference because its wording and screen sequence are now partly superseded.

### 02_battle_scroll_flow_SELECTED.png — append now

This is the selected first battle flow. Treat it as the visual basis for the scroll, scene composition, hero/enemy framing, and compact answer choices. Replace any placeholder hero/dragon depiction with the selected hero identity and Pip from the authoritative character bible.

Corrections that the written spec overrides even if the image differs:

- neutral mask must not reveal letter count;
- enemy health bar is required;
- hero has three hearts;
- combat animates only after an answer;
- wrong-answer correction can hold until continue;
- teaching moments are separate pre-generated scenes when needed;
- minimize child-facing labels and explanatory copy.

### 03_teaching_moments_reference.png — append now

Source image: the provided `BlitzWord Reading Card Concepts (Set 1)` sheet.

Use it as the visual baseline for teaching moments:

- short sentence on parchment above one large illustration;
- target word highlighted yellow and underlined;
- one visually dominant teaching idea;
- Pip/selected hero actively demonstrates the meaning rather than posing beside an object;
- calm forest/fantasy setting with minimal competing detail;
- consistent Pip and hero identity from the character bible.

The sheet also establishes useful visual mechanisms for harder words: active group vs separate Pip for `they`, distance + pointing for `that`, comparison + pointing for `this`, clear self/recipient relation for `me`, two-step sequence for `then`, and a thought bubble for `think`.

Treat this as a teaching-card reference, not a final UI screenshot. In the app, sentence text, yellow highlight, underline, narration timing, replay, and continue remain separate UI/audio layers.

### No assessment reference image appended yet

Do not append an assessment board at this stage. The assessment behavior is defined in `BLITZWORD_PRODUCT_SPEC.md` and still needs a dedicated screen-by-screen design review before any assessment image becomes authoritative.

## Rule for future references

When a screen or flow is approved, save one clean image with a stable filename and add the exact corresponding behavior to the spec. Avoid keeping multiple near-identical old mockups as equal references; archive or clearly mark superseded ones.

Before approving any image containing a recurring character, check it against the character bible. Reject visual drift in face, hair, costume, equipment, proportions, or Pip's defining features even when the individual illustration looks good.

## Runtime portraits and replacement coverage

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

The current game displays portraits, including in its existing teaching composition. This artwork revision does not claim to implement a new sitting pose, full-body battle animation or other unimplemented behaviour.
