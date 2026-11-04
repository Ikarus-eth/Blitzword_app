# Two shields at once — 4 November 2026

The parent reported that the child wants to be able to earn a second shield. He chose: hold up to two shields, in both creature quests and chapter battles, shown as a ×2 badge on the shield friend.

## Cause

Every shield source shared one held slot. While a shield was held, the quest shield meter stopped counting and a won number duel granted nothing, so a careful child who kept his shield could never earn another.

## Change

- Up to two shields are held at once. Each stops one otherwise damaging mistake. The order of protection is unchanged: practice turns and the team animal’s once-per-quest block still come first.
- Creature quests: the meter keeps running while one shield is held. Still at most one shield per fight and two per attempt at a quest; a retry after a defeat restores the allowance as before.
- Chapter battles: three reading wins plus a won number duel add a shield when fewer than two are held. Duel and quest shields share the two slots.
- A second quest shield joins the friend already on the team; no second chooser opens. The friend shows a ×2 badge and leaves after the last shield is used. Battle feedback says "Second shield earned! Your friend can stop two hits."
- The hearts row, the Word trails map and the result card show the count (×2, "2 shields"); the duel result says "+1 shield · 2 held". Visible counts still change only when the hit lands.

## Saves

`rewards.shields` (0–2) is new. `rewards.shield` stays true while any shield is held, so older code paths and saves keep working. A save with a held shield and no count migrates to one; out-of-range counts are clamped.

Code: `adventure-core.js` (`MAX_SHIELDS`, `heldShields`, `setShields`, `supportOpen`, `earnSupport`), `game-core.js` (migration, shield use, `finishMath`), `app.js` and `adventure-ui.js` (badge and labels), `styles.css`. Build `two-shields-20261104-r1`.

## Verification

Two unit tests asserted the one-slot rule and were changed on purpose: "a legacy shield occupies the slot" and "earn exactly one persistent shield". New tests cover a held shield leaving room for one more, the two-held and two-per-attempt caps, two hits blocked one at a time with the friend leaving after the last, save migration, and a second duel shield. Two new UI-flow groups check the ×2 badge on the friend and hearts, the second-shield message, reload, the count waiting for impact, and the map label. Full suite: 458 unit/backend tests and 130 UI-flow groups pass. Headless Chromium rendered a quest battle with two shields at 1194×834, 844×390 and 390×844 with no page errors; the hearts-row badge was made smaller on phones and the friend badge moved to its hero-side corner after review, on top of the Pip-size layout from earlier today. Physical iPad not tested.
