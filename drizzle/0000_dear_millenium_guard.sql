CREATE TABLE `songs` (
	`id` text PRIMARY KEY NOT NULL,
	`song_name` text NOT NULL,
	`artist` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`requested_by` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
