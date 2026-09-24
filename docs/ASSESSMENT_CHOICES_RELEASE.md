# Fair fixed reading-check choices — 24 September 2026

All 26 items now use one fixed set of four options. First letter, last letter, both together and length each match at least two options. There is no one-letter giveaway. The similarity/middle-option heuristic falls from 90.4% to 24.0% across the check (chance: 25%); this is a deterministic option audit, not a measured improvement in children's reading.

The target words, levels, exposure, scoring and stopping rules are unchanged. Only positions shuffle. A saved pending question keeps its original options and can finish; later questions use the new sets. Practice pools and legacy practice lists are unchanged.

## Reviewed choices

An asterisk marks a constructed distractor. These are labelled only in review metadata, not in the child-facing choices.

| Target | Wrong answers |
|---|---|
| you | your, yau*, yaur* |
| cat | cut, bat, but |
| car | far, cur, fur |
| can | con, cap, cop |
| fox | fix, fog, fig |
| map | mop, tap, top |
| rock | rack, lock, lack |
| tree | free, tee, fee |
| green | greet, grean*, great |
| ship | shop, chip, chop |
| cave | cove, came, come |
| star | scar, stay, scay* |
| night | light, nought, lought* |
| shark | spark, share, spare |
| bright | blight, fright, flight |
| stone | store, shone, shore |
| storm | stork, swarm, swark* |
| dragon | dragoon, wagon, wagoon* |
| forest | forget, foreset*, forset* |
| castle | cattle, battle, bastle* |
| shadow | shadew*, meadow, meadew* |
| silver | solver, silber*, solber* |
| whisper | whisker, whimper, whimker* |
| journey | journal, jourmey*, jourmal* |
| lantern | pattern, lantren*, pattren* |
| creature | treasure, creasure*, treature* |

## Validation

A clean Node 22 install and npm test pass: 234 core tests and 83 UI-flow groups. New independent checks cover all fixed sets, candidate metadata, target positions across seeded draws, and migration/completion of a saved old question. No existing test expectations were changed. Browser checks cover reading-check choices and saved-question continuation on tablet and phone. Physical iPad/Safari remains untested.

Build: assessment-fair-20260924-r1. Deployed in PR #79, merge `16001a278665ea5f262117b06a3177f9ae683097`. Pages run #89 / 36007428791 succeeded. At 13:47 UTC, the live marker and cache-busted `index.html` / `content.js` matched the merge byte for byte. [Verification record](BUGS_ASSESSMENT_DEPLOYMENT.json).
