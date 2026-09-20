# BlitzWord — Reference Image Plan

Use images for visual direction, composition, atmosphere, and state transitions. Do not use an image as the only source of behavioral truth. Written product rules belong in `BLITZWORD_PRODUCT_SPEC.md`.

## Append these authoritative references to the project

Character coherence is mandatory across all references. Attractive one-off variations are not acceptable substitutes for the approved hero/Pip identities.

### 00a_heroes_character_bible.png — append now

Selected reference: **Option 17 — Rowanfire Companions**.

This is the authoritative visual reference for all six fixed hero appearances: Mage A/B, Knight A/B, Archer A/B. The exact identities in this image are approved; later assets must preserve the same faces, hair, skin tones, proportions, costume silhouettes, equipment, and class identity.

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

Do not treat the sheet merely as palette inspiration. These six figures are the recurring characters.

### 00b_pip_character_bible.png — append now

Selected reference: **Ember Guardian**.

This is the authoritative visual direction for Pip and Pip's growth stages. Preserve across all stages and scenes:

- orange/ember scale palette and cream underside;
- darker wing membranes with warm flame-like markings;
- horn structure, head identity, dorsal spines, tail form, eye treatment, and signature markings;
- the same recognizable dragon identity from hatchling through rideable stage.

Growth direction is important: Pip starts youthful and approachable but becomes progressively stronger, more confident, and more protector-like. Later stages should have a longer muzzle, stronger neck/shoulders, larger wings, stronger horns/spines, and a more grounded guardian stance. Rideable Pip should feel powerful enough to protect and carry the hero, not like a baby dragon enlarged.

Treat `00a_heroes_character_bible.png` and `00b_pip_character_bible.png` as equally authoritative. When hero and Pip appear together, their palette should feel intentionally connected: forest greens and natural materials on the heroes, ember-red/orange accents shared with Pip.

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
- Mage / Knight / Archer hero selection using the exact six approved hero identities from the character bible;
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

## Runtime derivatives

The production browser build may contain cropped or optimized derivatives of the approved character-bible images for UI use. These derivatives do not become independent visual references. If a crop, compression, or later scene conflicts with `00a_heroes_character_bible.png` or `00b_pip_character_bible.png`, the full character-bible reference wins.

Current derived assets: `assets/hero1.webp`–`assets/hero6.webp` for the six Rowanfire hero portraits and `assets/pip.webp` for hatchling Pip. Later Pip growth-stage derivatives should be added only when the corresponding progression is implemented.
