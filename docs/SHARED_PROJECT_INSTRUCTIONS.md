# BlitzWord shared project instructions

Use these same instructions for Codex and Claude.

BlitzWord is Ikarus's existing iPad-first English reading game for his son Artus (born 2 May 2019). Use Asia/Makassar for progress timestamps.

Repository: https://github.com/Ikarus-eth/Blitzword_app
Game: https://ikarus-eth.github.io/Blitzword_app/

## Source and maintenance

Use current main as the source of truth. Before working, read README.md and docs/CURRENT_STATUS.md. Consult docs/BLITZWORD_PRODUCT_SPEC.md for approved rules and docs/BLITZWORD_REFERENCE_IMAGES.md for artwork. Original curriculum: curriculum/BLITZWORD_CURRICULUM_200_1000.xlsx; playable content: content.js.

Continue the existing app. Retired mockups and historical release notes are not current requirements or backlog. Latest explicit user decisions override earlier documentation. Preserve learner saves, pairing and parallel work; never reset progress to fix deployment. Record accepted rules and verified implementation in the repository.

Use separate task branches and pull requests. Check current main before merging, preserve intervening changes and coordinate so only one assistant merges or deploys at a time. No force pushes or direct main commits. Use the existing GitHub Pages workflow. For changed runtime files, update cache versions and the build marker. Run npm ci --ignore-scripts and npm test for code changes. Distinguish proposed, implemented, tested and deployed; verify deployment before claiming it is live. Report exact access failures and retry only with new evidence or a concrete fix.

## Reading Artus's automatically shared progress

The existing paired iPad uploads redacted progress to the protected service. The service encrypts a readable report and writes it to the **progress-data** branch of the same repository, file **latest.enc.json**. This branch is data only; never merge it into main. Reopening/resuming the updated app and foreground sync request an update, including when the saved answers have not changed. No new pairing is needed for the already-connected iPad.

Read docs/progress-sync/GITHUB_MIRROR.md. Obtain PROGRESS_READING_KEY from the user's private project instructions or `private-progress-access/reading-key.txt` in the local ChatGPT project directory (outside the repository checkout). It is deliberately absent from GitHub. A GitHub deployment token is not the reading key. Never commit keys, decrypted reports, learner exports or credentials, and never put secrets in URLs, command arguments, app code or logs.

With Node 22 or newer, run scripts/read-progress.mjs from current main and pass the reading key through standard input. The script fetches and decrypts the latest report. It can also accept a downloaded encrypted file path as its only argument. No GitHub login is needed to download the ciphertext. A Claude session needs code execution with network access, or the encrypted file plus code execution; project instructions alone do not add tools.

The decrypted report contains capturedAt, receivedAt, sequence, summary, per-word reports, expanded learning progress and saved oral-reading reports. Quote capturedAt in Bali time and report stale snapshots honestly. Do not interpret word recognition response time as oral reading speed. Older compacted answers survive as aggregates; additional uploaded event history remains in the authenticated Sites database. Individual timestamps are UTC; archived daily totals use device-local dates, whose historical offsets can be unknown. This report is not a restorable backup.

For a refresh without the iPad, POST an empty JSON object to https://blitzword-progress.ikarus-janzenoa.chatgpt.site/api/mirror/refresh with the reading key as an Authorization Bearer header. This only republishes the latest server-stored report; it cannot retrieve unsent iPad activity or modify the game. Never describe that as fresh play data unless capturedAt changed.

Codex can additionally use authenticated Sites read_database_overview and read_database_table_rows for project appgprj_6acb06fb7e2c8191abedb468be5f0812, binding DB. Use returned table names, pagination and complete reassembled parts. Do not infer missing values from truncated cells.

For future curriculum or chapter design, review the latest learning evidence first; quest position is not mastery. The original chapter-four checkpoint has already been fulfilled by later supplied exports and implementation; do not repeat an obsolete request for that export.

## Privacy and concurrent work

Only ciphertext goes to the public repository. The reading key grants decryption and refreshing the encrypted copy, not write access to the iPad or GitHub. Both assistants can read simultaneously. Pausing sharing stops further iPad uploads; previously shared reports remain. Deleting sharing removes the current report, but old encrypted versions remain in Git history. Do not promise historical erasure. A closed iPad does not continuously upload.

Answer first and keep ordinary replies short. Separate checked evidence from inference. Ask only when a missing detail materially changes the result.
