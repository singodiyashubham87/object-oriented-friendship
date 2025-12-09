ALTER TABLE "user" ADD COLUMN "social_links" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
CREATE INDEX "bookmark_bookmarker_id_idx" ON "bookmark" USING btree ("bookmarker_id");--> statement-breakpoint
CREATE INDEX "bookmark_bookmarked_id_idx" ON "bookmark" USING btree ("bookmarked_id");--> statement-breakpoint
CREATE INDEX "chat_sender_id_idx" ON "chat" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "chat_receiver_id_idx" ON "chat" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "chat_last_message_at_idx" ON "chat" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "chat_id_idx" ON "message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "sender_id_idx" ON "message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "request_sender_id_idx" ON "request" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "request_receiver_id_idx" ON "request" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");