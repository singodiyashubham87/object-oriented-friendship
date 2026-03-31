ALTER TABLE "message" ADD COLUMN "read_at" timestamp;--> statement-breakpoint
CREATE INDEX "sessions_ip_address_idx" ON "sessions" USING btree ("ip_address");