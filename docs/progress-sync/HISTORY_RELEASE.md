# Readable sync history — 11 October 2026

Implemented; deployment verification pending. The parent authorized complete available history and longitudinal visibility. This release changes sync/reporting only; a parent-assisted oral reading check remains a separate next phase.

## Data and reliability

Existing pairing, device-local saves, GitHub Pages game hosting and the Sites receiver are preserved. The latest report is split into bounded 900-character parts with record key, part index, total parts and upload generation. Authenticated Sites database tools can page every part without a giant truncated cell. Reassemble by device, record key and ascending part; check that all parts are present. The full redacted snapshot remains available in `progress_parts`.

`progress_days`, `progress_weeks`, `progress_words`, `progress_sessions` and `progress_overview` expose the latest report. `progress_events` preserves the union of uploaded raw answers, assessment, teaching, help, completed sessions and number duels. `progress_trends` retains the latest observation of each UTC day rather than overwriting earlier days. All event records use stable kind/id/time keys to deduplicate retries and restored saves. Historical game-build identity is unavailable: an event's outer build denotes the build observing/importing it, not necessarily the build that originally generated it.

The main game's successful save captures retained raw events into a separate IndexedDB queue. It does not enlarge or modify the playable save. Queued events survive reload, offline play and the game's 500-answer compaction. Only explicit server acknowledgement removes queued payloads; small seen-key entries prevent repeated backfill. Up to 100 queued events upload per sync cycle, with automatic retries. Quota/unavailable-storage failures remain visible; do not claim gap-free history after a reported storage failure. Clearing browser storage can remove unsent events. Existing pairing needs no replacement.

The receiver indexes legacy v1 snapshots too. Owner-authenticated `POST /api/admin/reindex` with `{deviceId}` indexes an existing server snapshot, so the current available history can be inspected before the iPad next opens. This is a write-only maintenance operation, not a public read endpoint. Runtime ADMIN_KEY stays server-side/in session memory; never place it in the game or a repository. Revocation and deletion erase all report/event/trend tables atomically with the original snapshot. Pausing retains the shared history.

## Review protocol

1. Read the Sites database overview and `devices`; identify the established played profile, not the separately paired empty profile. Never use XP alone as a learning outcome.
2. Verify `history_sequence === sequence` before treating projected tables as complete. A mismatch means indexing is incomplete; retry sync/reindex, do not analyze mixed generations. Note `received_at` and `capturedAt`.
3. Read overview, days, weeks and trends; then relevant words/sessions/events. Use the exact connector `next_offset` and stop when null. Group multipart rows before interpreting JSON; never analyze a truncated or incomplete part set. Records of the latest snapshot use its sequence. Events and past daily observations intentionally remain from prior uploads.
4. Archived answer days use device-local dates; retained raw answer days are UTC, and active time uses device-local dates. They are stored separately. Historical timezone offsets were not saved, so do not pretend they form one exact daily series. Weekly retention uses the existing client algorithm and its explicit unknown-evidence flags.
5. Distinguish first attempts, supported answers, correctness, task, word, exposure, interruptions and sample sizes. Recognition response milliseconds include decision/tapping and are not oral words per minute. Archived timed totals include both correct and incorrect unaided answers.
6. Previously compacted individual answers cannot be recovered. Preserve their aggregate daily/word evidence, mark the limitation, and avoid inferred historical mastery dates or fabricated event detail. Riddle/map and story state remain in the complete snapshot; this release does not invent missing per-attempt records or integrate standalone story saves.

## Verification

404 unit/backend tests and 123 UI-flow groups passed before final completion-marker addition. Focused backend tests cover exact snapshot reconstruction, duplicate/out-of-order handling, backfill, immutable event retention and deletion. Browser IndexedDB smoke checks verify persistence, deduplication, acknowledgement and cleanup with synthetic data in a separate database. Final checks/deployment evidence will be recorded after publication. Physical iPad upload verification requires the actual game to reopen.
