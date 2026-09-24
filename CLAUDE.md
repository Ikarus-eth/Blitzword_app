# BlitzWord: working rules for Claude

BlitzWord is an iPad-first English reading game for children. GitHub Pages deploys `main` to https://ikarus-eth.github.io/Blitzword_app/.

## Working method

- One approved point at a time; stop and report after each. Wait for the user's "go" before starting the next point.
- Each report gives: pull request(s), merge commit(s), Pages workflow run and result, live build marker, what the user should check on the iPad, and a two-line plan for the next point.
- The approved plan, its order and the parked items are in [current status](docs/CURRENT_STATUS.md) under "Outstanding work".

## Standing rules

- Current `main` is the source of truth for docs, code, curriculum and approved assets. Before working, read `README.md` and `docs/CURRENT_STATUS.md`. Use `docs/BLITZWORD_PRODUCT_SPEC.md` for approved product rules and `docs/BLITZWORD_REFERENCE_IMAGES.md` for artwork. Curriculum source: `curriculum/BLITZWORD_CURRICULUM_200_1000.xlsx`. Playable content: `content.js`.
- The user's latest explicit decisions override older docs. Record accepted changes in GitHub: decisions in the spec, verified implementation in `docs/CURRENT_STATUS.md`. Historical release notes are not the backlog.
- Continue the existing app. Preserve learner saves (localStorage key `blitzword_state_v1` and its `_backup`, `_legacy_backup`, `_unreadable_backup` and `_before_restore` keys) and parallel work. Never reset learner data to roll anything back.
- Deploy only through the existing workflow (`.github/workflows/pages.yml`). One task branch and pull request per change. Check current `main` right before merging and keep intervening changes. No force-push, no direct commits to `main`.
- For any runtime change, bump the `blitzword-build` meta tag and the `?v=` cache version of each changed file in `index.html`, as earlier releases did, so iPads load the new files. Confirm the live marker after deployment.
- Run `npm ci --ignore-scripts && npm test` before every pull request that changes code. Add tests for new behaviour. Change an existing test only when behaviour changes on purpose, and say why.
- Keep proposed, implemented, tested and deployed apart. Verify deployment before calling anything live. If access fails, report the exact error. Retry only with new evidence or a concrete fix.
- Re-check each finding in the approved plan against current `main` before acting on it.
- Reply style: direct, recommendation first, short. Tag non-trivial claims [F] verified, [I] inference, [S] speculation.
