# Automatic iPad progress sharing — 11 October 2026

## Implemented

One-time personal pairing (link or Parents input for Home Screen apps), device-only upload keys, private reports, 30-second foreground sync, recovery after offline/reload, acknowledged increasing upload generations, pause/resume and deletion in Parents. The playable save stays local and remains authoritative. Names, age and custom dragon name are omitted. Reports include learning evidence, answer history, timing, XP and mission/riddle progress. Backend readers use authenticated Sites database access; there is no public read API. No monitoring automation is scheduled.

The backend is deployed and verified **owner-private** at https://blitzword-progress.ikarus-janzenoa.chatgpt.site. Site `appgprj_6acb06fb7e2c8191abedb468be5f0812`, deployment `appgdep_6acb08e8f3f881918b457bbf10da8667`, saved version `appgprj_6acb06fb7e2c8191abedb468be5f0812~appgver_532d427fc2008191ab6bc72015aeaa84`. It needs explicit audience-change approval before the GitHub Pages game can reach it without ChatGPT sign-in. Pairing on the actual iPad play context is then required; no learner device is connected yet.

## Verified frontend deployment

[PR #173](https://github.com/Ikarus-eth/Blitzword_app/pull/173) and [PR #174](https://github.com/Ikarus-eth/Blitzword_app/pull/174) are merged. Runtime commit `3bae8eef418f85367fa3b264e7909222d567e0b8`, build `progress-sync-20261011-r2`, [Pages run 38110487818](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/38110487818) succeeded. All four checked public runtime/review files match tested source: [hash evidence](DEPLOYMENT.json). CI ran the complete 388 game tests, five backend tests and 120 UI groups successfully. Endpoint activation and actual iPad pairing remain pending.

## Verification

- 388 main-game unit tests and 120 UI-flow groups pass.
- Five backend tests with actual SQLite cover administrator/device authentication, single-use and expiring pairing, retry, out-of-order protection, deletion/revocation, origin restrictions and payload size bounds.
- Eight client tests cover redaction, save preservation, unchanged-state suppression, offline/reload recovery, lower game revision after restore, pause/resume, deletion recovery, reset isolation and storage failures.
- Live private API verified with synthetic data: valid upload 200, unauthorised upload 401, stale upload preserves newer generation, deletion 200, revoked key 401. The authenticated database connector confirms synthetic payload and summary deleted.
- Parent panel checked at 1194×834: 18px explanation text and no horizontal overflow. Review harness explicitly disables syncing so it cannot touch real pairing settings or cloud copies.

Physical iPad and public-origin browser handshake remain unverified until activation/pairing. Paused/background/closed apps cannot guarantee timely uploads. Native database tool output may truncate full snapshots; the compact summary is provided separately.

[Service, pairing and future review instructions](../../sync-service/README.md).
