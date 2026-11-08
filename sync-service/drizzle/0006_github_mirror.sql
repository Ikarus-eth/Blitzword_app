CREATE TABLE IF NOT EXISTS github_mirror_locks (
 device_id TEXT PRIMARY KEY NOT NULL,
 owner TEXT NOT NULL,
 expires_at INTEGER NOT NULL
);
