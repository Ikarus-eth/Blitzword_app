# Encrypted GitHub progress mirror

Accepted 8 November 2026: automatic cross-assistant progress access using the existing public repository, not a new repository. Learner data must be encrypted before upload. The server holds GITHUB_MIRROR_TOKEN, PROGRESS_READING_KEY and GITHUB_MIRROR_DEVICE_ID as runtime secrets. The GitHub token needs Contents read/write for Ikarus-eth/Blitzword_app. No credential or reading key goes to Pages, source or Git history.

The progress-data branch has an independent root commit and only latest.enc.json plus a non-sensitive README. GitHub Pages continues to deploy main. Each update is gzip-compressed JSON encrypted with AES-256-GCM, a fresh random 96-bit IV, and authenticated additional data `blitzword-progress-mirror-v1`. The random 256-bit reading key is supplied privately to both projects. The ciphertext envelope has format, algorithm, compression, iv and ciphertext, with Base64 binary fields. Web Crypto appends the 128-bit authentication tag to ciphertext.

The report expands compact word tables, includes the latest summary/per-word reports/learning snapshot and saved oral reports, and states its historical limits. It excludes service credentials and pairing data. Readers use scripts/read-progress.mjs (Node 22+), feeding the key through stdin. An optional first argument is a local ciphertext file. Never write decrypted output into a tracked checkout.

The updated client asks the authenticated `/api/devices/:id/mirror` route after snapshot/history sync and on unchanged-save foreground flushes. It retries on reopening/resume/online and approximately every 30 seconds while open. Mirror failure does not cancel the successful original upload or pause the game. Same reports do not produce duplicate commits. GitHub commits use a file SHA precondition, reject older sequences, and never force-push. A per-device database lease serializes mirror writes and deletion, expires after 120 seconds after interrupted requests, and never changes the learner snapshot.

POST `/api/mirror/refresh` accepts the reading key as an Authorization Bearer header and republishes the existing server snapshot. It returns only mirror status, sequence and capture time, not the report. No device pairing token or ADMIN_KEY is disclosed. This endpoint cannot pull new data from a sleeping iPad.

Deletion removes the latest encrypted GitHub file before revoking the device and deleting server records; failed remote removal retains the existing retry intent. Prior encrypted commits remain in Git history and can be decrypted by anyone who retains the reading key. The parent confirmation states this limitation. Pausing leaves already-shared copies intact.

Tests cover authenticated encryption/tampering, selected-device routing, idempotence, failure retry, stale sequence protection, serialization/deletion, authorization and reopening without new answers. Deployment evidence is recorded in CURRENT_STATUS.md.
