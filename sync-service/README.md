# BlitzWord progress service

Maintained source for the Sites-hosted private progress receiver. The game remains at GitHub Pages. This directory is never copied to the Pages deployment artifact.

- Sites project: `appgprj_6acb06fb7e2c8191abedb468be5f0812`
- Service: https://blitzword-progress.ikarus-janzenoa.chatgpt.site
- Database: `DB`, table `devices`
- Runtime secret: `ADMIN_KEY` (32 random bytes, hexadecimal); never embed it or Sites service credentials in the game or a pairing link.
- Initial tested Sites source: `a0b4ff0c6edd4037ed63d33894c9e1e75b54b405`.

## Access and pairing

The site was deployed owner-private. Browser syncing requires the parent's explicit permission to make the endpoint internet-reachable. This is an audience change, not removal of application authentication: paired devices use a random upload-only key, no public progress-reading API exists, and administrators inspect records through authenticated Sites tools. Do not send a Sites sign-in bypass token to the iPad or bundle it in frontend code.

Create a single-use 48-hour pairing code with `POST /api/admin/pair`, using the runtime ADMIN_KEY as the Authorization Bearer value. When owner-private, service callers additionally need the existing `OAI-Sites-Authorization` bearer returned by `get_site`. Handle credentials in memory, never command arguments or logs. If the original administrator key is unavailable in a later session, configure a fresh random ADMIN_KEY through the native Sites environment tool and deploy the same saved version to apply it. This does not change paired-device keys or learner data.

Give the parent a link to `https://ikarus-eth.github.io/Blitzword_app/#sync=CODE`. The fragment stays out of the HTTP request and is immediately removed from the address bar by the game. The iPad creates and retains its own random upload key. Retrying the same pairing exchange is safe; another device cannot reuse the code. Pair the same Safari browser/origin used to play. Home Screen web-app storage can be separate: pairing a Safari tab does not prove the Home Screen game is paired. The Parents screen also accepts the personal pairing link through “Connect this game”, so it can be pasted inside the actual Home Screen app. Verify the Parents sharing status in the actual play context. A one-time pairing action on the iPad is necessary; do not ask the parent to copy secrets or exports into repository files.

## Reviewing progress

Call Sites `read_database_overview` then `read_database_table_rows` with exact returned binding/table names. `received_at` is the server receipt time, `sequence` is an upload generation, `summary` is a compact learning overview, and `snapshot` contains the latest redacted report. Some connector cells can be truncated: do not infer missing detail or make a chapter-four decision from a truncated record. The full snapshot is available to the owner in the Sites database viewer; `progress` uses `BlitzCore.unpackSave` to expand the lossless row-table representation. No profile name/age, custom dragon name, browser fingerprint or voice choice is intentionally included. Curriculum names are ordinary reading content.

The report includes word evidence, recent answer history and archived totals, timing, XP/stage and campaign/riddle progress. The latest local save is the durable offline queue; a failed upload does not clear it. Server updates are conditional on an increasing generation, preventing delayed older requests from replacing newer ones. No route imports anything into the playable save. Sync runs roughly every 30 seconds while visible, on opening/reconnection, on resume, and best effort when leaving. A closed/suspended iPad cannot promise live updates. The report is for learning review, not a restorable backup. Device keys live outside the exported learner save and are never copied by manual backup/restore. Reset pauses sharing so a new profile does not silently replace the previous report. Pause keeps the shared copy; Delete revokes the key and removes the report, retrying after offline periods. The revoked row retains only hashes/id/generation as a tombstone, with no snapshot or summary.

No scheduled review or notification automation was created. Automatic uploading and proactive reviewing are separate capabilities. The existing chapter-four import checkpoint remains in force.

## Build and publish

Use the Sites skill's existing-site workflow; retain project identity and access. Open the native source repository with a fresh scoped write credential, copy these maintained application/build/schema files into that checkout, and use the supported source helper for build, source push and packaging. Keep the hosting manifest's project ID and DB binding. Do not upload repository credentials or learner records. Database migrations are append-only.

Tests: `node --test tests/service.test.mjs` (Node with `node:sqlite`). Build with the Sites `build-site.mjs` helper after dependency installation. Main-game tests are run from the repository root. The backend is separately deployed; the existing GitHub Pages workflow only publishes the frontend.
