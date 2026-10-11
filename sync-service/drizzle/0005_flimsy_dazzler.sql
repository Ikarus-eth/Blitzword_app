CREATE TABLE `oral_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`device_id` text NOT NULL,
	`created_at` text NOT NULL,
	`state` text NOT NULL,
	`metadata` text NOT NULL,
	`summary` text
);
--> statement-breakpoint
CREATE TABLE `oral_parts` (
	`device_id` text NOT NULL,
	`assessment_id` text NOT NULL,
	`part` integer NOT NULL,
	`parts` integer NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`device_id`, `assessment_id`, `part`)
);
--> statement-breakpoint
CREATE TABLE `oral_quota` (
	`device_id` text NOT NULL,
	`day` text NOT NULL,
	`count` integer NOT NULL,
	PRIMARY KEY(`device_id`, `day`)
);
