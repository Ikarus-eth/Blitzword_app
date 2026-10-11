CREATE TABLE `devices` (
	`id` text PRIMARY KEY NOT NULL,
	`pair_hash` text NOT NULL,
	`pair_expires` integer NOT NULL,
	`token_hash` text,
	`sequence` integer DEFAULT 0 NOT NULL,
	`received_at` text,
	`snapshot` text,
	`revoked` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devices_pair_hash_unique` ON `devices` (`pair_hash`);