ALTER TABLE "profiles" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "profiles" ("username");