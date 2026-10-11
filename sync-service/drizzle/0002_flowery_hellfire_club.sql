CREATE TABLE `progress_days` (
	`device_id` text NOT NULL,
	`record_key` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`sequence` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `record_key`, `part`)
);
--> statement-breakpoint
CREATE TABLE `progress_events` (
	`device_id` text NOT NULL,
	`record_key` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`sequence` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `record_key`, `part`)
);
--> statement-breakpoint
CREATE TABLE `progress_overview` (
	`device_id` text NOT NULL,
	`record_key` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`sequence` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `record_key`, `part`)
);
--> statement-breakpoint
CREATE TABLE `progress_parts` (
	`device_id` text NOT NULL,
	`record_key` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`sequence` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `record_key`, `part`)
);
--> statement-breakpoint
CREATE TABLE `progress_sessions` (
	`device_id` text NOT NULL,
	`record_key` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`sequence` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `record_key`, `part`)
);
--> statement-breakpoint
CREATE TABLE `progress_weeks` (
	`device_id` text NOT NULL,
	`record_key` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`sequence` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `record_key`, `part`)
);
--> statement-breakpoint
CREATE TABLE `progress_words` (
	`device_id` text NOT NULL,
	`record_key` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`sequence` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `record_key`, `part`)
);
