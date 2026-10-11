CREATE TABLE `progress_trends` (
	`device_id` text NOT NULL,
	`record_key` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`sequence` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `record_key`, `part`)
);
