# Chapter stories — 23 September 2026

The first evolution already unlocks dragon naming at 3,000 XP. The child can keep Pip, choose another name or return to naming through the growth card. This release preserves that behavior and uses the saved name in story speech, reading sentences and image descriptions.

There are 34 new chapter-entry interactions across the existing 35 map fields and seven campaigns. The first guided encounter retains its approved short introduction. Each later chapter opens with a brief authored story over existing approved scenery and the selected hero/dragon art. After the narration finishes, Read reveals one untimed sentence. Listen provides optional spoken help; I read it continues to the waiting encounter. This is child-confirmed reading, not speech recognition or a scored assessment.

The scene stores its destination, waiting battle, introduction-heard status, reading phase and help use. Pause, Home, backgrounding, idle pause, Rest and reload keep that state. Unfinished narration can restart; a completed introduction need not replay, and the reading phase never automatically speaks the child's sentence. Completing a scene is idempotent. Existing in-progress questions, cleared chapters, earned forms, XP, shields and sound settings are preserved. Previously completed chapters do not create a backlog of story screens.

Stories grant no scored-answer XP, mastery evidence or chapter-completion time. The existing narrator chooses a recording when available and otherwise uses its immediate browser-speech fallback. Cancellation uses the existing narration generation guard. No new recordings or audio assets are generated. The adaptive soundscape release from main is retained and uses its quiet transition setting during story scenes.

Campaign means one five-chapter map; chapter means one field on that map. Map nodes, map descriptions and encounter/battle/result progress labels now name the actual campaign and chapter. Result progress refers to the battle's location, even when finishing it unlocks the next campaign. Existing internal chapter/area IDs remain unchanged for save compatibility.

Verification covers all 34 entries, intro/read save migration, repeated completion, no scoring side effects, speech fallback/cancellation, naming, Pause/Home/Rest/reload, idle time and later-campaign labels. Approved scenery is reused; this does not add 35 distinct background paintings. Physical iPad behavior and a child's actual reading experience still require device review.
