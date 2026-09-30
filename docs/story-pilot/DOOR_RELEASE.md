# Tower-door riddle correction

Build `story-rescue-20260930-r3`, 30 September 2026.

The user reported that the final riddle's table and pictured doors did not agree. The artwork had blank plaques, the signs were shown as table rows away from the illustration, and answer positions were shuffled.

The tower now has a sun, crescent moon and star physically on its three doors, from left to right. Three matching sign cards sit beneath the picture in the same order, with full door labels. The answer doors use that order too, including on reload and replay. The reading text explicitly says a sign may name another door. The Moon sign now says “This door”, and the hint explains that it means the Moon door. The goal is the door leading to the cub, not the door carrying the true sign.

The logical solution remains Sun and the number remains 56. For Sun, the three signs are false / true / false. For Moon they are true / false / true. For Star they are false / true / true. Thus exactly one route fits the one-true-sign rule. This preserves the previous challenge and makes all previous answers valid; v2 progress is retained. Restoring an older shuffled door row corrects only its displayed order, leaving first checks, chosen IDs, hints, retries, completion and other stops intact. All other question orders remain unchanged.

One targeted built-in image-generation edit replaces the blank plaques. The original painting is retained; the new delivery asset is `assets/story-pilot/scenes/gate-labelled.webp`. [Prompt and provenance](DOOR_ARTWORK.json).

Validation: 267 automated tests and 90 main-app UI-flow groups pass. New regression coverage checks old-save preservation, fixed door order through replay, card labels and placement, and hint highlighting. Chromium checks covered wrong choice → hint → correction, saved selections on reload, successful rescue, and desktop / 768 px tablet / 320 px phone layouts. No browser warnings or errors. Physical iPad/Safari remains untested. [Checks and source hashes](DOOR_CHECKS.json).

Deployed and verified: [PR #109](https://github.com/Ikarus-eth/Blitzword_app/pull/109), merge `2629c4ff38c1354aadb0956ed1a97bdbacefd3ae`, [successful Pages run 36676683204](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/36676683204). All seven changed public files, including the new illustration, match tested source byte for byte. The live browser shows the r3 build, labelled image and correctly paired sign cards, with prior completed progress retained and no warnings or errors. [Live evidence](DOOR_DEPLOYMENT.json).
