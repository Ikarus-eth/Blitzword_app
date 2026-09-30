# The fox cub rescue

30 September 2026 revision, build `story-rescue-20260930-r2`.

The user rejected the pilot's generic scenery, small Artus portrait and pasted-on enemy cards, and asked for reading and number puzzles that belong together. They then requested an overarching journey through stations to rescue or help someone. This revision replaces the five separate adventures with **one fox-cub rescue in five stops**.

## One journey, connected puzzles

| Stop | What the heroes need | Reading clue and maths work together |
|---|---|---|
| The Fox’s Call | Light for a tunnel towards the tower | Artus swaps his shield for a torch. Of three torches, one is wet; he can take two dry torches. |
| The Broken Bridge | Good pegs to repair the way across | Follow the pegs from the torn red bag into the blue bag; eight minus three bent pegs plus two found pegs leaves seven usable pegs. |
| The Troll’s Lock | Keys to open the gate on the path | Solve the teeth/lock riddle to identify what is on the troll's rings; three rings of five, minus four bent ones, leaves eleven usable keys. |
| The Owl’s Chest | Equal ropes for a level rescue basket | Use position and exclusion to find the rope in the moon chest; cut six worn feet from twenty-four, then divide the good part into three six-foot pieces. |
| The Last Door | The correct route into the tower, and its lock code | Exactly one of three signs is true, identifying the sun door. Its code is in the seven times table and between fifty and sixty: 56. |

Both choices at every stop contribute to that stop's rescue task. The final unrelated gem-sharing problem is removed. The difficulty remains subtraction, two-step arithmetic, groups, equal sharing, then a truth-condition riddle with a number constraint. Simple words and short sentences remain the goal, without claiming strict Core 200 coverage. The text and exact clues live in `assets/story-pilot/stories.js`.

The cub is introduced at the start, the tower remains the destination, and each ending points to the next obstacle. The final reunion shows the rescued cub with its mother, Artus and Pip. All five stops remain available from the route buttons for this optional pilot; Next advances in story order. No audio, clock, XP, mastery or chapter-time credit is added.

## Integrated illustrations

Six final illustrations replace the generic scenes, portrait badge and floating Pip/enemy layers. Artus and Pip are painted into every image with natural shared lighting, perspective and poses. The supporting cast appears inside the scene: Imp at the broken bridge, Troll at the locked gate, Owl above its chests, Ram beside the tower doors. The first four results retain the relevant scene already visible above them rather than repeating it; the final result displays a separate reunion illustration.

The image is shown at its full 3:2 ratio, never cropped. Tablet/desktop keeps the open-book composition. Phones put the complete scene before the text, and navigation scrolls to the top of that scene. The final ending scrolls to its heading. No fixed-height background or separate character overlay remains.

All artwork was made with the built-in OpenAI image-generation tool using approved repository references: Knight boy D for Artus, Small Pip, Acorn Imp C, Cave Troll C, Hollow Owl C and Stone Ram B. This is story illustration only; battle character replacement and its animation review gate remain untouched.

Five station images plus one reunion were accepted. The owl scene received one targeted edit to put its four chests in a single row, matching the text. No answer-specific digits, inventory totals or correct chest/door are shown in the pre-answer art. Exact emblems and signs remain accessible HTML diagrams. [Prompts, references, source filenames and hashes](RESCUE_ARTWORK.json). Final delivery files are in `assets/story-pilot/scenes/`; WebP encoding is the only post-generation image transformation. All six retain their original 1536 × 1024 dimensions; total delivery size is approximately 2.9 MB.

## Progress preservation

The new content starts in `blitzword_story_pilot_v2` with schema version 2 and new story IDs. It never reads or overwrites the old pilot's `blitzword_story_pilot_v1` results or the main game save. Old answers are not reinterpreted as evidence for revised puzzles. The grown-up panel states that earlier pilot results are kept separately. Pilot progress remains browser-local and outside the main game backup.

First checks, hints, retries, replay counts, completion, shuffled choices, storage failures and cross-tab conflict protection retain the original behavior. The Home button and return link keep their existing route.

## Verification and release status

Implemented and tested; deployment pending. All 265 automated tests and 90 UI-flow groups pass, including 13 pilot tests. Automated checks cover all five revised puzzles, exact arithmetic and the final riddle's unique solution, local assets, six scene records, removal of overlays, preservation of both main and old pilot storage, full UI completion, reload, first-attempt retention and storage conflicts. Browser checks cover the entire journey, wrong answer → hint → correction, reload with a selected bag, full illustration framing, 768 px tablet portrait and 320 px phone layout. Physical iPad/Safari remains untested. Results are recorded in [RESCUE_CHECKS.json](RESCUE_CHECKS.json).

Historical r1 release and live evidence remain in [the original pilot release](../STORY_PILOT_RELEASE.md); the current revision supersedes its visuals and content, not its preserved records.
