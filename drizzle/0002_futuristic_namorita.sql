ALTER TABLE "profiles" ALTER COLUMN "username" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "sketches" DROP COLUMN IF EXISTS "size";