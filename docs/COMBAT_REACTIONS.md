# Answer-locked combat reactions

The Mage's staff and gripping hand are separate SVG layers clipped from the approved character atlas. Both Mage appearances wind up, turn the staff toward the opponent, cast lightning from the rotated tip, and recover. No character artwork is regenerated. Lightning, impact and recoil share a 1.2-second timeline; the next question begins after recovery.

Pip breathes a small ember on alternating accepted hits and final blows. The projectile runs from Pip toward the opponent's rendered position. It contributes to the existing scored hit: it never changes health, XP, or learning records. Knight and Archer retain their class effects on the same timeline.

Combat reactions require a locked, unassisted answer. Correct reactions wait for word narration. Pause, Home, teaching and question transitions remove effects and invalidate pending callbacks. Reduced-motion preferences suppress staff motion, lightning and travelling embers, retaining static feedback.

The review fixture now covers both Mage appearances, Mage/Pip final blows, Knight and Archer. The River Path fixture uses the exported migration API. Teaching atlases have an explicit cell clip so adjacent panels cannot show through aspect-ratio letterboxing.

Validation: 72 core tests and 18 DOM flow groups pass. Added checks cover all six hero appearances, narration ordering, a single damage event, final-blow assistance, pause/Home cancellation, and every selectable review fixture. Browser review follows deployment; this does not establish physical iPad behavior or listening quality. Expanded narration and synchronized word-boundary highlighting remain deferred.
